import { Readable } from "stream";
import Sharp from "sharp";
import XmlDom from "xmldom";

/******************************************************************************
* Performs image manipulation operations.
******************************************************************************/
export default class PolymorphImage
{
	/****************************************************************************
	* Adds an alpha (transparency) channel if one doesn't exist.
	*
	* @param {object} options Settings.
	* @param {Buffer|Readable|ReadableStream|Uint8Array|URL} options.image The
	* source image.
	* @param {number} [options.alpha=1] The alpha transparency level (0 to 1).
	* @returns {Buffer} A @see Buffer containing the image data.
	****************************************************************************/
	static async addAlphaChannel(options)
	{
		options = Object.assign({ alpha: 1 }, options);
		const buffer = await this.#getImageAsBuffer(options.image);
		const image = Sharp(buffer).ensureAlpha(options.alpha);
		return await image.toBuffer();
	}

	/****************************************************************************
	* Performs an affine transform on an image.
	*
	* @param {object} options Settings.
	* @param {Buffer|Readable|ReadableStream|Uint8Array|URL} options.image The
	* source image.
	* @param {Array<number>|Array<Array<number>} options.matrix The
	* transformation matrix.
	* @param {string} [options.background="#000"] The background color to
	* fill in when angles other than a multiple of 90 are used.
	* @param {number} [options.idx] The input horizontal offset.
	* @param {number} [options.idy] The input vertical offset.
	* @param {number} [options.odx] The output horizontal offset.
	* @param {number} [options.ody] The output vertical offset.
	* @param {string} [options.interpolator="bicubic"] The interpolator.
	* @returns {Buffer} A @see Buffer containing the image data.
	****************************************************************************/
	static async affineTransform(options)
	{
		options = Object.assign({ background: "#000" }, options);
		const buffer = await this.#getImageAsBuffer(options.image);
		const image = Sharp(buffer).affine(options.matrix, options);
		return await image.toBuffer();
	}

	/****************************************************************************
	* Any pixel value greater than or equal to the threshold value is set to 255,
	* otherwise it will be set to 0.
	*
	* @param {object} options Settings.
	* @param {Buffer|Readable|ReadableStream|Uint8Array|URL} options.image The
	* source image.
	* @param {number} [options.threshold=128] A value between 0 and 255
	* representing the level at which the threshold will be applied.
	* @param {boolean} [options.grayscale=true] True to convert the image to
	* grayscale, false otherwise.
	* @returns {Buffer} A @see Buffer containing the image data.
	****************************************************************************/
	static async applyThreshold(options)
	{
		options = Object.assign({ grayscale: true, threshold: 128 }, options);
		const buffer = await this.#getImageAsBuffer(options.image);
		const image = Sharp(buffer).threshold(options.threshold, options);
		return await image.toBuffer();
	}

	/****************************************************************************
	* Blurs an image.
	*
	* @param {object} options Settings.
	* @param {Buffer|Readable|ReadableStream|Uint8Array|URL} options.image The
	* source image.
	* @param {number} [options.sigma] The sigma of the Gaussian mask, where
	* sigma = 1 + radius / 2, between 0.3 and 1000.
	* @returns {Buffer} A @see Buffer containing the image data.
	****************************************************************************/
	static async blurImage(options)
	{
		const buffer = await this.#getImageAsBuffer(options.image);
		const image = Sharp(buffer).blur(options);
		return await image.toBuffer();
	}

