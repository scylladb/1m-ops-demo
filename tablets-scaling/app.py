from flask import Flask, send_from_directory, render_template_string, abort
from flask_socketio import SocketIO
import os
import subprocess
import configparser

app = Flask(__name__)
socketio = SocketIO(app)

env = os.environ.copy()
env["PYTHONUNBUFFERED"] = "1"
env["ANSIBLE_FORCE_COLOR"] = "1"

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
VALID_STATIC_DIRS = ['js', 'css', 'img', 'fonts', 'data']

def read_file_to_string(file_path):
    """
    Reads the file and returns it as a string.
    
    :param file_path: Path to the file
    :return: The contents of the file as a string
    """
    try:
        with open(file_path, 'r') as file:
            content = file.read()
        return content
    except FileNotFoundError:
        print(f"Error: File not found at {file_path}")
        return ""
    except Exception as e:
        print(f"An error occurred: {e}")
        return ""


@app.route('/<folder>/<path:filename>')
def serve_static(folder, filename):
    if folder not in VALID_STATIC_DIRS:
        abort(404, description=f"Invalid static folder: {folder}")
    file_path = os.path.join(BASE_DIR, folder, filename)
    if not os.path.exists(file_path):
        abort(404, description=f"File not found: {filename}")
    return send_from_directory(os.path.join(BASE_DIR, folder), filename)


@app.route("/")
def index():
    return render_template_string(read_file_to_string("index.html"))

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
    program_cwd = os.path.dirname(os.path.abspath(__file__))
    ansible_folder = os.path.join(program_cwd, "ansible")

    socketio.run(app, host='0.0.0.0', port=5000, allow_unsafe_werkzeug=True)

