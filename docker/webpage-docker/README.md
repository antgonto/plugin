# Instructions
Created by Pablo Garcia Brenes
Version: 1.0
Date: June 2020

## Create image
`sudo docker build --tag olbapd/avib-webpage .`

## Create and run container
`sudo docker run  -p 8090:8090  -p 1617:1617 olbapd/avib-webpage --name avib-webpage`

If you want to run the container in detach mode then you can run this command.

`sudo docker run -d -p 8090:8090 -p 1617:1617 olbapd/avib-webpage --name avib-webpage`