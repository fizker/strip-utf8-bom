#!/usr/bin/env node

const fs = require("fs")
const path = require("path")

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

filenames.forEach(filename => {
	let content = fs.readFileSync(filename)
	if(content[0] === 239 && content[1] === 187 && content[2] === 191) {
		content = content.slice(3)
	}
	fs.writeFileSync(filename, content)
})
