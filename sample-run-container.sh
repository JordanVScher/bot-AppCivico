#!/bin/bash

# arquivo de exemplo para iniciar o container
export SOURCE_DIR='/home/Ubuntu/bot_appcivico'
export DATA_DIR='/tmp/Ubuntu/bot_appcivico/'

# confira o seu ip usando ifconfig docker0|grep 'inet addr:'
export DOCKER_LAN_IP=$(ifconfig docker0 | grep 'inet addr:' | awk '{ split($2,a,":"); print a[2] }')

# porta que será feito o bind
export LISTEN_PORT=1010

docker run --name bot_appcivico \
 -v $SOURCE_DIR:/src -v $DATA_DIR:/data \
 -p $DOCKER_LAN_IP:$LISTEN_PORT:2300 \
 --cpu-shares=512 \
 --memory 1800m -dit --restart unless-stopped appcivico/bot_appcivico
