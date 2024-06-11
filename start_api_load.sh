#!/bin/bash

git checkout main
git stash
git pull origin main
curr_time="$(date +'%Y-%m-%d_%H-%M-%S')" 

echo "Enter domain name : "
read domain

properties_path="scripts/domain/${domain}.properties"

# Check if the file exists
if [ -f "$properties_path" ]; then
    echo "File '$properties_path' exists."
else
    echo "ERROR : File '$properties_path' does not exist."
    exit 1
fi

echo "enter duration of the load (in sec) : "
read DURATION

file_name=${domain}_${DURATION}_${curr_time}

echo "Report folder name is : "
echo ${file_name}

HEAP="-Xms2g -Xmx4g" 
nohup ./bin/jmeter.sh -t scripts/ApiLoad.jmx -q scripts/domain/${domain}.properties -Jload_duration=${DURATION} -n -l reports/jtl/"${file_name}.jtl" -e -o reports/"${file_name}" > out.log 2>&1 &
