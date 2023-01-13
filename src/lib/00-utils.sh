function die() {
    exitcode="$1"
    shift
    echo "[FATAL] $*" >&2
    exit $exitcode
}

function info() {
    echo "[INFO] $*"
}

function debug() {
    [[ "$ENABLE_DEBUG" == "y" ]] && echo "*  debug   $*"
}
