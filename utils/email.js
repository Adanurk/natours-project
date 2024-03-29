const nodemailer = require('nodemailer');
const pug = require('pug');
const htmlToText = require('html-to-text');

module.exports = class Email {
  constructor(user, url) {
    this.to = user.email;
    this.firstName = user.name.split(' ')[0];
    this.url = url;
    this.from = `Kübra <${process.env.EMAIL_FROM}>`;
  }

  newTransport() {
    if (process.env.NODE_ENV === 'production') {
      // Sendgrid
      return nodemailer.createTransport({
        service: 'SendGrid',
        auth: {
          user: process.env.SENDGRID_USERNAME,
          pass: process.env.SENDGRID_PASSWORD,
        },
      });
    }

    return nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
      },
    });
  }

  async send(template, subject) {
    //Send the actual email
    // 1) render HTML based on a pug template
    const html = pug.renderFile(`${__dirname}/../views/email/${template}.pug`, {
      firstName: this.firstName,
      url: this.url,
      subject,
    });

    // 2) define the email options
    const mailOptions = {
      from: this.from,
      to: this.to,
      subject,
      html: html,
      text: htmlToText.fromString(html),
    };

    // 3) create a transport and send email
    await this.newTransport().sendMail(mailOptions);
  }

  async sendWelcome() {
    await this.send('welcome', 'Welcome to the Natours Family!');
  }

  async sendPasswordReset() {
    await this.send(
      'passwordReset',
      'Your password reset token (valid for only 10 minutes'
    );
  }
};

// const sendEmail = async (options) => {
// 1) Create a transporter
// const transporter = nodemailer.createTransport({
//   host: process.env.EMAIL_HOST,
//   port: process.env.EMAIL_PORT,
//   // service: 'Gmail',
//   auth: {
//     user: process.env.EMAIL_USERNAME,
//     pass: process.env.EMAIL_PASSWORD,
//   },
// in your gmail account you have to activate "less secure app" option if you use gmail as service
// });

// 2) Define the email options
// const mailOptions = {
//   from: 'Kubra <gumussoykbr@gmail.com>',
//   to: options.email,
//   subject: options.subject,
//   text: options.message,
// html:
// };

// 3) Actually send the email
// await transporter.sendMail(mailOptions);
// };

// module.exports = sendEmail;
