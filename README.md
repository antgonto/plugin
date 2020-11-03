# AVIB Plugin

This repository contains the code of the plugins for the Visual Studio and Eclipse IDE. It also has the projects with the docker contianers of the server, the webpage and database. 

Inside the `docker` folder you will find the projects for the server, webpage and databse. Each one has it's Dockerfile used to build the images uploaded to Docker Hub. With in each folder you will find a `README.md` with instructions of use for each one. 



## Continuos Integration

![Webpage CI](https://github.com/antgonto/plugin/workflows/Webpage%20CI/badge.svg)

**Last update 26-Oct-2020. The actions are currently DISABLED. Currently not using an external tool for CI/CD.**

This repository has actions configured that will build any changes done to the diferent projects in the `docker` folder. If the CI is done using a tool external to GitHub, then they will disabled. A line will be added to keep track of the current state. Keep it updated with the state and the date of the laste update. 
