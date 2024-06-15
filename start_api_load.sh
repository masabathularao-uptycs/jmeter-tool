#!/bin/bash

git checkout main
git stash
git pull origin main

sh start.sh