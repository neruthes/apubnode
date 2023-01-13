all:
    chmod +x scriptlets/*.sh
    just build
    just local_install

build:
    bash scriptlets/build.sh

local_install:
    sudo bash scriptlets/local_install.sh

release_check:
    bash scriptlets/release_check.sh

release:
    bash scriptlets/release.sh
