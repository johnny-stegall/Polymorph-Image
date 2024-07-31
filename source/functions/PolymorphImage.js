import { app } from "@azure/functions";
import newBlobInput from "../shared/NewBlobInput.js";
import validateRequest from "../shared/ValidateRequest.js";
import writeImageResponse from "../shared/WriteImageResponse.js";
import PolymorphImage from "../shared/PolymorphImage.js";

/******************************************************************************
* Manipulates an image using the specified operations in order and returns the
* resulting image.
*
* @param {object} request The HTTP request.
* @param {URL|string} [request.imageUrl] The URL of the image to manipulate.
* @param {Buffer} [request.image] The image to manipulate.
* @param {object[]} request.operations The operations to apply to the image.
* @param {object} context The execution context.
******************************************************************************/
app.http("polymorph",
{
	methods: ["POST"],
	authLevel: "anonymous",
	extraInputs: [newBlobInput("polymorph-image.json")],
	handler: async (request, context) =>
	{
		context.log(`Http function processed request for url: ${request.url}.`);
		const body = await request.json();

		try
		{
			validateRequest(context.extraInputs.get("Schema"), body);
		}
		catch (error)
		{
			return { status: 400, body: error.message };
		}

		let image = body.imageUrl.trim() != ""
			? (await fetch(body.imageUrl)).arrayBuffer()
			: body.image;

		for (const operation of body.operations)
			image = await PolymorphImage[operation.name](image, operation.options);

		body.rendering = Object.assign({ format: "avif" }, body.rendering);
		const response = await writeImageResponse(body.rendering, image);
		return response;
	}
});