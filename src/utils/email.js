import nodemailer from 'nodemailer';
import config from '../config';

export default ({ subject, to, html }) => {
  const transporter = nodemailer.createTransport(config.email);
  const mailOptions = {
    from: config.email.from,
    to,
    subject,
    html
  };

  return new Promise((resolve, reject) => {
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        reject(error);
      } else {
        resolve(info);
      }
    });
  });
}
