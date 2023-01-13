subcmd="$1"

case "$subcmd" in
    help | init | useradd)
        load_subcmd $*
        ;;
    '')
        load_subcmd help
        ;;
    *)
        # Unkonwn subcommand
        handle_unknown_subcmd
        ;;
esac
