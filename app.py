from flask import Flask, send_from_directory, abort, request, jsonify
from flask_socketio import SocketIO
from flask_cors import CORS
import os
import subprocess
import configparser
import json
import re


app = Flask(__name__, 
    static_folder='dist',
    static_url_path='')
CORS(app) 
socketio = SocketIO(app, cors_allowed_origins="http://localhost:5173")

env = os.environ.copy()
env["PYTHONUNBUFFERED"] = "1"
env["ANSIBLE_FORCE_COLOR"] = "1"

program_cwd = os.path.dirname(os.path.abspath(__file__))

user_tf_variables_file = "user.tfvars.json"
config_file = "config.json"
demo_config_file = "demo-config.json"
data_folder = os.path.join(program_cwd, "frontend/public/data")


def read_selected_demo():
    with open(demo_config_file, "r") as json_file:
        return json.load(json_file)["demo"]

def create_tf_vars_file(variables, output_folder):
    with open(f"{output_folder}/{user_tf_variables_file}", 'w') as file:
        json.dump(variables, file, indent=4) 

def clean_console_output(line):
    ansi_escape = re.compile(r'\x1b\[[0-9;]*m')
    clean_line = ansi_escape.sub('', line)
    socketio.emit("playbook_output", {"output": clean_line.strip()+"\n"})

@app.route("/")
def index():
    try:
        return send_from_directory(app.static_folder, 'index.html')
    except FileNotFoundError:
        abort(404)
    except Exception as e:
        print(f"An error occurred: {e}")
        return f"Error: {str(e)}", 500
    
@app.route("/choose-demo", methods=["POST"])
def choose_demo():
    chosen_demo = request.json['demo']
    with open(demo_config_file, "w") as json_file:
        json.dump({"demo": chosen_demo}, json_file, indent=4)
    ansible_folder = os.path.join(program_cwd, f"{chosen_demo}/ansible")
    tf_folder = os.path.join(program_cwd, chosen_demo)
        
    # terraform init
    with open(config_file, "r") as json_file:
        create_tf_vars_file(json.load(json_file), tf_folder)
    cmd = ["terraform", "init"]
    process = subprocess.Popen(cmd, stdout=subprocess.PIPE, stderr=subprocess.STDOUT, text=True, cwd=tf_folder)
    for line in process.stdout:
        clean_console_output(line)
        socketio.sleep(0)
    clean_console_output("\nTerraform init complete!")
    process.wait()
    return "Demo selected and Terraform initialized", 200


@app.route("/tf-plan", methods=["GET"])
def terraform_plan():
    chosen_demo = read_selected_demo()
    tf_folder = os.path.join(program_cwd, chosen_demo)
    print(tf_folder)
    cmd = ["terraform", "plan", f"-var-file={user_tf_variables_file}"]

    process = subprocess.Popen(cmd, stdout=subprocess.PIPE, stderr=subprocess.STDOUT, text=True, cwd=tf_folder)
    
    for line in process.stdout:
        clean_console_output(line)
        socketio.sleep(0)
    
    clean_console_output("\nTerraform plan complete!")
    process.wait()
    return "Terraform plan finished", 200


def calculate_read_write_ratio(reads, writes):
    target_sum = 10
    total_ops_per_sec = reads + writes
    read_per_sec = (reads / total_ops_per_sec) * target_sum
    write_per_sec = (writes / total_ops_per_sec) * target_sum
    return read_per_sec, write_per_sec


@app.route("/tf-apply", methods=["POST"])
def terraform_apply():
    tf_vars = request.json
    chosen_demo = ""
    # read chosen demo
    chosen_demo = read_selected_demo()
   
    tf_folder = os.path.join(program_cwd, chosen_demo)
    # read and write  TF variables
    with open(f"{tf_folder}/{user_tf_variables_file}", "r") as json_file:
        variables = json.load(json_file) 
        
    read_write_ratios = calculate_read_write_ratio(tf_vars["readOps"], tf_vars["writeOps"])
    new_variables = {
        "scylla_node_type": tf_vars["scylla_instance_type"],
        "scylla_node_count": tf_vars["scylla_node_count"],
        "loader_node_count": tf_vars["numberOfLoaders"],
        "loader_ops_per_sec": (tf_vars["readOps"] + tf_vars["writeOps"]),
        "loader_read_ratio": int(read_write_ratios[0]),
        "loader_write_ratio": int(read_write_ratios[1]),
    }
    variables.update(new_variables)
    with open(f"{tf_folder}/{user_tf_variables_file}", "w") as json_file:
        json.dump(variables, json_file, indent=4)
        
    cmd = ["terraform", "apply", "-auto-approve", f"-var-file={user_tf_variables_file}"]        
    
    process = subprocess.Popen(cmd, stdout=subprocess.PIPE, stderr=subprocess.STDOUT, text=True, cwd=tf_folder)
    for line in process.stdout:
        clean_console_output(line)
        socketio.sleep(0)
    clean_console_output("\nTerraform apply complete!")
    process.wait()
    return "Terraform apply finished", 200
    
@app.route("/tf-destroy", methods=["GET"])
def terraform_destroy():
    chosen_demo = read_selected_demo()
    tf_folder = os.path.join(program_cwd, chosen_demo)
    cmd = ["terraform", "destroy", "-auto-approve", f"-var-file={user_tf_variables_file}"]

    process = subprocess.Popen(cmd, stdout=subprocess.PIPE, stderr=subprocess.STDOUT, text=True, cwd=tf_folder)
    for line in process.stdout:
        clean_console_output(line)
        socketio.sleep(0)
    process.wait()
    clean_console_output("\nTerraform destroy complete!")
    return "Terraform destroy finished", 200

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