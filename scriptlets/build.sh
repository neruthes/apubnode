#!/bin/bash


[[ -e dist ]] && rm -rf dist
mkdir -p dist

cat src/main/*.sh > dist/apubnode
