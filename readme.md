# strip-utf8-bom

A tool for stripping the UTF-8 byte-order-marker from files.

Since UTF-8 can only have one byte-order by spec, the BOM is unnecessary. [It is even recommended by the spec to avoid!](http://www.unicode.org/versions/Unicode5.0.0/ch02.pdf)


## Using the tool (CLI)

This is meant as a CLI for easily stripping UTF-8. It can be used as such in the following manner:

1. Install the current Node.js LTS (Node.js v. 16+ is supported, earlier versions are untested but may work).
2. `npm i -g strip-utf8-bom`
3. `strip-utf8-bom <file...>`


## Using the tool (node.js)

It also supports being used as in a node.js app:

1. `npm i -D strip-utf8-bom`
2. In the code:
	```js
	import { stripUTF8BOM } from "strip-utf8-bom"

	await stripUTF8BOM(file1, file2, [ file3, file4 ])
	```

The `stripUTF8BOM()` function takes 1 or more files, or an array of files, and starts processing them. It returns a promise that resolves when all files have been processed.

## Testing for BOM

The module also supports testing a single file to see if it starts with the UTF-8 BOM.

To use this from the CLI, pass in either the `--check` or `-c` flag: `strip-utf8-bom --check <file>`. The CLI exists with 0 if the file does not have a BOM, and with 1 if it does start with the BOM.

To use this from node.js, import the `hasBOM` function instead of (or in addition to) the `stripUTF8BOM` function:

```js
import { hasBOM } from "strip-utf8-bom"

if(await hasBOM(file1)) {
	// the file starts with the UTF-8 BOM
}
```

Note that in both cases, if multiple files are passed in, only the first file will be checked.
