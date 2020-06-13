#!/bin/bash
git pull origin server
sudo docker-compose down
sudo docker rmi node-server
sudo docker-compose up --build