	/****************************************************************************
	* Perform a bitwise boolean operation with the image and the operand image,
	* resulting in an image where each pixel is the result of the selected
	* bitwise boolean operation.
	*
	* @param {object} options Settings.
	* @param {Buffer|Readable|ReadableStream|Uint8Array|URL} options.image The
	* source image.
	* @param {Buffer|Readable|ReadableStream|Uint8Array|URL} options.operandImage
	* The operand image.
	* @param {string} options.operator The bitwise boolean operator, which may be
	* "and", "or", or "eor".
	* @param {object} [options.raw] Describes the operand when using raw pixel
	* data.
	* @param {number} [options.raw.channels] The channels in the raw pixel data.
	* @param {number} [options.raw.height] The height of the raw pixel data.
	* @param {number} [options.raw.width] The width of the raw pixel data.
	* @returns {Buffer} A @see Buffer containing the image data.
	****************************************************************************/
	static async booleanTransform(options)
	{
		const buffer = await this.#getImageAsBuffer(options.image);
		const image = Sharp(buffer).boolean(options.operandImage, options.operator, options);
		return await image.toBuffer();
	}

	/****************************************************************************
	* Changes the image colorspace.
	*
	* @param {object} options Settings.
	* @param {Buffer|Readable|ReadableStream|Uint8Array|URL} options.image The
	* source image.
	* @param {string} [options.colorspace] The pipeline colorspace, which can be
	* "b-w", "cmc", "cmyk", "fourier", "grey16", "histogram", "hsv", "lab",
	* "labq", "labs", "last", "lch", "matrix", "multiband", "rgb", "rgb16",
	* "scrgb", "srgb", "xyz", or "yxy".
	* @returns {Buffer} A @see Buffer containing the image data.
	****************************************************************************/
	static async changeColorspace(options)
	{
		const buffer = await this.#getImageAsBuffer(options.image);
		const image = Sharp(buffer).toColorspace(options.colorspace);
		return await image.toBuffer();
	}

	/****************************************************************************
	* Perfoms contrast limiting adaptive histogram equalization on an image.
	*
	* @param {object} options Settings.
	* @param {Buffer|Readable|ReadableStream|Uint8Array|URL} options.image The
	* source image.
	* @param {number} options.height The integral height of the search window.
	* @param {number} options.width The integral width of the search window.
	* @param {number} [options.maxSlope=3] The integral level of brightening,
	* between 0 and 100, where 0 disables contrast limiting.
	* @returns {Buffer} A @see Buffer containing the image data.
	****************************************************************************/
	static async claheImage(options)
	{
		const buffer = await this.#getImageAsBuffer(options.image);
		const image = Sharp(buffer).clahe(options);
		return await image.toBuffer();
	}

	/****************************************************************************
	* Convolve the image with the specified kernel.
	*
	* @param {object} options Settings.
	* @param {Buffer|Readable|ReadableStream|Uint8Array|URL} options.image The
	* source image.
	* @param {number} options.height The kernel height.
	* @param {number} options.width The kernel width.
	* @param {Array<number>} options.kernel The length width * height containing
	* the kernel values.
	* @param {number} [options.scale] The kernel scale.
	* @param {number} [options.offset] The kernel offset.
	* @returns {Buffer} A @see Buffer containing the image data.
	****************************************************************************/
	static async convolveImage(options)
	{
		const buffer = await this.#getImageAsBuffer(options.image);
		const image = Sharp(buffer).kernel(options);
		return await image.toBuffer();
	}

	/****************************************************************************
	* Converts an image to a different format.
	*
	* @param {object} options Settings.
	* @param {Buffer|Readable|ReadableStream|Uint8Array|URL} options.image The
	* source image.
	* @param {string} options.format The format to convert the image to.
	* @returns {Buffer} A @see Buffer containing the image data.
	****************************************************************************/
	static async convertImage(options)
	{
		const buffer = await this.#getImageAsBuffer(options.image);
		const image = Sharp(buffer).toFormat(options.format);
		return await image.toBuffer();
	}

	/****************************************************************************
	* Extracts a single channel from a multi-channel image.
	*
	* @param {object} options Settings.
	* @param {Buffer|Readable|ReadableStream|Uint8Array|URL} options.image The
	* source image.
	* @param {number|string} options.channel Either a zero-indexed channel or
	* "red", "green", "blue", or "alpha".
	* @returns {Buffer} A @see Buffer containing the image data.
	****************************************************************************/
	static async extractChannel(options)
	{
		const buffer = await this.#getImageAsBuffer(options.image);
		const image = Sharp(buffer).extractChannel(options.channel);
		return await image.toBuffer();
	}

