#!/bin/bash

BRANCH=$1

now --name radar-dasboard-$BRANCH --token $NOW_TOKEN
now radar-dasboard-$BRANCH --token $NOW_TOKEN

exit 0
