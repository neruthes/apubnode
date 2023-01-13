# Building This Project


## With Just

Just is an alternative to Make, written in Rust.

```
$ just build
$ just local_install          # For development
$ just install                # For distribution maintainer
```

## Manual Build

```
bash scriptlets/build.sh
sudo bash scriptlets/local_install.sh       # For development
sudo bash scriptlets/distro_install.sh      # For distribution maintainer
```
