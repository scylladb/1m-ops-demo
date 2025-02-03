from flask import Flask, send_from_directory, abort
from flask_socketio import SocketIO
from flask_cors import CORS
import os
import subprocess
import configparser
import json


app = Flask(__name__, 
    static_folder='dist',
    static_url_path='')
CORS(app) 
socketio = SocketIO(app, cors_allowed_origins="http://localhost:5173")

env = os.environ.copy()
env["PYTHONUNBUFFERED"] = "1"
env["ANSIBLE_FORCE_COLOR"] = "1"

program_cwd = os.path.dirname(os.path.abspath(__file__))
terraform_data_folder = os.path.join(program_cwd, "frontend/public/data")

with open(terraform_data_folder + "/terraform-data.json", 'r') as file:
    tf_data = json.load(file) 

ansible_folder = os.path.join(program_cwd, f"{tf_data['demo']}/ansible")
data_folder = os.path.join(program_cwd, "frontend/public/data") 

@app.route("/")
def index():
    try:
        return send_from_directory(app.static_folder, 'index.html')
    except FileNotFoundError:
        abort(404)
    except Exception as e:
        print(f"An error occurred: {e}")
        return f"Error: {str(e)}", 500

@app.route("/data/<path:filename>")
def serve_data(filename):
    try:
        return send_from_directory(data_folder, filename)
    except FileNotFoundError:
        abort(404)
    except Exception as e:
        print(f"An error occurred while serving data: {e}")
        return f"Error: {str(e)}", 500

# Global process variable
globals()["process"] = None

def run_ansible_playbook(playbook_path):
    playbook_cmd = ["ansible-playbook", playbook_path]
    process = subprocess.Popen(playbook_cmd, stdout=subprocess.PIPE, stderr=subprocess.STDOUT, text=True, cwd=ansible_folder)
    for line in process.stdout:
        socketio.emit("playbook_output", {"output": line})
        socketio.sleep(0)
    process.wait()

@socketio.on("original_cluster")
def handle_original_cluster():
    run_ansible_playbook(ansible_folder + "/1_original_cluster.yml")

@socketio.on("sample_data")
def handle_sample_data():
    run_ansible_playbook(ansible_folder + "/2_restore_snapshot.yml")

@socketio.on("start_stress")
def handle_start_stress():
    run_ansible_playbook(ansible_folder + "/3_stress.yml")

@socketio.on("scale_out")
def handle_scale_out():
    run_ansible_playbook(ansible_folder + "/4_scale_out.yml")

@socketio.on("stop_stress")
def handle_stop_stress():
    run_ansible_playbook(ansible_folder + "/5_stop_stress.yml")

@socketio.on("scale_in")
def handle_scale_in():
    run_ansible_playbook(ansible_folder + "/6_scale_in.yml")


def parse_ansible_inventory(inventory_file):
    config = configparser.ConfigParser(allow_no_value=True)
    config.optionxform = str  # Preserve case sensitivity

    # Read the inventory file
    config.read(inventory_file)

    inventory = {}
    for section in config.sections():
        hosts = {}
        for item in config.items(section):
            hostname, *variables = item[0].split()
            host_vars = dict(var.split('=') for var in variables)
            hosts[hostname] = host_vars
        inventory[section] = hosts

    return inventory

if __name__ == "__main__":
    socketio.run(app, host='0.0.0.0', port=5000, allow_unsafe_werkzeug=True)