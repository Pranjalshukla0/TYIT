require('dotenv').config();
import nodemailer, { Transporter } from 'nodemailer';
import ejs from 'ejs';
import path from 'path';

interface EmailOptions {
  email: string;
  subject: string;
  template: string;
  data: { [key: string]: any };
}

const sendMail = async (options: EmailOptions): Promise<void> => {
  // Nodemailer transporter configuration
  const transporter: Transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || '465'),
  //  service: process.env.SMTP_SERVICE,
  secure:true, // use SSL since port is 465
    auth: {
      user: process.env.SMTP_MAIL,
      pass: process.env.SMTP_PASSWORD,
    },
  });

  // Destructure options
  const { email, subject, template, data } = options;

  // Path to the email template
  const templatePath = path.join(__dirname, '../mails', template);

  // Render the email template
  const html: string = await ejs.renderFile(templatePath, data);

  // Email options for nodemailer
  const mailOptions = {
    from: process.env.SMTP_MAIL,
    to: email,
    subject,
    html, // HTML content from the template
  };

  // Send email
  await transporter.sendMail(mailOptions);
};

export default sendMail;