	/****************************************************************************
	* Merges the alpha transparency channel with a background, then removes the
	* alpha channel.
	*
	* @param {object} options Settings.
	* @param {Buffer|Readable|ReadableStream|Uint8Array|URL} options.image The
	* source image.
	* @param {string} [options.background="#000"] The background color of the
	* image when resizing with a fit of "contain".
	* @returns {Buffer} A @see Buffer containing the image data.
	****************************************************************************/
	static async flattenImage(options)
	{
		options = Object.assign({ background: "#000" }, options);
		const buffer = await this.#getImageAsBuffer(options.image);
		const image = Sharp(buffer).flatten(options);
		return await image.toBuffer();
	}

	/****************************************************************************
	* Flips an image vertically or horizontally.
	*
	* @param {object} options Settings.
	* @param {Buffer|Readable|ReadableStream|Uint8Array|URL} options.image The
	* source image.
	* @param {string} [options.orientation=vertical] The orientation of the flip.
	* @returns {Buffer} A @see Buffer containing the image data.
	****************************************************************************/
	static async flipImage(options)
	{
		options = Object.assign({ orientation: "vertical" }, options);
		const buffer = await this.#getImageAsBuffer(options.image);
		const image = option.orientation === "vertical"
			? Sharp(buffer).flip()
			: Sharp(buffer).flop();
		return await image.toBuffer();
	}

	/****************************************************************************
	* Applies a gamma correction to an image by reducing the encoding (darken)
	* pre-size at a factor of 1 / gamma then increasing the encoding (brighten)
	* post-resize at a factor of gamma.
	*
	* @param {object} options Settings.
	* @param {Buffer|Readable|ReadableStream|Uint8Array|URL} options.image The
	* source image.
	* @param {number} [gamma=2.2] The gamma value, between 1.0 and 3.0.
	* @param {number} [gammaOut=2.2] The gamma output value, between 1.0 and 3.0.
	* @returns {Buffer} A @see Buffer containing the image data.
	****************************************************************************/
	static async gammaCorrect(options)
	{
		options = Object.assign({ gamma: 2.2, gammaOut: 2.2 }, options);
		const buffer = await this.#getImageAsBuffer(options.image);
		const image = Sharp(buffer).gamma(options);
		return await image.toBuffer();
	}

	/****************************************************************************
	* Converts the image to grayscale.
	*
	* @param {object} options Settings.
	* @param {Buffer|Readable|ReadableStream|Uint8Array|URL} options.image The
	* source image.
	* @returns {Buffer} A @see Buffer containing the image data.
	****************************************************************************/
	static async grayscaleImage(options)
	{
		const buffer = await this.#getImageAsBuffer(options.image);
		const image = Sharp(buffer).grayscale();
		return await image.toBuffer();
	}

	/****************************************************************************
	* Apply a linear adjustment to the image levels.
	*
	* @param {object} options Settings.
	* @param {Buffer|Readable|ReadableStream|Uint8Array|URL} options.image The
	* source image.
	* @param {number|Array<number>} [options.multiplier] The multiplier.
	* @param {number|Array<number>} [options.offset] The offset.
	* @returns {Buffer} A @see Buffer containing the image data.
	****************************************************************************/
	static async linearAdjustment(options)
	{
		options = Object.assign({ background: "#000" }, options);
		const buffer = await this.#getImageAsBuffer(options.image);
		const image = Sharp(buffer).linear({ a: options.multiplier, b: options.offset });
		return await image.toBuffer();
	}

	/****************************************************************************
	* Applies a median filter to an image.
	*
	* @param {object} options Settings.
	* @param {Buffer|Readable|ReadableStream|Uint8Array|URL} options.image The
	* source image.
	* @param {number} [size=3] The square mask size.
	* @returns {Buffer} A @see Buffer containing the image data.
	****************************************************************************/
	static async medianFilter(options)
	{
		options = Object.assign({ size: 3 }, options);
		const buffer = await this.#getImageAsBuffer(options.image);
		const image = Sharp(buffer).median(options);
		return await image.toBuffer();
	}

