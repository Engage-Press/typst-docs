#!/bin/sh
# You can overwrite the typst directory by setting this variable
if [ -z "$EP_TYPST_DIR" ]
then
    EP_TYPST_DIR="${HOME}/builds/typst"
fi

mkdir -p "output"

typst_hash=$(typst --version | sed -e 's/^[^(]*(\([a-f0-9]*\)).*/\1/')
typst_hash_file="output/typst_hash"

if [ -f "${typst_hash_file}" ] && [ "$(cat "$typst_hash_file")" = "$typst_hash" ]
then
    echo "Looks like I already built the json for typst hash ${typst_hash}"
    echo "If you need to rebuild it, delete ${typst_hash_file}"
    exit 0
fi

(
    set -e
    if ! [ -d "${EP_TYPST_DIR}" ]
    then
        git clone "ssh://git@github.com/typst/typst" "${EP_TYPST_DIR}"
    fi
    cd "${EP_TYPST_DIR}/docs"
    git checkout "$typst_hash"
    CARGO_NET_GIT_FETCH_WITH_CLI=true cargo build
)

fatal() {
    echo "$*" >&2
    exit 1
}

typst_docs="${EP_TYPST_DIR}/target/debug/typst-docs"

if ! [ -f "$typst_docs" ]
then
    fatal "Couldn't find the typst-docs executable at $typst_docs"
fi

(
    cd output || exit 1
    "$typst_docs" > docs.json || exit 1
) || fatal "Build failed"

if [ -f "output/docs.json" ]
then
    echo "$typst_hash" > "$typst_hash_file"
else
    fatal "Build appeared to fail, not caching this version"
fi
