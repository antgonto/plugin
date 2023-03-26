# AVIB Plugin

Este repositorio contiene el código de los plugin para Visual Studio y Eclipse IDE. El repositorio cuenta con cuatro proyectosÑ

1. El núcleo de la aplicación () con los contenedores docker del servidor, la página web y la base de datos.

Dentro de la carpeta `docker` encontrará los proyectos para el servidor, la página web y la base de datos. Cada uno tiene su Dockerfile utilizado para construir las imágenes cargadas en Docker Hub. Dentro de cada carpeta encontrará un `README.md` con instrucciones de uso para cada uno.



## Continuos Integration

![Webpage CI](https://github.com/antgonto/plugin/workflows/Webpage%20CI/badge.svg)

**Last update 26-Oct-2020. The actions are currently DISABLED. Currently not using an external tool for CI/CD.**

This repository has actions configured that will build any changes done to the diferent projects in the `docker` folder. If the CI is done using a tool external to GitHub, then they will disabled. A line will be added to keep track of the current state. Keep it updated with the state and the date of the laste update. 
