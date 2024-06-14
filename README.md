## Generate `<domain>.properties` file (One time setup)
1. Pull/clone this repo to your local and make a commit with following changes
2. download api key for your domain from the UI and save it to scripts/domain/`<domain>.json`
3. Run ```python3 /scripts/generate_header.py``` and enter your domain name to generate `<domain>.properties` file.
4. git commit and push the changes

## Start API Performance load
1. Clone this repo to the machine from where you want to run the API load. (Ignore if already cloned)
2. ```cd jmeter-tool``` and run ```./start_api_load.sh```
3. enter your domain name and load duration to start the performance API load

## Link this api load report to main Performance load report
1. Pass the name of the report folder for the current test (which will be saved to `reports` folder after the load) as input to the save-report-to-mongo tool during report generation
2. This will add the link to API load report in the Main Performance Load Report. 
(The Report folder name can also be found printed in the terminal after executing ```./start_api_load.sh```)

## Help for Feature Testings
1. This repo contains various kinds of apis including assets api, detection graphjob api, investigate queries api, vulnerabilities and compliance apis.. etc.
2. For your test, you can make a copy of the main jmx file, comment the unnecessary apis that you dont need for your test and also tune the parameters if needed.

## Command to open Jmeter in non-CLI mode
```
HEAP="-Xms2g -Xmx4g" ./bin/jmeter.sh -t scripts/GLOBAL_QUERY.jmx -q scripts/domain/<domain>.properties -Jload_duration=<duration_in_sec> 
```

NOTE 1 : Install java and python3 to run the tool if not already installed. 
<br>
NOTE 2 : ```cd reports``` and run ```nohup python3 -m http.server 8001 > /dev/null 2>&1 &``` to view the Jmeter reports. (ignore of already done)
<br>
NOTE 3 : You can view the logs of the current test in jmeter.log file.
