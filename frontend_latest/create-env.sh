#!/bin/bash

echo "{" > env.json
git rev-parse --short=8 HEAD | awk '{print "\"COMMIT_HASH\":" "\"" $0 "\"" ","}' >> env.json
date +"%d-%m-%Y %T %Z" | awk '{print "\"COMMIT_DATE\":" "\"" $0 "\""}' >> env.json
echo "}" >> env.json
