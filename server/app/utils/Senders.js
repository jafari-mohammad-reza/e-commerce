const createHttpError = require('http-errors');
const nodemailer = require('nodemailer');
const accountSid = process.env.SMS_AUTH_SID;
const authToken = process.env.SMS_AUTH_TOKEN;
const {messages} = require('twilio')('AC24ee22288290e4895e24dc443f8f4691', '1116a8ece02c66d071226804a95e0ed2');
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.USER_MAIL,
    pass: process.env.USER_PASS,
  },
  tls: {
    rejectUnauthorized: false,

  },
});

/**
 * send verification code to email
 * @param {{default: string, lowercase: boolean, uniq: boolean, type: StringConstructor, required: boolean}} receiver
 * @param {string} code
 * */
function SendAccountVerification(receiver, code) {
  transporter.sendMail(
      {
        to: receiver,
        from: 'E-Commerce store',
        subject: 'Verify your account',
        html: `
        <div style="width: 100vw;height:100vh;display: flex;flex-direction: column;align-items: center;justify-content: center;">
            <h1 style="font-size: 35px;color: #c8a267;">Welcome to E-Commerce store</h1>
            <h4>Please verify your account with this code</h4>
            <h3 style="font-size: 25px;font-weight: 500;margin-top: 20px;">${code}</h3>
        </div>
    `,
      },
      (err, result) => {
        if (err) {
          throw createHttpError.InternalServerError('Something went wrong' + err.message);
        }
        console.log(result);
      },
  );
}

/**
 * send any kind of email
 * @param {receiver} receiver
 * @param {subject} subject
 * @param {content} content
 * */
function SendEmail(receiver, subject, content) {
  transporter.sendMail({
    to: receiver,
    from: 'E-Commerce store',
    subject: subject,
    text: content,

  }, (err, result) => {
    if (err) {
      throw createHttpError.InternalServerError('Something went wrong' + err.message);
    }
  });
}

/**
 * send any kind of sms
 * @param {receiver} receiver
 * @param {string} content
 * */
function SendSms(receiver, content) {
  messages
      .create({
        messagingServiceSid: 'MGdc5a0b6342b0bf0ed39695b34c918845',
        body: content,
        to: receiver,
        from: '+17432442557',
        forceDelivery: true,
      })
      .then((message) => console.log(`SMS sent ${message.status}`)).catch((error) => {
        throw createHttpError.InternalServerError('Something went wrong' + error.message).done();
      });
}


module.exports = {
  SendEmail,
  SendAccountVerification, SendSms,
};
