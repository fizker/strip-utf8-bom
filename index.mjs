import { promises as fs } from "fs"

async function _hasBOM(fd) {
	const { buffer } = await fd.read({
		buffer: Buffer.alloc(3),
	})

	return buffer[0] === 239 && buffer[1] === 187 && buffer[2] === 191
}

export async function hasBOM(filename) {
	const fd = await fs.open(filename, "r")
	const hasBOM = _hasBOM(fd)
	await fd.close()
	return hasBOM
}

export async function stripUTF8BOM(...filenames) {
	for(const filename of filenames.flat()) {
		const filehandle = await fs.open(filename, "r")

		if(!await _hasBOM(filehandle)) {
			await filehandle.close()
			continue
		}

		const content = await filehandle.readFile({ encoding: "utf8" })
		await filehandle.close()
		await fs.writeFile(filename, content)
	}
}
