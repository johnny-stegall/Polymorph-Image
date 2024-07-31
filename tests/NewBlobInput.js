import { input } from "@azure/functions";
import test from "ava";
import newBlobInput from "../source/Shared/NewBlobInput.js";

test("newBlobInput() returns a Blob Input", t =>
{
	// Arrange
	const SCHEMA_FILE = "radial-chart.json";
	const CONTAINER = "schemas";
	const BLOB_INPUT = input.storageBlob(
	{
		name: "Schema",
		path: `${CONTAINER}/${SCHEMA_FILE}`,
		connection: "SchemaStorageAccount"
	});

	// Act
	const blobInput = newBlobInput(SCHEMA_FILE);

	// Assert
	t.deepEqual(blobInput, BLOB_INPUT);
});

test("newBlobInput() returns a Blob Input with specified container", t =>
{
	// Arrange
	const SCHEMA_FILE = "radial-chart.json";
	const CONTAINER = "data";
	const BLOB_INPUT = input.storageBlob(
	{
		name: "Schema",
		path: `${CONTAINER}/${SCHEMA_FILE}`,
		connection: "SchemaStorageAccount"
	});

	// Act
	const blobInput = newBlobInput(SCHEMA_FILE, CONTAINER);

	// Assert
	t.deepEqual(blobInput, BLOB_INPUT);
});

test("newBlobInput() returns a Blob Input with specified container and path", t =>
{
	// Arrange
	const SCHEMA_FILE = "schemas/radial-chart.json";
	const CONTAINER = "data";
	const BLOB_INPUT = input.storageBlob(
	{
		name: "Schema",
		path: `${CONTAINER}/${SCHEMA_FILE}`,
		connection: "SchemaStorageAccount"
	});

	// Act
	const blobInput = newBlobInput(SCHEMA_FILE, CONTAINER);

	// Assert
	t.deepEqual(blobInput, BLOB_INPUT);
});