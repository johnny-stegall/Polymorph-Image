import { promises as Fs } from "fs";
import Sharp from "sharp";
import test from "ava";
import PolymorphImage from "../source/shared/PolymorphImage.js";

test.before("Get test image", async t =>
{
	t.context.hallucinateData = Buffer.from(await Fs.readFile("Polymorph-Image.avif"));
})

test("convertImage() converts an image URL", async t =>
{
	// Arrange
	const EXPECTED = "tests/images/convertImage-Image-URL-Expected.png";
	const OUTPUT = "tests/images/convertImage-Image-URL.png";
	const options =
	{
		format: "png",
		image: new URL("https://upload.wikimedia.org/wikipedia/commons/thumb/4/44/Microsoft_logo.svg/2048px-Microsoft_logo.svg.png"),
		width: 500,
		height: 500
	};

	// Act
	const image = await PolymorphImage.convertImage(options);
	await Sharp(image).toFile(OUTPUT);

	// Assert
	t.is((await Fs.stat(OUTPUT).size), (await Fs.stat(EXPECTED).size));
});

test("convertImage() converts an image URL with SVG data", async t =>
{
	// Arrange
	const EXPECTED = "tests/images/convertImage-Image-URL-SVG-data-Expected.png";
	const OUTPUT = "tests/images/convertImage-Image-URL-SVG-data.png";
	const options =
	{
		format: "png",
		image: new URL("https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_logo.svg"),
		width: 500,
		height: 500
	};

	// Act
	const image = await PolymorphImage.convertImage(options);
	await Sharp(image).toFile(OUTPUT);

	// Assert
	t.is((await Fs.stat(OUTPUT).size), (await Fs.stat(EXPECTED).size));
});

test("convertImage() converts an image URL with data", async t =>
{
	// Arrange
	const EXPECTED = "tests/images/convertImage-Image-URL-base64-image-data-Expected.avif";
	const OUTPUT = "tests/images/convertImage-Image-URL-base64-image-data.avif";
	const options =
	{
		format: "png",
		image: new URL("data:image/png;base64,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"),
		width: 500,
		height: 500
	};

	// Act
	const image = await PolymorphImage.convertImage(options);
	await Sharp(image).toFile(OUTPUT);

	// Assert
	t.is((await Fs.stat(OUTPUT).size), (await Fs.stat(EXPECTED).size));
});

test("convertImage() converts an image Buffer", async t =>
{
	// Arrange
	const EXPECTED = "tests/images/convertImage-Buffer-Expected.png";
	const OUTPUT = "tests/images/convertImage-Buffer.png";
	const options =
	{
		format: "png",
		image: t.context.hallucinateData,
		width: 500,
		height: 500
	};

	// Act
	const image = await PolymorphImage.convertImage(options);
	await Sharp(image).toFile(OUTPUT);

	// Assert
	t.is((await Fs.stat(OUTPUT).size), (await Fs.stat(EXPECTED).size));
});

test("convertImage() converts an image Uint8Array", async t =>
{
	// Arrange
	const EXPECTED = "tests/images/convertImage-Uint8Array-Expected.png";
	const OUTPUT = "tests/images/convertImage-Uint8Array.png";
	const options =
	{
		format: "png",
		image: t.context.hallucinateData,
		width: 500,
		height: 500
	};

	// Act
	const image = await PolymorphImage.convertImage(options);
	await Sharp(image).toFile(OUTPUT);

	// Assert
	t.is((await Fs.stat(OUTPUT).size), (await Fs.stat(EXPECTED).size));
});

test("convertImage() converts an image ReadableStream", async t =>
{
	// Arrange
	const EXPECTED = "tests/images/convertImage-ReadableStream-Expected.png";
	const OUTPUT = "tests/images/convertImage-ReadableStream.png";
	const options =
	{
		format: "png",
		image: t.context.hallucinateData,
		width: 500,
		height: 500
	};

	// Act
	const image = await PolymorphImage.convertImage(options);
	await Sharp(image).toFile(OUTPUT);

	// Assert
	t.is((await Fs.stat(OUTPUT).size), (await Fs.stat(EXPECTED).size));
});

test("convertImage() converts an image Readable", async t =>
{
	// Arrange
	const EXPECTED = "tests/images/convertImage-Readable-Expected.png";
	const OUTPUT = "tests/images/convertImage-Readable.png";
	const options =
	{
		format: "png",
		image: t.context.hallucinateData,
		width: 500,
		height: 500
	};

	// Act
	const image = await PolymorphImage.convertImage(options);
	await Sharp(image).toFile(OUTPUT);

	// Assert
	t.is((await Fs.stat(OUTPUT).size), (await Fs.stat(EXPECTED).size));
});

test("convertImage() throws an error with an unsupported image type", async t =>
{
	// Arrange
	const options =
	{
		format: "png",
		image: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/44/Microsoft_logo.svg/2048px-Microsoft_logo.svg.png",
		width: 500,
		height: 500
	};

	// Act & Assert
	await t.throwsAsync(async () => await PolymorphImage.convertImage(options), { instanceOf: TypeError });
});

test("convertImage() converts an image to AVIF", async t =>
{
	// Arrange
	const EXPECTED = "tests/images/convertImage-Expected.avif";
	const OUTPUT = "tests/images/convertImage.avif";
	const options =
	{
		format: "avif",
		image: t.context.hallucinateData,
		width: 500,
		height: 500
	};

	// Act
	const image = await PolymorphImage.convertImage(options);
	await Sharp(image).toFile(OUTPUT);

	// Assert
	t.is((await Fs.stat(OUTPUT).size), (await Fs.stat(EXPECTED).size));
});

