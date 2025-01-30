#!/bin/bash

git checkout main
git stash
git pull origin main

sh start.sh

#pgsharding load sample command : 
# sh start.sh pgsharding_apiload.jmx cosmos 3600