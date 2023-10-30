import OpenAI from "openai";
import settings from "../settings";
import messageModel from "../mongo/messages/messageModel";

const ROLE = "You are a third party to the conversation, acting as a consultant who is a mediator between the first two parties in it. You chat when each time they write their messages merged together in a one message and you answer your honest opinion with reference to the claims of both sides and your natural analysis"


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
        chat.push({
            role: "user", content: `
            side 1 said:
            ${me}
            and side 2 said:
            ${other}
        `
        });
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


    const aiMessage = new (messageModel())({sessionId, owner: "ai", message: (completion).choices[0].message?.content});
    await aiMessage.save();


    return {price};

};


