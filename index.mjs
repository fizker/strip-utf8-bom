import { promises as fs } from "fs"

export async function stripUTF8BOM(...filenames) {
	const tasks = filenames.flat().map(filename => async () => {
		let content = await fs.readFile(filename)
		if(content[0] === 239 && content[1] === 187 && content[2] === 191) {
			content = content.slice(3)
		}
		await fs.writeFile(filename, content)
	})

	await tasks.reduce((p, t) => p.then(t), Promise.resolve())
}
