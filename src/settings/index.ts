import dotenv from "dotenv";

dotenv.config();

const settings = process.env.NODE_ENV === "production" ? {
    mongoURI: process.env.MONGO_URI!,
    jwtSecret: process.env.JWT_SECRET!,
    smsSid: process.env.SMS_SID!,
    smsSecret: process.env.SMS_SECRET!,
} : process.env.NODE_ENV === "development" ? {
    mongoURI: process.env.MONGO_URI || "mongodb://localhost:27017",
    jwtSecret: process.env.JWT_SECRET || "xxxx",
    smsSid: process.env.SMS_SID || "",
    smsSecret: process.env.SMS_SECRET || "",
} : null;

if (!settings) throw new Error("problem with NODE_ENV");

export default settings