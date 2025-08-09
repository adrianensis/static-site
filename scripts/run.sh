#! /bin/bash

cd $(dirname $0)
cd ../..

catch_kill() {
  echo "Caught SIGKILL signal!"
  kill -KILL $$ 2>/dev/null
}

catch_term() {
  echo "Caught SIGTERM signal!"
  kill -TERM -$$ 2>/dev/null
}

catch_quit() {
  echo "Caught SIGTERM signal!"
  kill -QUIT -$$ 2>/dev/null
}

catch_ctrlc() {
  echo "Caught ctrl+c!"
  kill -KILL -$$ 2>/dev/null
}

trap catch_term SIGTERM
trap catch_kill SIGKILL
trap catch_quit SIGQUIT
trap catch_ctrlc INT

port=$(cat ./static-site/port)

if [ -e "./content/port" ]; then
  port=$(cat ./content/port)
fi

# firefox
xdg-open http://localhost:$port &
./static-site/scripts/local-server/run.sh $port $(pwd) content

# sleep infinity
