#!/bin/bash

# check_vars="DEST_PREFIX BIN_DIR"
# for myvar in check_vars; do
#     if [[ -z "${!myvar}" ]]; then
#         echo "[ERROR] $myvar is not set!"
#         exit 1
#     fi
# done


verbatimdirs="lib subcommands helpers assets assets/html-templates"

for dir in $verbatimdirs; do
    find "$DEST_PREFIX"/$dir -delete
    mkdir -p "$DEST_PREFIX"/$dir
    for fn in $(ls src/$dir); do
        filemod=644
        [[ $fn == *.sh ]] && filemod=755
        install -v -m$filemod "src/$dir/$fn" "$DEST_PREFIX/$dir/$fn"
    done
done

install -v -m755 dist/apubnode $BIN_DIR/apubnode
