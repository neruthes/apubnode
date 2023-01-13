#!/bin/bash

###
### Figure out how this script is installed, local or distro
###
if [[ -z $(realpath $0 | grep /local/) ]]; then
    export INSTALLATION_MODE=distro
    export DEST_PREFIX=/usr/share/applib/apubnode
else
    export INSTALLATION_MODE=local
    export DEST_PREFIX=/usr/local/applib/apubnode
fi


###
### Initialize some variables which may be changed by config file
###
[[ "$INSTALLATION_MODE" == "local" ]] && ENABLE_DEBUG=y
