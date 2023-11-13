import OpenAI from "openai";
import settings from "../settings";
import messageModel from "../mongo/messages/messageModel";
import roleModel from "../mongo/rnd/roleModel";
import setModel from "../mongo/rnd/setModel";
import {ChatCompletionMessageParam} from "openai/resources";

const ROLE = "You are a mediator between Side 1 and Side 2. Provide unbiased insights based on both parties' views. As a relationship consultant, offer perspectives to enhance mutual understanding. Keep responses concise, unless elaboration is needed for clarity.";

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


export const createRole = async (creatorId, name, publicName, role, setId = null, category, description) => {
    const openai = new OpenAI({
        apiKey: settings.openAIAPIKey
    });

    let aiResponses = [];
    let roleDoc;

    if (setId) {
        const set = await setModel().findById(setId);
        const stringifiedArray = JSON.parse(set.stringifiedArray);

        for (let pair of stringifiedArray) {
            const chat: ChatCompletionMessageParam[] = [
                {role: "system", content: role},
                {role: "user", content: `Side 1: ${pair.side1}\n\nSide 2: ${pair.side2}\n`}
            ];

            try {
                const completion = await openai.chat.completions.create({
                    model: "gpt-3.5-turbo",
                    messages: chat
                });
                aiResponses.push(completion.choices[0].message?.content);
            } catch (e) {
                aiResponses.push(`Error: ${JSON.stringify(e)}`);
            }
        }

        const pro = {
            creatorId,
            role,
            setId,
            name,
            category,
            description,
            aiMessage: JSON.stringify(aiResponses),
        };

        roleDoc = new (roleModel())(publicName ? {
                    ...pro,
                    publicName,
                }
                : {...pro}
        );
    } else {
        // Handle the case where no setId is provided
        // Your existing logic for default messages and role document creation
    }

    const saved = await roleDoc.save();
    return saved._id.toString();
};