subcmd="$1"

case "$subcmd" in
    '')
        load_subcmd help
        ;;
    *)
        load_subcmd "$@"
        ;;
esac
