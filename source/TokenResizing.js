import { promises as Fs } from "fs";
import Sharp from "sharp";

const PATH = "P:\\Game\\Cartography\\Tokens";

(async () =>
{
	const tokens = (await Fs.readdir(PATH, { recursive: true, withFileTypes: true }))
		.filter(file => !file.name.startsWith("-") && (file.name.endsWith(".png") || file.name.endsWith(".jpg")));
	
	for (const token of tokens)
	{
		if (token.isDirectory() || token.name.endsWith(".txt"))
			continue;

		const filePath = `${token.path}\\${token.name}`;
		console.log(`Processing ${filePath}...`);

		const image = new Sharp(filePath);
		const trimmedImage = new Sharp(await image.trim({ threshold: 0 }).toBuffer());
		const metadata = await trimmedImage.metadata();
		const largestDimension = Math.max(metadata.width, metadata.height);
		const newDimension = Math.ceil(largestDimension / 70) * 70;

		// Extend the size of the image without resizing the actual image using
		// a transparent white background
		const imageData = await image
			.extend(
			{
				background: { r: 255, g: 255, b: 255, alpha: 0 },
				bottom: Math.floor((newDimension - metadata.height) / 2.0),
				left: Math.ceil((newDimension - metadata.width) / 2.0),
				right: Math.floor((newDimension - metadata.width) / 2.0),
				top: Math.ceil((newDimension - metadata.height) / 2.0)
			})
			.toBuffer();

		const resized = await new Sharp(imageData);
		const resizedMetadata = await resized.metadata();
		await resized.toFile(filePath);
		console.log(`Resized ${filePath} to ${resizedMetadata.width}x${resizedMetadata.height}`);
	}
})();