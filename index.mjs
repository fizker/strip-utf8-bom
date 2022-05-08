import { promises as fs } from "fs"

export async function stripUTF8BOM(...filenames) {
	for(const filename of filenames.flat()) {
		const filehandle = await fs.open(filename, "r")
		const { buffer } = await filehandle.read({
			buffer: Buffer.alloc(3),
		})

		const didFindBOM = buffer[0] === 239 && buffer[1] === 187 && buffer[2] === 191
		if(!didFindBOM) {
			continue
		}

		const content = await filehandle.readFile({ encoding: "utf8" })
		await filehandle.close()
		await fs.writeFile(filename, content)
	}
}
