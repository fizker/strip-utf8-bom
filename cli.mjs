#!/usr/bin/env node

import fs from "fs"
import path from "path"
import { stripUTF8BOM } from "./index.mjs"

function findGitRoot() {
	let p = process.cwd()
	while(true) {
		const files = fs.readdirSync(p)
		if(files.includes(".git")) {
			return p
		}

		if(p === "/") {
			break
		}

		p = path.normalize(p + "/..")
	}
	return null
}

const gitRoot = findGitRoot()

const filenames = process.argv.slice(2)
	.flatMap(x => {
		const lines = x.trim().split(/\r?\n/g)

		return lines.map(x => {
			const matches = x.match(/<root>(\/.*?) contains the UTF8 BOM\. Please remove it/)
			const filename = (matches || [])[1]
			if(filename == null) {
				return x
			}

			if(gitRoot == null) {
				throw new Error("Could not find git root")
			}

			return gitRoot + filename
		})
	})

stripUTF8BOM(filenames)
