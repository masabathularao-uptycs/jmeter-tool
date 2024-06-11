## Generate `<domain>.properties` file (One time setup)
1. Pull/Clone this repo to your local and make a commit with following changes
2. download api key for your domain from the UI and save it to scripts/domain/`<domain>.json`
3. Run ```python3 /scripts/generate_header.py``` and enter your domain name to generate `<domain>.properties` file.
4. git commit and push the changes

## Start API load
1. Clone this repo to the machine from where you want to run the API load. (Ignore if already cloned)
2. ```cd jmeter-tool``` and run ```./start_api_load.sh```
3. enter your domain name and load duration to start API load to start the load

4. Pass the report folder name in `reports` folder as input to the save-report-to-mongo tool during report generation to add API load report to the Performance Load Report. 
(The Report folder name can also be found printed in the terminal after executing ```./start_api_load.sh```)

NOTE : Install java and python to run the tool if not already installed.