#!/bin/bash

source src/main/01-constants.sh

if [[ -z $(git tag | grep "^$APPVER$") ]]; then
    echo "[OK] Great, no git tag '$APPVER' yet."
fi



echo "[INFO] All checks passed. Now you can proceed to create a release."
