#!/bin/bash

source .apubnode/config

# username, content, tolist
export username="$2"
export tolist="$3"

export action_datetime="$(date -Is | cut -c1-19)Z"

export userbasedir="$fs_prefix$path_user/$username"

[[ -z "$username" ]] && die 4 "'username' is empty."
[[ ! -z "$4" ]] && die 4 "Extra argument found."

mkdir -p "$fs_prefix$path_user/$username/activities"

export content_path=/tmp/apubnode-newnote.$USER.$username.$RANDOM$RANDOM$RANDOM$RANDOM.txt
debug "content_path = $content_path"
debug "cp /dev/stdin $content_path"
cp /dev/stdin "$content_path"
node "$DEST_PREFIX/helpers/newactivity.js" note
#  || die 3 'Helper script newactivity.js failed.'
rm "$content_path"

info "Created new note."


rebuild_site_for_user "$username"
