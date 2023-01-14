source .apubnode/config

export username="$2"

[[ -z "$username" ]] && die 4 "'username' is empty."
[[ ! -z "$3" ]] && die "Extra argument found."

export userbasedir="$fs_prefix$path_user/$username"

initialize_userbasedir "$userbasedir"



export fullname="$(jq -r .name "$userbasedir/Person.json")"
export summary="$(jq -r .summary "$userbasedir/Person.json")"

debug "fullname = $fullname"
debug "summary = $summary"




### Continue in Nodejs
node "$DEST_PREFIX/helpers/useradd.js"



info "Reset user '$fullname' at $(realpath "$userbasedir")"