	/****************************************************************************
	* Transforms the image using brightness, saturation, hue rotation, and
	* lightness.
	*
	* @param {object} options Settings.
	* @param {Buffer|Readable|ReadableStream|Uint8Array|URL} options.image The
	* source image.
	* @param {number} [options.brightness] The brightness multiplier.
	* @param {number} [options.saturation] The saturation multiplier.
	* @param {number} [options.hue] The degrees for hue rotation.
	* @param {number} [options.lightness] The lightness addend.
	* @returns {Buffer} A @see Buffer containing the image data.
	****************************************************************************/
	static async modulateImage(options)
	{
		options = Object.assign({ alpha: true }, options);
		const buffer = await this.#getImageAsBuffer(options.image);
		const image = Sharp(buffer).modulate(options);
		return await image.toBuffer();
	}

	/****************************************************************************
	* Enhances the image contrast by stretching its luminance to cover a full
	* dynamic range.
	*
	* @param {object} options Settings.
	* @param {Buffer|Readable|ReadableStream|Uint8Array|URL} options.image The
	* source image.
	* @param {number} [lower=1] Percentile below which luminance values will be
	* underexposed.
	* @param {number} [upper=99] Percentile above which luminance values will be
	* overexposed.
	* @returns {Buffer} A @see Buffer containing the image data.
	****************************************************************************/
	static async normalizeImage(options)
	{
		options = Object.assign({ lower: 1, upper: 99 }, options);
		const buffer = await this.#getImageAsBuffer(options.image);
		const image = Sharp(buffer).normalize(options);
		return await image.toBuffer();
	}

	/****************************************************************************
	* Sets the pipeline colorspace.
	*
	* @param {object} options Settings.
	* @param {Buffer|Readable|ReadableStream|Uint8Array|URL} options.image The
	* source image.
	* @param {string} [options.colorspace] The pipeline colorspace, which can be
	* "b-w", "cmc", "cmyk", "fourier", "grey16", "histogram", "hsv", "lab",
	* "labq", "labs", "last", "lch", "matrix", "multiband", "rgb", "rgb16",
	* "scrgb", "srgb", "xyz", or "yxy".
	* @returns {Buffer} A @see Buffer containing the image data.
	****************************************************************************/
	static async pipelineColorspace(options)
	{
		const buffer = await this.#getImageAsBuffer(options.image);
		const image = Sharp(buffer).pipelineColorspace(options.colorspace);
		return await image.toBuffer();
	}

	/****************************************************************************
	* Produces the "negative" of an image.
	*
	* @param {object} options Settings.
	* @param {Buffer|Readable|ReadableStream|Uint8Array|URL} options.image The
	* source image.
	* @param {boolean} [alpha=true] True to negate any alpha channel, false to
	* ignore alpha channels.
	* @returns {Buffer} A @see Buffer containing the image data.
	****************************************************************************/
	static async produceNegative(options)
	{
		options = Object.assign({ alpha: true }, options);
		const buffer = await this.#getImageAsBuffer(options.image);
		const image = Sharp(buffer).negate(options);
		return await image.toBuffer();
	}

	/****************************************************************************
	* Recombines an image using the specified matrix.
	*
	* @param {object} options Settings.
	* @param {Buffer|Readable|ReadableStream|Uint8Array|URL} options.image The
	* source image.
	* @param {Array<number>|Array<Array<number>} options.matrix The 3x3
	* recombination matrix.
	* @returns {Buffer} A @see Buffer containing the image data.
	****************************************************************************/
	static async recombineImage(options)
	{
		const buffer = await this.#getImageAsBuffer(options.image);
		const image = Sharp(buffer).recomb(options.matrix);
		return await image.toBuffer();
	}

