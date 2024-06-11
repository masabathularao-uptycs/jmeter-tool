#!/bin/bash

git checkout main
git stash
git pull origin main
#LOG_FILE="perf_load_report_$(date +'%Y-%m-%d_%H-%M-%S').log"
curr_time="$(date +'%Y-%m-%d_%H-%M-%S')" 

echo "Enter domain name : "
read domain

echo "enter duration of the load (in sec) : "
read DURATION

file_name=${domain}_${DURATION}_${curr_time}

echo "Base report file name is : "
echo ${file_name}

HEAP="-Xms2g -Xmx4g" ./bin/jmeter.sh -t scripts/ApiLoad.jmx -q scripts/domain/${domain}.properties -Jload_duration=${DURATION} -n -l reports/jtl/"${file_name}.jtl" -e -o reports/"${file_name}_report"
