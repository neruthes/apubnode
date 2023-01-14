source .apubnode/config

# username, content, tolist
export username="$2"

debug "list_subdirs_of $fs_prefix$path_user"
debug "$(list_subdirs_of "$fs_prefix$path_user")"

if [[ -z "$username" ]]; then
    for userbasedir in $(list_subdirs_of "$fs_prefix$path_user"); do
        username="$(basename $userbasedir)"
        rebuild_site_for_user "$username"
    done
else
    rebuild_site_for_user "$username"
fi