	/****************************************************************************
	* Removes the alpha channel.
	*
	* @param {object} options Settings.
	* @param {Buffer|Readable|ReadableStream|Uint8Array|URL} options.image The
	* source image.
	* @returns {Buffer} A @see Buffer containing the image data.
	****************************************************************************/
	static async removeAlphaChannel(options)
	{
		const buffer = await this.#getImageAsBuffer(options.image);
		const image = Sharp(buffer).removeAlpha();
		return await image.toBuffer();
	}

	/****************************************************************************
	* Resizes an image to the specified size.
	*
	* @param {object} options Settings.
	* @param {Buffer|Readable|ReadableStream|Uint8Array|URL} options.image The
	* source image.
	* @param {string} [options.background="#fff"] The background color of the
	* image when resizing with a fit of "contain".
	* @param {string} [options.fit="contain"] The resizing mode, which may
	* be "cover", "contain", "fill", "inside", or "outside".
	* - Cover: Preserves aspect ratio, attempt to ensure the image covers both
	* provided dimensions by cropping/clipping to fit.
	* - Contain: Preserves aspect ratio, contain within both provided dimensions
	* using "letterboxing" where necessary.
	* - Fill: Ignores aspect ratio and stretches to both provided dimensions.
	* - Inside: Preserves aspect ratio, resizes the image to be as large as
	* possible while ensuring its dimensions are less than or equal to both those
	* specified.
	* - Outside: Preserves aspect ratio, resizes the image to be as small as
	* possible while ensuring its dimensions are greater than or equal to both
	* those specified.
	* @param {number} options.height The height of the converted image.
	* @param {string} [options.kernel="lanczos3"] The kernel to use for image
	* resizing, which may be "nearest", "cubic", "mitchell", "lanczos2", or
	* "lanczos3".
	* @param {string} [options.position="centre"]	A position, gravity or strategy
	* to use when fit is "cover" or "contain".
	* @param {number} options.width The width of the converted image.
	* @returns {Buffer} A @see Buffer containing the image data.
	****************************************************************************/
	static async resizeImage(options)
	{
		options = Object.assign({ background: "#fff", fit: "contain", kernel: "lanczos3", position: "centre" }, options);
		const buffer = await this.#getImageAsBuffer(options.image);
		let image;
			
		if (options.image instanceof URL && options.image.href.endsWith(".svg"))
			image = await this.#manipulateSvgImage(Buffer.from(buffer).toString(), options.width, options.height, options.background);
		else if (buffer.toString().startsWith("<svg"))
			image = await this.#manipulateSvgImage(buffer.toString(), options.width, options.height, options.background);
		else
			image = Sharp(buffer).resize(options.width, options.height, options);
		
		return await image.toBuffer();
	}

	/****************************************************************************
	* Rotates an image.
	*
	* @param {object} options Settings.
	* @param {Buffer|Readable|ReadableStream|Uint8Array|URL} options.image The
	* source image.
	* @param {number} options.angle The angle of rotation.
	* @param {string} [options.background="#fff"] The background color to
	* fill in when angles other than a multiple of 90 are used.
	* @returns {Buffer} A @see Buffer containing the image data.
	****************************************************************************/
	static async rotateImage(options)
	{
		options = Object.assign({ background: "#fff" }, options);
		const buffer = await this.#getImageAsBuffer(options.image);
		const image = Sharp(buffer).rotate(options.angle, options);
		return await image.toBuffer();
	}

