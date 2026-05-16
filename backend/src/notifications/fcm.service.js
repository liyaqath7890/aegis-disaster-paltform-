export async function sendPushNotification({ token, title, body, data = {} }) {
  console.info('[fcm-placeholder]', { token, title, body, data });
  return { delivered: false, provider: 'firebase-cloud-messaging-placeholder' };
}
