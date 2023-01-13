function handle_unknown_subcmd() {
    die 1 "Unkonwn subcommand. Run 'apubnode help' for help."
}

function load_subcmd() {
    subcmd="$1"
    source "$DEST_PREFIX/subcommands/$subcmd.sh"
}
