import { input } from "@azure/functions";

/******************************************************************************
* Dynamically constructs a {@link StorageBlobInput}.
*
* @param {string} schemaFile The full path (excluding container) to the JSON
* schema file.
* @param {string} [container="schemas"] The blob storage container.
* @returns {StorageBlobInput} The blob input.
******************************************************************************/
export default function newBlobInput(schemaFile, container = "schemas")
{
	return input.storageBlob(
	{
		connection: "SchemaStorageAccount",
		name: "Schema",
		path: `${container}/${schemaFile}`,
	});
}