# Python extension for Visual Studio Code

A [Visual Studio Code](https://code.visualstudio.com/) extension with rich support for the [Starlark language](https://github.com/bazelbuild/starlark).

Because Starlark syntax is a subset of Python, we can use the excellent vscode-python extension with Starlark files with only minor adjustments.
The support is not specific to bazel files, but adds Linting and IntelliSense for all .star files.

Currently supported features:
- Syntax highlighting
- Linting through pylint
- Jump-to-definition for function calls
- Function description on hover
- Code autocomplete

The extension is quite functional, however I'm still working on it. Please let me know if something doesn't work.
