#!/bin/bash

source .apubnode/config

# username, content, tolist
export username="$2"

debug "find $fs_prefix$path_user -mindepth 1 -maxdepth 1 -type d"
debug "$(find $fs_prefix$path_user -mindepth 1 -maxdepth 1 -type d)"

if [[ -z "$username" ]]; then
    for userbasedir in $(find $fs_prefix$path_user -mindepth 1 -maxdepth 1 -type d); do
        username="$(basename $userbasedir)"
        rebuild_site_for_user "$username"
    done
else
    rebuild_site_for_user "$username"
fi
