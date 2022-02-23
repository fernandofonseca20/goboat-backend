import * as OneSignal from 'onesignal-node';

export async function createNotification(external_id, Message) {
  const client = new OneSignal.Client(
    process.env.ONESIGNAL_appId,
    process.env.ONESIGNAL_apiKey
  );

  const notification = {
    contents: {
      en: Message,
    },
    // included_segments: ['Subscribed Users'],
    filters: [{ field: 'tag', key: 'external_id', relation: '=', value: external_id }],
  };

  // using async/await
  try {
    const response = await client.createNotification(notification);
    console.log('createNotification',response.body.id);
  } catch (e) {
    if (e instanceof OneSignal.HTTPError) {
      // When status code of HTTP response is not 2xx, HTTPError is thrown.
      console.log(e.statusCode);
      console.log(e.body);
    }
  }
}
export async function createNotificationAll(Message) {
  const client = new OneSignal.Client(
    process.env.ONESIGNAL_appId,
    process.env.ONESIGNAL_apiKey
  );

  const notification = {
    contents: {
      en: Message,
    },
  };

  // using async/await
  try {
    const response = await client.createNotification(notification);
    console.log('createNotification',response.body.id);
  } catch (e) {
    if (e instanceof OneSignal.HTTPError) {
      // When status code of HTTP response is not 2xx, HTTPError is thrown.
      console.log(e.statusCode);
      console.log(e.body);
    }
  }
}
