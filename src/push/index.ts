import webpush from 'web-push';
import settings from "../settings";

// VAPID keys should be generated once and stored securely
const vapidKeys = {
    publicKey: 'BOX9mgkzgqKdn0j6vi-86nqWXoo24Ir4NAPwLe3M-lHgZpBLT153asOtuX1ocALmL3aRzBWgoRhjDAC80-llb6g',
    privateKey: settings.pushPrivate
};

webpush.setVapidDetails(
    'mailto:michael@failean.com',
    vapidKeys.publicKey,
    vapidKeys.privateKey
);

export const sendPushNotification = async (subscription:any, payload:{ title: string, body: string }, data = {}) => {
    try {
        await webpush.sendNotification(subscription, JSON.stringify({...payload, ...data}));
        console.log('Notification sent successfully.');
    } catch (error) {
        console.error('Error sending notification:', error);
    }
};
