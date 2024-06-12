#!/bin/bash

git checkout main
git stash
git pull origin main

jmx_file="GLOBAL_QUERY"

echo "Enter domain name : "
read domain

properties_path="scripts/domain/${domain}.properties"
jmx_path="scripts/${jmx_file}.jmx"

# Check if the file exists
if [ -f "$properties_path" ]; then
    echo "File '$properties_path' exists."
else
    echo "ERROR : File '$properties_path' does not exist."
    exit 1
fi

# Check if the file exists
if [ -f "$jmx_path" ]; then
    echo "File '$jmx_path' exists."
else
    echo "ERROR : File '$jmx_path' does not exist."
    exit 1
fi

echo "enter duration of the load (in sec) : "
read DURATION

curr_time="$(date +'%Y-%m-%d_%H-%M-%S')" 
folder_name=${domain}_${DURATION}sec_${jmx_file}_${curr_time}
HEAP="-Xms2g -Xmx4g"

echo "Report folder name is : "
echo ${folder_name}
 
nohup ./bin/jmeter.sh -t ${jmx_path} -q ${properties_path} -Jload_duration=${DURATION} -n -l reports/jtl/"${folder_name}.jtl" -e -o reports/"${folder_name}" > out.log 2>&1 &
