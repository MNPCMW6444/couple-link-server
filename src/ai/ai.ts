import OpenAI from "openai";
import settings from "../settings";
import messageModel from "../mongo/messages/messageModel";
import roleModel from "../mongo/rnd/roleModel";

const ROLE = "You are a mediator between Side 1 and Side 2. Provide unbiased insights based on both parties' views. As a relationship consultant, offer perspectives to enhance mutual understanding. Keep responses concise, unless elaboration is needed for clarity.Also provide practical advice for each side to improve the relationship and ensure both sides are satisfied with the outcomes   ";

export const fireAI = async (sessionId: string) => {
    const openai = new OpenAI({
        apiKey: settings.openAIAPIKey
    });

    const messages = await messageModel().find({sessionId: sessionId});
    let me = "", other = "", ai = "";
    const triplets = [];
    const side = messages[0] ? messages[0].owner : "";
    messages.forEach((message) => {
        if (message.owner === side) {
            me = message.message;
        } else if (message.owner === "ai") {
            ai = message.message;
        } else {
            other = message.message;
        }
        if (me && other && ai) {
            triplets.push([me, other, ai]);
            me = "";
            other = "";
            ai = "";
        }
    });
    triplets.push([me, other, ai]);
    const chat = []
    triplets.forEach(([me, other, ai]) => {
        chat.push({role: "user", content: `Side 1: ${me}\n\nSide 2: ${other}\n`});
        chat.push({role: "assistant", content: ai});
    });


    const completion = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
            {
                role: "system",
                content: ROLE,
            },
            ...chat]
    });

    let price = 0;
    /*
        if (completion.usage) {
            const priceForUsInCents =
                completion.usage?.prompt_tokens * 0.003 +
                completion.usage?.completion_tokens * 0.004;
            const forThem = priceForUsInCents * ROI;
            await amendTokens(user, 0 - forThem, "callopenai");

            price = forThem

            axiosInstance?.post("/log/logPromptPrice", {
                openAICallReqUUID,
                promptName,
                forAVGPriceInOpenAITokens: forThem,
            })
                .catch((err) => {
                    console.error("error logging to oc:")
                    console.error(err)
                });
        }*/


    const aiMessage = new (messageModel())({
        sessionId,
        owner: "ai",
        ownerid: "ai",
        message: (completion).choices[0].message?.content
    });
    await aiMessage.save();


    return {price};
};


export const createRole = async (role: string) => {
    const openai = new OpenAI({
        apiKey: settings.openAIAPIKey
    });

    let me = "My boyfriend doesn't prioritise me over his friends and work. I feel like I'm at the bottom of his priority list. He his also very cold and accuse me for being too needy 😭",
        other = "She exaggerates and thinks she is last on the list but she is only second after drinking coffee with friends once in the morning";
    const chat = []

    chat.push({role: "user", content: `Side 1: ${me}\n\nSide 2: ${other}\n`});


    const completion = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
            {
                role: "system",
                content: ROLE,
            },
            ...chat]
    });

    const example = (completion).choices[0].message?.content;

    const roleDoc = new (roleModel())({role: role, example: example});

    const r = await roleDoc.save();
    return r._id.toString()
}