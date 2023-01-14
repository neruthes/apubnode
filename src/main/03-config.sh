conffile="$HOME/.config/apubnode/apubnode.conf"
if [[ -e "$conffile" ]]; then
    source "$conffile"
fi





[[ "$FORCE_DEBUG" == y ]] && export ENABLE_DEBUG=y