test("convertImage() converts an image to GIF", async t =>
{
	// Arrange
	const EXPECTED = "tests/images/convertImage-Expected.gif";
	const OUTPUT = "tests/images/convertImage.gif";
	const options =
	{
		format: "gif",
		image: t.context.hallucinateData,
		width: 500,
		height: 500
	};

	// Act
	const image = await PolymorphImage.convertImage(options);
	await Sharp(image).toFile(OUTPUT);

	// Assert
	t.is((await Fs.stat(OUTPUT).size), (await Fs.stat(EXPECTED).size));
});

test("convertImage() converts an image to JPG", async t =>
{
	// Arrange
	const EXPECTED = "tests/images/convertImage-Expected.jpg";
	const OUTPUT = "tests/images/convertImage.jpg";
	const options =
	{
		format: "jpg",
		image: t.context.hallucinateData,
		width: 500,
		height: 500
	};

	// Act
	const image = await PolymorphImage.convertImage(options);
	await Sharp(image).toFile(OUTPUT);

	// Assert
	t.is((await Fs.stat(OUTPUT).size), (await Fs.stat(EXPECTED).size));
});

test("convertImage() converts an image to TIFF", async t =>
{
	// Arrange
	const EXPECTED = "tests/images/convertImage-Expected.tiff";
	const OUTPUT = "tests/images/convertImage.tiff";
	const options =
	{
		format: "tiff",
		image: t.context.hallucinateData,
		width: 500,
		height: 500
	};

	// Act
	const image = await PolymorphImage.convertImage(options);
	await Sharp(image).toFile(OUTPUT);

	// Assert
	t.is((await Fs.stat(OUTPUT).size), (await Fs.stat(EXPECTED).size));
});

test("convertImage() converts an image to WEBP", async t =>
{
	// Arrange
	const EXPECTED = "tests/images/convertImage-Expected.webp";
	const OUTPUT = "tests/images/convertImage.webp";
	const options =
	{
		format: "webp",
		image: t.context.hallucinateData,
		width: 500,
		height: 500
	};

	// Act
	const image = await PolymorphImage.convertImage(options);
	await Sharp(image).toFile(OUTPUT);

	// Assert
	t.is((await Fs.stat(OUTPUT).size), (await Fs.stat(EXPECTED).size));
});

test("resizeImage() uses the specified fit", async t =>
{
	// Arrange
	const EXPECTED = "tests/images/resizeImage-Fit-Expected.png";
	const OUTPUT = "tests/images/resizeImage-Fit.png";
	const options =
	{
		fit: "fill",
		format: "png",
		image: t.context.hallucinateData,
		width: 500,
		height: 500
	};

	// Act
	const image = await PolymorphImage.resizeImage(options);
	await Sharp(image).toFile(OUTPUT);

	// Assert
	t.is((await Fs.stat(OUTPUT).size), (await Fs.stat(EXPECTED).size));
});

test("resizeImage() fills an image background with the specified color", async t =>
{
	// Arrange
	const EXPECTED = "tests/images/resizeImage-Background-Expected.png";
	const OUTPUT = "tests/images/resizeImage-Background.png";
	const options =
	{
		background: "#ffc0cb",
		fit: "contain",
		format: "png",
		image: t.context.hallucinateData,
		width: 500,
		height: 500
	};

	// Act
	const image = await PolymorphImage.resizeImage(options);
	await Sharp(image).toFile(OUTPUT);

	// Assert
	t.is((await Fs.stat(OUTPUT).size), (await Fs.stat(EXPECTED).size));
});

test("resizeImage() uses the specified dimensions", async t =>
{
	// Arrange
	const EXPECTED = "tests/images/resizeImage-Dimensions-Expected.png";
	const OUTPUT = "tests/images/resizeImage-Dimensions.png";
	const options =
	{
		format: "png",
		image: t.context.hallucinateData,
		width: 1024,
		height: 768
	};

	// Act
	const image = await PolymorphImage.resizeImage(options);
	await Sharp(image).toFile(OUTPUT);

	// Assert
	t.is((await Fs.stat(OUTPUT).size), (await Fs.stat(EXPECTED).size));
});

test("resizeImage() uses the specified kernel", async t =>
{
	// Arrange
	const EXPECTED = "tests/images/resizeImage-Kernel-Expected.png";
	const OUTPUT = "tests/images/resizeImage-Kernel.png";
	const options =
	{
		format: "png",
		image: t.context.hallucinateData,
		kernel: "nearest",
		width: 1000,
		height: 1000
	};

	// Act
	const image = await PolymorphImage.resizeImage(options);
	await Sharp(image).toFile(OUTPUT);

	// Assert
	t.is((await Fs.stat(OUTPUT).size), (await Fs.stat(EXPECTED).size));
});

test("resizeImage() uses the specified positioning", async t =>
{
	// Arrange
	const EXPECTED = "tests/images/resizeImage-Positioning-Expected.png";
	const OUTPUT = "tests/images/resizeImage-Positioning.png";
	const options =
	{
		fit: "cover",
		format: "png",
		image: t.context.hallucinateData,
		positioning: "northwest",
		width: 500,
		height: 500
	};

	// Act
	const image = await PolymorphImage.resizeImage(options);
	await Sharp(image).toFile(OUTPUT);

	// Assert
	t.is((await Fs.stat(OUTPUT).size), (await Fs.stat(EXPECTED).size));
});
