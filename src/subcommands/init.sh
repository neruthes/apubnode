#!/bin/bash

debug "argv[0]: $0"
debug "argv[1]: $1"
debug "argv[2]: $2"
debug "argv[3]: $3"

if [[ "$2" == force ]]; then
    FORCE_INIT=y
fi

if [[ -e ".apubnode" ]] && [[ "$FORCE_INIT" != y ]]; then
    die 2 "A repo already exists here!"
fi

mkdir -p .apubnode
cat $DEST_PREFIX/assets/config.example.txt > .apubnode/config
info "A website repo has been initialized here."
info "Edit '.apubnode/config' to configure website repo."
