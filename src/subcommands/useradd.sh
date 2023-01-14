#!/bin/bash

source .apubnode/config

export fullname="$2"
export username="$3"
export summary="$4"

[[ -z "$fullname" ]] && die 4 "'fullname' is empty."
[[ -z "$username" ]] && die 4 "'username' is empty."
[[ -z "$summary" ]] && die 4 "'summary' is empty."
[[ ! -z "$5" ]] && die "Extra argument found."

export userbasedir="$fs_prefix$path_user/$username"
mkdir -p "$userbasedir"/{items,activities,followers,following,inbox,outbox,liked}


### Generate a Keypair
mkdir -p .apubnode/privkeys
openssl genrsa -out .apubnode/privkeys/$username.pem 2048
openssl rsa -in .apubnode/privkeys/$username.pem -outform PEM -pubout -out "$userbasedir"/public.pem



### Continue in Nodejs
node "$DEST_PREFIX/helpers/useradd.js"



info "Added user '$fullname' at $(realpath "$userbasedir")"
