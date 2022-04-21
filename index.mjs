import * as fs from "fs"

export function stripUTF8BOM(filenames) {
	filenames.forEach(filename => {
		let content = fs.readFileSync(filename)
		if(content[0] === 239 && content[1] === 187 && content[2] === 191) {
			content = content.slice(3)
		}
		fs.writeFileSync(filename, content)
	})
}
