function write_default_user_jsonld() {
    username="$1"
    userbasedir="$fs_prefix$path_user/$username"
    dirs="inbox followers following liked"
    for d in $dirs; do
        sed "s|(PROFILE_URL)|$site_prefix$path_user/$username/g" $DEST_PREFIX/assets/user_jsonld-$d.index.json > "$userbasedir/$d/index.json"
        sed "s|(PROFILE_URL)|$site_prefix$path_user/$username/g" $DEST_PREFIX/assets/user_jsonld-$d.main.json > "$userbasedir/$d/main.json"
    done
}

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

    info "Updated '$userbasedir/index.html'"

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





#
# And other features...
#
function initialize_userbasedir() {
    userbasedir="$1"
    mkdir -p "$userbasedir"/{items,activities,followers,following,inbox,outbox,liked}
}




#
# Play with Cloudflare Pages Functions
#
function add_webfinger_cfp_func() {
    source .apubnode/config
    mkdir -p "${fs_prefix}functions/.well-known"
    jspath="${fs_prefix}functions/.well-known/webfinger.js"
    cat $DEST_PREFIX/assets/webfinger.js > "$jspath"
    info "Installed 'webfinger.js' at '$jspath'"
echo '{
    "version": 1,
    "include": ["/*"],
    "exclude": []
}' > "${fs_prefix}_routes.json"

    ### Additionally, overwrite the _headers file
    cat $DEST_PREFIX/assets/cfp_headers.txt > "${fs_prefix}_headers"
    info "Installed '_headers' at '${fs_prefix}_headers'"
}
