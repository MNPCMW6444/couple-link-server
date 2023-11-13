import twilio from 'twilio';
import settings from "../settings";

const client = twilio(settings.smsSid, settings.smsSecret);


const sendSMS = async (to: string, body: string, cb = async () => {
}) => {
    return settings.env === "prod" ? client.messages
        .create({
            from: settings.smsService,
            to,
            body
        })
        .then(message => {
            console.log(message.sid)
            cb()
        }) : console.log("SMS", to, body)
}


export {sendSMS}


