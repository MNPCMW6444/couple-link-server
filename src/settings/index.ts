import dotenv from "dotenv";
import process from "process";

dotenv.config();

const settings = process.env.NODE_ENV === "production" ? {
    mongoURI: process.env.MONGO_URI!,
    jwtSecret: process.env.JWT_SECRET!,
    smsSid: process.env.SMS_SID!,
    smsSecret: process.env.SMS_SECRET!,
    smsService: process.env.SMS_SERVICE!,
    openAIAPIKey: process.env.OPEN_AI_API_KEY!,
    clientDomain: `https://${process.env.WHITE_ENV === "preprod" ? "pre." : ""}couple-link.com`,
    pushPrivate: process.env.PUSH_PRIVATE!,
    stripeSecret: process.env.STRIPE_SECRET!,
    model: process.env.MODEL || "gpt-4", // https://platform.openai.com/docs/models
    whiteEnv: process.env.WHITE_ENV || "prod",
} : process.env.NODE_ENV === "development" ? {
    mongoURI: process.env.MONGO_URI || "mongodb://localhost:27017",
    jwtSecret: process.env.JWT_SECRET || "xxxx",
    smsSid: process.env.SMS_SID || "",
    smsSecret: process.env.SMS_SECRET || "",
    smsService: process.env.SMS_SERVICE || "",
    openAIAPIKey: process.env.OPEN_AI_API_KEY || "",
    clientDomain: 'http://localhost:5173',
    pushPrivate: process.env.PUSH_PRIVATE || "",
    stripeSecret: process.env.STRIPE_SECRET || "",
    model: process.env.MODEL || "gpt-4", // https://platform.openai.com/docs/models
    whiteEnv: process.env.WHITE_ENV || "preprod",
} : null;

if (!settings) throw new Error("problem with NODE_ENV");

export default settings