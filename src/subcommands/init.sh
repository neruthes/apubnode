debug "argv[0]: $0"
debug "argv[1]: $1"
debug "argv[2]: $2"
debug "argv[3]: $3"

mkdir -p .apubnode/privkeys

if [[ "$2" == force ]]; then
    FORCE_INIT=y
fi

if [[ -e ".apubnode" ]] && [[ "$FORCE_INIT" != y ]]; then
    die 2 "A repo already exists here!"
fi


### Copy example config file
MYIP="$(ip route get $DEST | grep -oE 'src [.:0-9a-f]+' | cut -d' ' -f2)"
cat $DEST_PREFIX/assets/config.example.txt | sed "s|127.0.0.1|$MYIP|g" | > .apubnode/config

source .apubnode/config

### Initialize webfinger
mkdir -p $fs_prefix/.well-known
cat $DEST_PREFIX/assets/webfinger.example.json > $fs_prefix/.well-known/webfinger










info "A website repo has been initialized here."
info "Edit '.apubnode/config' to configure website repo."
