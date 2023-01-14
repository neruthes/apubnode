function handle_unknown_subcmd() {
    die 1 "Unkonwn subcommand. Run 'apubnode help' for help."
}

function load_subcmd() {
    subcmd="$1"
    subcmdpath="$DEST_PREFIX/subcommands/$subcmd.sh"
    if [[ -e $subcmdpath ]]; then
        source "$subcmdpath"
    else
        ### Unkonwn subcommand
        handle_unknown_subcmd
    fi
}