	/****************************************************************************
	* Sharpen an image.
	*
	* @param {object} options Settings.
	* @param {Buffer|Readable|ReadableStream|Uint8Array|URL} options.image The
	* source image.
	* @param {number} [options.sigma] The sigma of the Gaussian mask, where
	* sigma = 1 + radius / 2, between 0.000001 and 10.
	* @param {number} [options.m1] The level of sharpening to apply to "flat"
	* areas, between 0 and 1000000.
	* @param {number} [options.m2] The level of sharpening to apply to "jagged"
	* areas, between 0 and 1000000.
	* @param {number} [options.x1] The threshold between "flat" and "jagged",
	* between 0 and 1000000.
	* @param {number} [options.y2] The maximum amount of brightening, between 0
	* and 1000000.
	* @param {number} [options.y3] The maximum amount of darkening, between 0
	* and 1000000.
	* @returns {Buffer} A @see Buffer containing the image data.
	****************************************************************************/
	static async sharpenImage(options)
	{
		const buffer = await this.#getImageAsBuffer(options.image);
		const image = Sharp(buffer).sharpen(options);
		return await image.toBuffer();
	}

	/****************************************************************************
	* Tint the image using the provided color.
	*
	* @param {object} options Settings.
	* @param {Buffer|Readable|ReadableStream|Uint8Array|URL} options.image The
	* source image.
	* @param {string} [options.color] The color to tint the image with.
	* @returns {Buffer} A @see Buffer containing the image data.
	****************************************************************************/
	static async tintImage(options)
	{
		const buffer = await this.#getImageAsBuffer(options.image);
		const image = Sharp(buffer).tint(options);
		return await image.toBuffer();
	}

	/****************************************************************************
	* Ensures the image has an alpha channel with all white pixel values made
	* fully transparent. Existing alpha channel values for non-white pixels will
	* remain unchanged.
	*
	* @param {object} options Settings.
	* @param {Buffer|Readable|ReadableStream|Uint8Array|URL} options.image The
	* source image.
	* @returns {Buffer} A @see Buffer containing the image data.
	****************************************************************************/
	static async unflattenImage(options)
	{
		const buffer = await this.#getImageAsBuffer(options.image);
		const image = Sharp(buffer).unflatten(options);
		return await image.toBuffer();
	}

	/****************************************************************************
	* Retrieves an image as a @see Buffer.
	*
	* @param {Buffer|URL|Uint8Array|Readable|ReadableStream} image The image.
	* @returns {Promise<Buffer>} The manipulated SVG image.
	* @throws {TypeError} If image is an unsupported type.
	****************************************************************************/
	static async #getImageAsBuffer(image)
	{
		let buffer;

		if (image instanceof Buffer)
			buffer = image;
		else if (image instanceof URL)
		{
			const response = await fetch(image);

			if (!response.ok)
				throw new Error(`Failed to fetch image: HTTP/${response.status}: ${response.statusText}.`);

			buffer = await response.arrayBuffer();
		}
		else if (image instanceof Uint8Array)
			buffer = image.buffer;
		else if (image instanceof Readable || image instanceof ReadableStream)
		{
			if (image instanceof ReadableStream)
				image = Readable.from(image);
			
			const imageData = [];

			for await (const packet of image)
				imageData.push(packet);

			buffer = Buffer.concat(imageData);
		}
		else
			throw new TypeError(`Unsupported image type: ${image.constructor.name}.`);

		return buffer;
	}

	/******************************************************************************
	* Manipulates the SVG using the XML DOM.
	*
	* @param {string} svgData The SVG data.
	* @param {number} width The width of the converted image.
	* @param {number} height The height of the converted image.
	* @param {string} background The background color of the SVG image.
	* @returns {Promise<Sharp>} The manipulated SVG image.
	* @throws {TypeError} If no SVG element is found in the SVG data.
	******************************************************************************/
	static async #manipulateSvgImage(svgData, width, height, background = "#fff")
	{
		const svgImage = new XmlDom.DOMParser().parseFromString(svgData, "text/xml");
		const svgElements = svgImage.getElementsByTagName("svg");

		if (!svgElements.length)
			throw new TypeError("No SVG element found in the SVG data.");

		const svgElement = svgElements.item(0);
		svgElement.setAttribute("width", width);
		svgElement.setAttribute("height", height);
		svgElement.setAttribute("fill", background);
		const image = await Sharp(
			Buffer.from(
				new XmlDom.XMLSerializer().serializeToString(svgImage)
			)
		);

		return image;
	}
};
