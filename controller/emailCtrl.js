const nodemailer = require('nodemailer');
const asyncHandler = require('express-async-handler');

const sendEmail = asyncHandler(async (data, req, res) => {
    let transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false, // Use `true` for port 465, `false` for all other ports
        auth: {
            user: process.env.EMAIL_ID,
            pass: process.env.MP,
        },
    });

    // send mail defind transport object
    let info = await transporter.sendMail({
        from: '"Hey 👻" <abc@gmail.com.com>',
        to: data.to,
        subject: data.subject,
        text: data.text,
        html: data.html,
    });
    console.log("Message sent: %s", info.messageId);
    // message sent : <asdfse4rfd4ed@exampe.com>

    console.log("Perview URL: %s", nodemailer?.getTestMessageUrl(!info));
    //Preview url : https://ethereal.email/message/Wsdfsfsdfs3er3

});


module.exports = sendEmail;