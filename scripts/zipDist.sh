#!/bin/bash

# https://unix.stackexchange.com/questions/182032/zip-the-contents-of-a-folder-without-including-the-folder-itself
cd ./dist
zip -r ../dist.zip .
