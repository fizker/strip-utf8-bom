import { promises as fs } from "fs"

export async function stripUTF8BOM(...filenames) {
	for(const filename of filenames.flat()) {
		let content = await fs.readFile(filename)
		if(content[0] === 239 && content[1] === 187 && content[2] === 191) {
			content = content.slice(3)
		}
		await fs.writeFile(filename, content)
	}
}
