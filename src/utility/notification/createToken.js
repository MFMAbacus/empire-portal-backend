const { JWT } = require("google-auth-library");
const axios = require("axios");

async function getAccessToken() {
  const key = {
    type: "service_account",
    project_id: "empireworld-95422",
    private_key_id: "18bfb771726305a9ce0d901cfb1d21c24584836a",
    private_key:
      "-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQC6UHNcuaLPKSbL\ncJkUxd/qYJy4Rw9RB94chaaRy9JaAVw2T9djXSZq3GLjxyUn4EKt7ytCczeXO9GG\n3T/n8tDcRoLcZbyveDJzJEM0G/rXeYmLt3h57aJjZStCyhYHNUK4HSXmWTED4dUq\nET/7t0qPVw8ds/qgUPRB/YNp1TwQaBx3yyBWCpBXUHx49fD0ANJrzzqSXTOX8GJp\ny22jlY6Ysm67YTE4leucauieDrlJ/Aqj9C6Sb3j2iDv/QnxjgpeW1BwBq4YdlT5R\nrbh45/oZCnwaVwA1EUyoBuMDl5p9paKT13IjYiQfMw3YLoMCwXDGlYdDbM8odYeQ\ndMRnP2BhAgMBAAECggEAIcgykq6KKbvRb/PTneOfDRVFdVhVG6EskcleAXOOiYlT\nmflyGW8rZxbcy2Yxg4BzNqx2EI9plf9fp294hesOGdKjKak8xCgsJZp+oPUtz2IX\nIYE71AfVeOZAKNURl2790PpgA9tKOuT4zK7iBhce6syjTgRzPhxPnaOE72ydfm/C\n8QnbhuSH4dqceuEzXRGVrAk1uebKc546JsH1Xwz+gtOcH0mwcOZ1yB6WCFCI1/eC\nQfUO6EuoyMzkV2mZo+PZYfwOvbl9QiEvVvxPoPNJOn0qhwG2Gpf+ag/H03UqRoe8\npQNmAUn2sIbdxoIurBn+239KDK4ZKapzb5AqvvLXXQKBgQDikuRFhhNLBRbAqOrr\nTXHQmWMbkrA3zKLt2S3kmZ0AUfk5sZrTlAIYhq/NHAltERtDBH/XDFYhvLswUzFW\ndk99DvOSkVpbUbagGrWL/P1aRv2tc48q0Kvh14bxyzH4XhmmXX9aqi/Cs3MIT4KD\nsh0qqnImkTxTyXR5H0WCyEXucwKBgQDSgwNSqeA+6h4Fi4q/Xsx52SsAJW4cxKyT\nBw7637zu4XIHaVhqCgcAl/PkfP0mo8TKQz3yoOiFjkILbbjBKFjihYT2PM1HaggU\nNEMyNX420qqRrhQjSVXn5OWsKytoQ6c721gMV5yA8yjo6ota7tIC585glshzyvzl\nd2BITAUM2wKBgQCnAMLFBAhgeYXFyDwv6EuGCClm/35oAqvtSPFs2FVDESj0f5ax\ncR0CWvRl6M6B1+QSR9S6+9rYzzXibs+k/VulwEmEtSK2wMotxMIgRv+vdTgyi0Tx\nuBGZS7Wpr65LdYDOgYgHmf3OM1sMux5mV/jro+qzxsWCtLDnPkeMGHaDRQKBgBq1\naqeDTCNPWu3DLaBoK7NN/WmwVg8qWObyn1DvMC5yxh/wmroheY/2t4gG36uWXbJ3\n45U0GyxOx0xh6G4Ba32aCSugvT7RUiMWGmx1YwUbp26CUqXDeTXJ0eYNOB2rb71l\nb/9o4j9uGoOqtnGcGWMq/AE/QEGIwJtwkPO7SWy/AoGBALCP/0sGt5rhOXNOw6pj\n6GOBGYIFyATViwK/tGiMoa3qsv9VaPZb4Rgt/on8ZXx0eYpn0sJRHE5XO2BR5oX9\nRMTValE2JtG3PityRidqOmYz72Wfx/uCeQJlDwrSq3m6p+aVO7g5nHdw0OMj/0zt\nb2/AUIuSkApn7xQ6gUi7Ncdw\n-----END PRIVATE KEY-----\n",
    client_email:
      "firebase-adminsdk-3wnri@empireworld-95422.iam.gserviceaccount.com",
    client_id: "117694735311347415055",
    auth_uri: "https://accounts.google.com/o/oauth2/auth",
    token_uri: "https://oauth2.googleapis.com/token",
    auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
    client_x509_cert_url:
      "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-3wnri%40empireworld-95422.iam.gserviceaccount.com",
    universe_domain: "googleapis.com",
  };

  const SCOPES = ["https://www.googleapis.com/auth/firebase.messaging"];
  const URL = `https://fcm.googleapis.com/v1/projects/${key.project_id}/messages:send`;
  const jwtClient = new JWT(
    key.client_email,
    null,
    key.private_key,
    SCOPES,
    null
  );

  return new Promise((resolve, reject) => {
    jwtClient.authorize((err, tokens) => {
      if (err) {
        reject(err);
        return;
      }
      if (tokens === undefined) {
        reject(new Error("Tokens are undefined"));
        return;
      }
      resolve(tokens.access_token);
    });
  });
}

async function sendMessage() {
  try {
    const accessToken = await getAccessToken();

    const URL = `https://fcm.googleapis.com/v1/projects/empireworld-95422/messages:send`;
    const message = {
      messageId: "12345",
      title: "Payment Successful",
      body: `Dear user,
Your payment has been received. In case of any problem, kindly contact head office.`,
      id: 238354,
      type: "payment",
    };
    const token =
      "dzpl6Tj7V08Hi6xBAEqJXQ:APA91bHOrM2rSnyJ5fQW6-kzqclGE6TEyI8FfRNeeg44VEbAgh_IYdYuhok4dmLidSVYzQzmzoY3t1BcOvgEdgmpNWoEQ6AcT2KTfhGuDCViCVu3pPuhv3g2oU8_I1ZLPTN23OXDVoUa";

    const response = await axios.post(
      URL,
      {
        message: {
          token,
          notification: {
            title: message.title,
            body: message.body,
          },
          data: {
            id: message.id,
            type: message.type,
          },
        },
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      }
    );
    console.log(response);

    // if (response.status !== 200) {
    //   throw new Error("Error sending message");
    // }
  } catch (error) {
    console.error(error);
    console.log("error");
  }
}

sendMessage();
