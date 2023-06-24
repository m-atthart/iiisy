import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
	server: {
		NODEMAILER_SERVICE: z.string().min(1),
		NODEMAILER_EMAIL: z.string().email(),
		NODEMAILER_PASSWORD: z.string().min(1),
		NODEMAILER_FROM: z.string().min(1),
		NODEMAILER_TO: z.string().email(),
	},
	runtimeEnv: {
		NODEMAILER_SERVICE: process.env.NODEMAILER_SERVICE,
		NODEMAILER_EMAIL: process.env.NODEMAILER_EMAIL,
		NODEMAILER_PASSWORD: process.env.NODEMAILER_PASSWORD,
		NODEMAILER_FROM: process.env.NODEMAILER_FROM,
		NODEMAILER_TO: process.env.NODEMAILER_TO,
	},
});
