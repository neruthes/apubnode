function update_user_outbox() {
    export username="$1"
    export userbasedir="$2"
    touch "$userbasedir"/outbox/{index,main}.json
    node $DEST_PREFIX/helpers/update-outbox.js
    info "Updated the outbox of $username at '$userbasedir/outbox/main.json'"
}

function update_user_profile_html() {
    export username="$1"
    export userbasedir="$2"

    cat "$tmpldir/profile.html" |
        sed "s|_SITENAME_|$sitename|g" |
        sed "s|_FULLNAME_|$fullname|g" |
        sed "s|_USERNAME_|$username|g" > "$userbasedir/index.html"

    mkdir -p "$userbasedir/status"
    cat "$tmpldir/status.html" |
        sed "s|_SITENAME_|$sitename|g" |
        sed "s|_FULLNAME_|$fullname|g" |
        sed "s|_USERNAME_|$username|g" > "$userbasedir/status/index.html"

    info "Updated '$userbasedir/status/index.html'"
}

function rebuild_site_for_user() {
    ### This functions calls all functions above
    ### Avoid using those functions individually
    source .apubnode/config
    export username="$1"
    export userbasedir="$fs_prefix$path_user/$username"
    export fullname="$(jq -r .name "$userbasedir/Person.json")"
    export defaulttmpldir="$DEST_PREFIX/assets/html-templates"
    export tmpldir="$DEST_PREFIX/assets/html-templates"
    if [[ -e "html-templates" ]]; then
        export tmpldir="html-templates"
    fi
    if [[ -e ".apubnode/html-templates" ]]; then
        export tmpldir=".apubnode/html-templates"
    fi
    
    update_user_outbox "$username" "$userbasedir"
    
    cat "$tmpldir/global.css" > "$fs_prefix$path_user/global.css"
    cat "$tmpldir/profile.css" > "$fs_prefix$path_user/profile.css"
    cat "$tmpldir/status.css" > "$fs_prefix$path_user/status.css"
    cat "$defaulttmpldir/profile.js" > "$fs_prefix$path_user/profile.js"
    cat "$defaulttmpldir/status.js" > "$fs_prefix$path_user/status.js"

    # touch $fs_prefix$path_user/custom-{global,profile}.js
    for jsname in global profile; do
        fn="$fs_prefix$path_user/custom-$jsname.js"
        touch "$fn"
        debug "wc -l $fn : '$(wc -l $fn)'"
        if [[ $(wc -l "$fn") == "0 "* ]]; then
            info "Should write some comments in the files..."
            # [[ $jsname == global ]] && echo "// Write your own extra logic here. Use window.addEventListener('load', ...) to make sure that" > "$fn"
        fi
    done
    
    update_user_profile_html "$username" "$userbasedir"
}
