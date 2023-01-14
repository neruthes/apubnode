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




function list_subdirs_of() {
    main_dir="$1"
    find "$main_dir" -mindepth 1 -maxdepth 1 -type d
}
