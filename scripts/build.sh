#! /bin/bash

cd $(dirname $0)
cd ../..

mkdir -p static-site/generated

port=$(cat ./static-site/port)

if [ -e "./content/port" ]; then
  port=$(cat ./content/port)
fi

ip=$(hostname -I)
python3 ./static-site/scripts/host/host.py $port $ip ./static-site/generated