from io import StringIO
import pandas as pd
import numpy as np
import socket,paramiko
import sys

start_time_utc="2024-06-07 05:36"
end_time_utc="2024-06-09 20:46"
LIMIT = 100
# remote_node="s3configdb1"

if len(sys.argv) != 2:
    print("Usage: python3 save_detection_ids_to_csv.py.py <remote_node>")
    sys.exit(1)

remote_node = sys.argv[1]
print(f"Received remote_node input: {remote_node}")

base_path = sys.argv[2]
print(f"Received base_path input: {base_path}")

# base_path = "scripts/csv_inputs"
# query=f"SELECT DISTINCT incidents.id FROM incidents,LATERAL jsonb_array_elements(metadata_list) AS elem where created_at >= '{start_time_utc}' and created_at <= '{end_time_utc}' AND elem ? 'pid' and graph_id is null limit {LIMIT};"

query = f"""
SELECT distinct incidents.id
FROM incidents
WHERE created_at >= '{start_time_utc}' 
  AND created_at <= '{end_time_utc}' 
  AND graph_id is null 
  AND (
        (jsonb_typeof(metadata_list) = 'object' AND metadata_list ? 'pid')
        OR
        (jsonb_typeof(metadata_list) = 'array' AND EXISTS (
            SELECT 1
            FROM jsonb_array_elements(metadata_list) AS elem
            WHERE elem ? 'pid'
        ))
    ) LIMIT {LIMIT};
"""


def execute_command_in_node(node,command):
    try:
        print(f"Executing the command in node : {node}")
        client = paramiko.SSHClient()
        client.load_system_host_keys() 
        client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
        try:
            client.connect(node, 22, "abacus", "abacus")
            stdin, stdout, stderr = client.exec_command(command)
            out = stdout.read().decode('utf-8').strip()
            errors = stderr.read().decode('utf-8')
            if errors:
                print("Errors:")
                print(errors)
            return out
                
        except Exception as e:
            raise RuntimeError(f"ERROR : Unable to connect to {node} , {e}") from e
        finally:
            client.close()
    except socket.gaierror as e:
        raise RuntimeError(f"ERROR : Unable to connect to {node} , {e}") from e


def execute_configdb_query(node,query):
    configdb_command = f'sudo docker exec postgres-configdb bash -c "PGPASSWORD=pguptycs psql -U postgres configdb -c \\"{query}\\""'
    print(configdb_command)
    return execute_command_in_node(node,configdb_command)


print(query)
output=execute_configdb_query(remote_node,query)

stringio = StringIO(output)
df = pd.read_csv(stringio, header=None, names=["id"])
# print(df.columns)
print("length : " , df.shape[0])
df["id"]=df["id"].apply(lambda x : str(x.strip()))
df=df.iloc[2:-1]
# df.to_csv(f"{base_path}/detections.csv",index=False)

split_dfs = np.array_split(df, 10)
for i, split_df in enumerate(split_dfs):
    print(f"DataFrame {i+1}")
    # print(split_df)
    split_df.to_csv(f"{base_path}/detections_{i+1}.csv",index=False)
    print()


