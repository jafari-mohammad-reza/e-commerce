const createHttpError = require("http-errors");
const nodemailer = require("nodemailer");
const mailer = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER_NAME,
        pass: process.env.EMAIL_USER_PASS,

    },
    tls: {
        rejectUnauthorized: false,
    },
});

async function SendResetPasswordEmail() {
}

async function SendAccountVerification(receiver, token) {
    mailer.sendMail(
        {
            to: receiver,
            from: "E-Commerce store",
            subject: "Verify your account",
            text: `
        <div style="width: 100vw;height:100vh;display: flex;flex-direction: column;align-items: center;justify-content: center;">
            <h1 style="font-size: 35px;color: #c8a267;">Welcome to E-Commerce store</h1>
            <h4>Please verify your account by the link down there</h4>
            <a style="text-decoration: none; background-color:#c8a267;color:#fff;width:70px;height:45px;border:none;outline:none;border-radius:15px;" href="http://localhost:5000/api/v1/auth/email/active-account/${token}">Verify</a>
        </div>
    `,
        },
        (err, result) => {
            if (!err) {
                console.log(result);
            }
            console.error(err);
        }
    );
}

async function SendEmail() {
}

module.exports = {
    SendResetPasswordEmail,
    SendAccountVerification,
    SendEmail,
};
