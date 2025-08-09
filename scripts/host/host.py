import json
import sys

port = sys.argv[1]
ip = sys.argv[2]
destinyPath = sys.argv[3]

print(str(sys.argv))

hostObj = {}
hostObj["port"] = port
hostObj["ip"] = ip

print(destinyPath)
with open(destinyPath+'/host.json', 'w') as file:
    json.dump(hostObj, file, indent=4)