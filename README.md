# Typst-docs — Build a local mirror of the typst documentation

[typst][typst] is one of my favorite tools; for me, it just solves the problem
of typesetting. However, I can't fit the entire (very complicated) language in
my head; and there's no offline mirror of the [typst documentation][typstdocs],
which isn't helpful when my internet cuts out (comcast moment).

This repository builds a local copy of the documentation from a Typst source
tree.  The intended use case is as a mirror, to use when your internet is down.

## Requirements

- [Git version control][gitscm].
- A unix-compatible environment capable of running shell scripts.
- [typst][typst] should be installed, as the script attempts to build docs for
  your currently installed version.
- A relatively recent version of [node][nodejs] (I developed using node
  v24.4.1).
- A Rust toolchain capable of building typst's internal documentation tool.
- Enough hard drive space to clone a typst source tree (~4 gigabytes) and to
  build the doc tree (about 45 megabytes).
- (Optional) Python 3.

## Usage

1. Run `./build-json.sh`. This puts the typst source tree into `EP_TYPST_DIR`,
   or `"${HOME}/builds/typst"` if that is not set, and creates an `output`
   directory with a big json blob called `docs.json` and some preview assets.
2. If that ran successfully, run `./build-site.js`.  The docs site will be
   created in `output`.
3. All the docs assume they are at the root of the site they are run from.  If
   you have python installed, you can host the directory locally at port 8000 by
   running `./preview.sh`.

## License

Apache 2.0 (the same license as [typst upstream][typstrepo]).

[typst]: https://typst.app
[typstdocs]: https://typst.app/docs
[typstrepo]: https://github.com/typst/typst
[gitscm]: https://git-scm.com/
[nodejs]: https://nodejs.org/
