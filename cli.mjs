#!/usr/bin/env node

import fs from "fs"
import path from "path"
import { stripUTF8BOM, hasBOM } from "./index.mjs"

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

// lazy construct that overwrites itself once it have been run once
let gitRoot = () => {
	const root = findGitRoot()
	gitRoot = () => root
	return root
}

const isCheck = process.argv.find(x => x == "--check" || x == "-c") != null
if(isCheck) {
	const filename = process.argv.slice(2).find(x => !x.startsWith("-"))
	const exitCode = await hasBOM(filename) ? 1 : 0
	process.exit(exitCode)
}

const filenames = process.argv.slice(2)
	.flatMap(x => {
		const lines = x.trim().split(/\r?\n/g)

		return lines.map(x => {
			const matches = x.match(/<root>(\/.*?) contains the UTF8 BOM\. Please remove it/)
			const filename = (matches || [])[1]
			if(filename == null) {
				return x
			}

			if(gitRoot() == null) {
				throw new Error("Could not find git root")
			}

			return gitRoot() + filename
		})
	})

await stripUTF8BOM(filenames)
