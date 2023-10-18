const fs = require('fs').promises
const fetch = require('node-fetch')
const { Writable } = require('stream');

module.exports = class Download {
	#api
	constructor(api, data) {
		this.#api = api
		this.downloadUrl = data.downloadLink ?? data.downloadUrl
		if (this.#api.platform === 'bedrock') {
			this.token = data.token
			this.size = data.size
			this.fileExtension = '.mcworld'
		} else {
			this.resourcePackUrl = data.resourcePackUrl
			this.resourcePackHash = data.resourcePackHash
			this.fileExtension = '.tar.gz'
		}
	}

	async writeToDirectory(directory, showProgress = false, filename = 'world') {
		return (showProgress ? this.#downloadWorldWithProgress() : this.#downloadWorld())
			.then(buffer => fs.writeFile(`${directory}/${filename}${this.fileExtension}`, buffer))
	}

	async getBuffer() {
		return this.#downloadWorld()
	}

	async #downloadWorld() {
		const res = await fetch(this.downloadUrl, {
			headers: (this.token) ? { Authorization: `Bearer ${this.token}` } : {}
		})

		if (!res.ok) throw new Error(`Failed to download world: ${res.status} ${res.statusText}`)

		return await res.buffer()
	}

	async #downloadWorldWithProgress() {
		const res = await fetch(this.downloadUrl, {
			headers: (this.token) ? { Authorization: `Bearer ${this.token}` } : {}
		});

		if (!res.ok) throw new Error(`Failed to download world: ${res.status} ${res.statusText}`);

		const totalSize = parseInt(res.headers.get('content-length'), 10);
		let downloadedSize = 0;

		const progressBar = (size) => {
			downloadedSize += size;
			const percentage = ((downloadedSize / totalSize) * 100).toFixed(2);
			process.stdout.clearLine();
			process.stdout.cursorTo(0);
			process.stdout.write(`Progress: [${'#'.repeat((percentage / 10).toFixed(0))}] ${percentage}%`);
		};

		return new Promise((resolve, reject) => {
			const fileChunks = [];
			res.body
				.on('data', (chunk) => {
					fileChunks.push(chunk);
					progressBar(chunk.length);
				})
				.on('end', () => {
					process.stdout.write('\n');
					resolve(Buffer.concat(fileChunks));
				})
				.on('error', reject);
		});
	}
}
