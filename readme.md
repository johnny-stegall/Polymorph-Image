# Polymorph Image
An Azure Function wrapper around the Node JS Sharp library for image manipulation. A single request can include multiple image manipulations which are handled in order and requests are validated using JSON schema validation.

[![Deploy to Azure](https://aka.ms/deploytoazurebutton)](https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2Fjohnny-stegall%2FPolymorph-Image%2Fmaster%2Fazure-deploy.json)

### What's With the Name?
I'm an avid Dungeons & Dragons player (among other TTRPGs). I've been playing D&D for over 30 years and DMing for 25 years. Nearly all of my side projects use references to TTRPGs and include various snarky comments. Since functions serve a single purpose, I figure names that sound like a D&D spell name fit.

## JSON Schema Validation

JSON schema validation is performed using a JSON schema file stored in the Azure Storage Account. The default location for the schema file is in the _schemas_ container.

**You must manually create the _schemas_ container and upload _polymorph-image.json_ into that container** before using the function.

# Usage
Requests are made to the function URL as POST requests. To manipulate an image using image data (such as from file or a stream):

	{
		"image": {image data},
		"manipulations":
		[
			{
				"operation": "grayscaleImage"
			},
			{
				"operation": "resizeImage",
				"options":
				{
					"height": 100
					"width": 100
				}
			},
			{
				"operation": "convertImage",
				"options":
				{
					"format": "avif"
				}
			}
		]
	}

To manipulate an image from URL:

	{
		"imageUrl": {image URL},
		"manipulations":
		[
			{
				"operation": "grayscaleImage"
			},
			{
				"operation": "resizeImage",
				"options":
				{
					"height": 100
					"width": 100
				}
			},
			{
				"operation": "convertImage",
				"options":
				{
					"format": "avif"
				}
			}
		]
	}

Additionally, there's a _rendering_ parameter as part of the JSON which allows for common rendering manipulations (e.g. background color, dimensions, image format). The above could be done similarly through rendering as follows:

	{
		"image": {image data},
		"manipulations":
		[
			{
				"operation": "grayscaleImage"
			}
		],
		"rendering":
		{
			"format": "avif",
			"height": 1000,
			"width": 1000
		}
	}

# API

[Add Alpha Channel](https://sharp.pixelplumbing.com/api-channel#ensurealpha)
- Operation: `"addAlphaChannel"`
- Defaults:
	- alpha: 1

[Affine Transform](https://sharp.pixelplumbing.com/api-operation#affine)

- Operation: `"affineTransform"`
- Defaults:
	- background: "#000"

[Apply Threshold](https://sharp.pixelplumbing.com/api-operation#threshold) 

- Operation: `"applyThreshold"`
- Defaults:
	- grayscale: true
	- threshold: 128

[Blur Image](https://sharp.pixelplumbing.com/api-operation#blur)

- Operation: `"blurImage"`

[Boolean Transform](https://sharp.pixelplumbing.com/api-operation#boolean)

- Operation: `"booleanTransform"`

[Change Colorspace](https://sharp.pixelplumbing.com/api-colour#tocolorspace)

- Operation: `"changeColorspace"`

[Clahe Image](https://sharp.pixelplumbing.com/api-operation#clahe)

- Operation: `"claheImage"`

[Convolve Image](https://sharp.pixelplumbing.com/api-operation#convolve)

- Operation: `"convolveImage"`

[Convert Image](https://sharp.pixelplumbing.com/api-output#toformat)

- Operation: `"convertImage"`

[Extract Channel](https://sharp.pixelplumbing.com/api-channel#extractchannel)

- Operation: `"extractChannel"`

[Flatten Image](https://sharp.pixelplumbing.com/api-operation#flatten)

- Operation: `"flattenImage"`
- Defaults:
	- background: "#000"

[Flip Image](https://sharp.pixelplumbing.com/api-operation#flip)

Handles both the flip and flop manipulations.

- Operation: `"flipImage"`
- Defaults:
	- orientation: "vertical"

[Gamma Correct](https://sharp.pixelplumbing.com/api-operation#gamma)

- Operation: `"gammaCorrect"`
- Defaults:
	- gamma: 2.2
	- gammaOut: 2.2

[Grayscale Image](https://sharp.pixelplumbing.com/api-colour#grayscale)

- Operation: `"grayscaleImage"`

[Linear Adjustment](https://sharp.pixelplumbing.com/api-operation#linear)

- Operation: `"linearAdjustment"`
- Defaults:
	- background: "#000"

[Median Filter](https://sharp.pixelplumbing.com/api-operation#median)

- Operation: `"medianFilter"`
- Defaults:
	- size: 3

[Modulate Image](https://sharp.pixelplumbing.com/api-operation#modulate)

- Operation: `"modulateImage"`
- Defaults:
	- alpha: true

[Normalize Image](https://sharp.pixelplumbing.com/api-operation#normalize)

- Operation: `"normalizeImage"`
- Defaults:
	- lower: 1
	- upper: 99

[Pipeline Colorspace](https://sharp.pixelplumbing.com/api-colour#pipelinecolorspace)

- Operation: `"pipelineColorspace"`

[Produce Negative](https://sharp.pixelplumbing.com/api-operation#negate)

- Operation: `"produceNegative"`
- Defaults:
	- alpha: true

[Recombine Image](https://sharp.pixelplumbing.com/api-operation#recomb)

- Operation: `"recombineImage"`

[Remove Alpha Channel](https://sharp.pixelplumbing.com/api-channel#removealpha)

- Operation: `"removeAlphaChannel"`

[Resize Image](https://sharp.pixelplumbing.com/api-resize)

- Operation: `"resizeImage"`
- Defaults:
	- background: "#fff"
	- fit: "contain"
	- kernel: "lanczos3"
	- position: "centre"

[Rotate Image](https://sharp.pixelplumbing.com/api-operation#rotate)

- Operation: `"rotateImage"`
- Defaults:
	- background: "#fff"

[Sharpen Image](https://sharp.pixelplumbing.com/api-operation#sharpen)

- Operation: `"sharpenImage"`

[Tint Image](https://sharp.pixelplumbing.com/api-colour#tint)

- Operation: `"tintImage"`

[Unflatten Image](https://sharp.pixelplumbing.com/api-operation#unflatten)

- Operation: `"unflattenImage"`