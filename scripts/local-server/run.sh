#! /bin/bash

port=$1
ip=$(hostname -I)
rootDir=$2
contentDir=$3
node $(dirname $0)/server/index.js $rootDir $contentDir $ip $port