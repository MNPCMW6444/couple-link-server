import twillio from 'twilio';
import settings from "../settings";

const client = twillio(settings.smsSid, settings.smsSecret);


const sendSMS = (to: string, body: string, cb = async () => {}) => {

    client.messages
        .create({
            to: '+972528971871',
            body: "asdfnsdkfbnjds"
        })
        .then(message => {
            console.log(message.sid)
            cb()
        })
}


export {sendSMS}


