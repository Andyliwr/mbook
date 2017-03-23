//发送验证邮件
const nodemailer = require('nodemailer');
// create reusable transporter object using the default SMTP transport
let transporter = nodemailer.createTransport({
    service: "qiye.aliyun",
    auth: {
        user: 'postman@andylistudio.com‍',
        password: ''
    }
});
// setup email data with unicode symbols
let mailOptions = {
    from: '"Fred Foo" <postman@andylistudio.com‍>', // sender address
    to: 'lidikang@myhexin.com', // list of receivers
    subject: 'Hello ✔', // Subject line
    text: 'Hello world ?', // plain text body
    html: '<b>Hello world ?</b>' // html body
};
// send mail with defined transport object
transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
        return console.log(error);
    }
    console.log('Message %s sent: %s', info.messageId, info.response);
});