import twilio from 'twilio';
import settings from "../settings";

const client = twilio(settings.smsSid, settings.smsSecret);


const sendSMS =async (to: string, body: string, cb = async () => {}) => {

    return client.messages
        .create({
            from:settings.smsService,
            to,
            body
        })
        .then(message => {
            console.log(message.sid)
            cb()
        })
}


export {sendSMS}


