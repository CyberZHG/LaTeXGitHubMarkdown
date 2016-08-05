#!/usr/bin/env bash

folders=("chrome" "firefox")

# Copy common files.
for folder in ${folders[@]}
do
    cp -rf common/* $folder
done
