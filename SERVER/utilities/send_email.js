const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: 'smtp.ethereal.email',
  port: 587,
  auth: {
      user: 'trent.christiansen47@ethereal.email',
      pass: 'UQCaHNNeg9HpEVUv1U'
  }
});

async function send_email({email, text}) {
  const info = await transporter.sendMail({
    from: '"Maddison Foo Koch 👻" <kathryne.bogisich65@ethereal.email>', 
    to: email,
    subject: "One Time password Login", 
    text: text, 
  });

  console.log("Message sent: %s", info.messageId);
}


module.exports = {send_email}