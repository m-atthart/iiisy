import { NextResponse } from "next/server";
import { parse } from "parse5";
import { Element } from "parse5/dist/tree-adapters/default";
import { env } from "../../env.mjs";
import nodemailer from "nodemailer";

export async function GET() {
	const itemLink =
		"https://www.freyamckee.co.uk/tops/p/asymmetric-milkmaid-tie-top-in-cream-freya-mckee-x-caspar-the-label-aprfm-7fzym-8ar98-5z98k-2r9x9-dyzlf-843sp-e585c";

	const inStock = await checkStock(itemLink);

	console.log(`inStock: ${inStock}`);

	if (inStock) sendEmail(itemLink);

	return NextResponse.json({ inStock });
}

const checkStock = async (itemLink: string) => {
	const res = await fetch(itemLink);
	const data = await res.text();
	const document = parse(data);
	const html = document.childNodes[1] as Element;
	const body = html.childNodes[2] as Element;
	const outerDiv = body.childNodes[1] as Element;
	const main = outerDiv.childNodes[3] as Element;
	const article = main.childNodes[1] as Element;
	const section = article.childNodes[1] as Element;
	const div = section.childNodes[3] as Element;
	const div2 = div.childNodes[1] as Element;
	const div3 = div2.childNodes[1] as Element;
	const div4 = div3.childNodes[1] as Element;
	const div5 = div4.childNodes[3] as Element;
	const div6 = div5.childNodes[3] as Element;
	const div7 = div6.childNodes[3] as Element;
	const div8 = div7.childNodes[5] as Element;
	const div9 = div8.childNodes[1] as Element;
	const div10 = div9.childNodes[3] as Element;
	const sizeSelect = div10.childNodes[1] as Element;
	// const mediumSizeOption = sizeSelect.childNodes[5] as Element;
	// if (mediumSizeOption.attrs.some((attr) => attr.value === "M")) {
	// 	const mediumSizeOptionText = mediumSizeOption.childNodes[0] as TextNode;
	// 	if (mediumSizeOptionText.value === "M") inStock = true;
	// 	else if (mediumSizeOptionText.value === "M (Sold Out)") inStock = false;
	// }
	const quantityInStock = JSON.parse(
		div8.attrs.find((attr) => attr.name === "data-variants")?.value ?? ""
	).find(
		(variant: { attributes: { Size: string } }) =>
			variant.attributes.Size === "M"
	).qtyInStock;

	const inStock = quantityInStock > 0;

	return inStock;
};

const sendEmail = (itemLink: string) => {
	const transporter = nodemailer.createTransport({
		service: env.NODEMAILER_SERVICE,
		auth: {
			user: env.NODEMAILER_EMAIL,
			pass: env.NODEMAILER_PASSWORD,
		},
	});

	const mailOptions = {
		from: env.NODEMAILER_FROM,
		to: env.NODEMAILER_TO,
		subject: "It's in stock!",
		text: itemLink,
	};

	transporter.sendMail(mailOptions, (error, data) => {
		if (error) {
			console.log(error);
		} else {
			console.log(data);
		}
	});
};
