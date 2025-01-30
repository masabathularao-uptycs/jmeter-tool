#!/bin/bash

# Read jmx_file from command-line argument or prompt user if not provided
if [ -z "$1" ]; then
  echo "Enter jmx_file (optional) (Press ENTER to set to default): "
  read jmx_file
  jmx_file=${jmx_file:-"GLOBAL_QUERY.jmx"}
else
  jmx_file=$1
fi

echo "Using jmx_file: ${jmx_file}"

# Read domain from command-line argument or prompt user if not provided
if [ -z "$2" ]; then
  echo "Enter domain name: "
  read domain
else
  domain=$2
fi
echo "Using domain: ${domain}"

properties_path="scripts/domain/${domain}.properties"
jmx_path="scripts/${jmx_file}"

# Check if properties file exists
if [ -f "$properties_path" ]; then
    echo "File '$properties_path' exists."
else
    echo "ERROR: File '$properties_path' does not exist."
    exit 1
fi

# Check if jmx file exists
if [ -f "$jmx_path" ]; then
    echo "File '$jmx_path' exists."
else
    echo "ERROR: File '$jmx_path' does not exist."
    exit 1
fi

set -e
if [ "$jmx_file" = "DetectionGraphsLoad" ]; then
    echo "Planning to start detection graphs load on ${domain} stack ..."
    python3 scripts/save_detection_ids_to_csv.py ${domain} scripts/csv_inputs
else
    echo "Not a detection graphs load"
fi

# Read load duration from command-line argument or prompt user if not provided
if [ -z "$3" ]; then
  echo "Enter duration of the load (in sec): "
  read DURATION
else
  DURATION=$3
fi
echo "Using duration: ${DURATION} seconds"

curr_time="$(date +'%Y-%m-%d_%H-%M-%S')" 
folder_name=${domain}_${DURATION}sec_${jmx_file}_${curr_time}
HEAP="-Xms2g -Xmx4g"

echo "Report folder name is: ${folder_name}"

nohup ./bin/jmeter.sh -t "${jmx_path}" -q "${properties_path}" -Jload_duration="${DURATION}" -n -l reports/jtl/"${folder_name}.jtl" -e -o reports/"${folder_name}" > out.log 2>&1 &