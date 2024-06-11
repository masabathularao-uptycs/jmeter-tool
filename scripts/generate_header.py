import json
import datetime
import jwt
import urllib3

urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)

def open_js_safely(file: str) -> dict:
    """Open a json file without leaving a dangling file descriptor"""
    with open(file, "r") as fin:
        content = fin.read()
    return json.loads(content)

def generateHeaders(key: str, secret: str) -> dict:
    header = {}
    utcnow = datetime.datetime.utcnow()
    date = utcnow.strftime("%a, %d %b %Y %H:%M:%S GMT")
    exp_time = datetime.datetime.utcnow() + datetime.timedelta(days=365*100)
    try:
        authVar = jwt.encode({'iss':key, 'exp': exp_time},secret).decode("utf-8")
        print("hi")
    except:
        authVar = jwt.encode({'iss':key, 'exp': exp_time},secret)
        print("bye")
    authorization = "Bearer %s" % (authVar)
    header['date'] = date
    header['authorization'] = authorization
    header['Content-type'] = "application/json"
   
    decoded_token = jwt.decode(authVar, secret, algorithms=['HS256']) 
    # current_time = datetime.datetime.utcnow()
    print(decoded_token['exp'])
    # time_remaining = decoded_token['exp'] - current_time
    # print(time_remaining)
    
    print(header)
    # print(header['authorization'])
    return header

# demo1_api_key_path = "/Users/masabathulararao/Documents/apache-jmeter-5.6.2/bin/domain/jupiter/jupiter.json"

demo1_api_key_path = str(input("Enter domain name : "))
demo1_api_key_path+=".json"
demo1_api_key_path = "scripts/domain/"+demo1_api_key_path

data = open_js_safely(demo1_api_key_path)
key=data['key']
secret=data['secret']
customer_id = data["customerId"]
domain_url = data["domain"] + data["domainSuffix"]

bearer=generateHeaders(key,secret)

file1 = open(f"scripts/domain/{data['domain']}.properties", "w")
L = ["Authorisation1= %s \n"%bearer['authorization'] , f"customer_id= {customer_id} \n" , f"domain_url= {domain_url} \n"]
print(L)
file1.writelines(L)

# with open("queries.txt", "r") as queries:
#     queries_contents = queries.readlines()

# # Write the contents of the other file to the current file
# file1.writelines(queries_contents)

file1.close()
