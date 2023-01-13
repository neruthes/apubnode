#!/bin/bash

help_topic="$2"
if [[ -z "$help_topic" ]]; then
    ### General help
    sed "s|APPVER|$APPVER|g" $DEST_PREFIX/assets/help_message.txt
else
    ### For a specific topic
    msgfn="$DEST_PREFIX/assets/helpTopic.$help_topic.txt"
    if [[ -e "$msgfn" ]]; then
        printf "Showing help message for topic '$help_topic'\n\n\n"
        cat "$msgfn"
    fi
fi
