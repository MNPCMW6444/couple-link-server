import dotenv from "dotenv";
import process from "process";

dotenv.config();

const settings = process.env.NODE_ENV === "production" ? {
    mongoURI: process.env.MONGO_URI!,
    jwtSecret: process.env.JWT_SECRET!,
    smsSid: process.env.SMS_SID!,
    smsSecret: process.env.SMS_SECRET!,
    smsService: process.env.SMS_SERVICE!,
    env: process.env.WHITE_ENV!,
    openAIAPIKey : process.env.OPEN_AI_API_KEY!,
    clientDomain : "https://scailean.com"
} : process.env.NODE_ENV === "development" ? {
    mongoURI: process.env.MONGO_URI || "mongodb://localhost:27017",
    jwtSecret: process.env.JWT_SECRET || "xxxx",
    smsSid: process.env.SMS_SID || "",
    smsSecret: process.env.SMS_SECRET || "",
    smsService: process.env.SMS_SERVICE || "",
    env: process.env.WHITE_ENV || "local",
    openAIAPIKey : process.env.OPEN_AI_API_KEY || "",
    clientDomain: 'http://localhost:5173'
} : null;

if (!settings) throw new Error("problem with NODE_ENV");

export default settings