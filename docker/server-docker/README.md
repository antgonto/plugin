# Instructions
Created by Pablo Garcia Brenes
Version: 1.0
Date: June 2020

## Create image
`sudo docker build --tag olbapd/avib-server .`

## Create and run container
`sudo docker run  -p 1617:1617  olbapd/avib-server --name avib-server`

If you want to run the container in detach mode then you can run this command.

`sudo docker run -d -p 1617:1617 olbapd/avib-server --name avib-server`