import PolymorphImage from "../shared/PolymorphImage.js";

/******************************************************************************
* Renders the image and writes it to the HTTP response.
*
* @param {object} options The rendering options.
* @param {Buffer|string} image The image data.
******************************************************************************/
export default async function writeImageResponse(options, image)
{
	const response = { headers: { "Content-Type": "" } };
	options = Object.assign({ image: Buffer.from(image) }, body.rendering);
	const isBase64 = options.format.toLowerCase().endsWith(";base64");

	if (isBase64)
		options.format.replace(";base64", "");

	if (options.format.toLowerCase() === "svg")
		response.body = image;
	else
	{
		image = await PolymorphImage.resizeImage(options);
		response.body = await PolymorphImage.convertImage(options);
	}

	switch (options.format.toLowerCase())
	{
		case "avif":
			response.headers["Content-Type"] = "image/avif";
			break;
		case "gif":
			response.headers["Content-Type"] = "image/gif";
			break;
		case "jpeg":
		case "jpg":
			response.headers["Content-Type"] = "image/jpeg";
			break;
		case "png":
			response.headers["Content-Type"] = "image/png";
			break;
		case "svg":
			response.headers["Content-Type"] = "image/svg+xml";
			break;
		case "tif":
		case "tiff":
			response.headers["Content-Type"] = "image/tiff";
			break;
		case "webp":
			response.headers["Content-Type"] = "image/webp";
			break;
		default:
			throw new TypeError(`Unsupported image format: ${options.format}.`);
	}

	if (isBase64)
	{
		response.body = `data:${response.headers["Content-Type"]};base64, ${response.body.toString("base64")}`;
		response.headers["Content-Type"] += "text/html";
	}

	return response;
};