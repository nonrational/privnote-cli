#!/bin/bash
# simple example bash wrapper with clipboard support

cd $HOME/src/privnote-cli
url=$(node privnote-cli.js "$@")
echo $url | pbcopy && echo $url