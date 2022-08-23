import AppConfig from '../../configs/app.config';
import { google } from 'googleapis';
import { createTransport } from 'nodemailer';
import { ISendMail } from '../../common/interfaces/sendMail';

const sendMailConfig = AppConfig.SEND_MAIL;

const oAuth2Client = new google.auth.OAuth2(
   sendMailConfig.CLIENT_ID,
   sendMailConfig.CLIENT_SECRET,
   sendMailConfig.REDIRECT_URI
);

oAuth2Client.setCredentials({ refresh_token: sendMailConfig.REFRESH_TOKEN });

async function sendMail(sendMailData: ISendMail) {
   try {
      const accessToken = await oAuth2Client.getAccessToken();

      const transporter = createTransport({
         service: sendMailConfig.SERVICE,
         auth: {
            type: 'OAUTH2',
            user: sendMailConfig.USER,
            clientId: sendMailConfig.CLIENT_ID,
            clientSecret: sendMailConfig.CLIENT_SECRET,
            refreshToken: sendMailConfig.REFRESH_TOKEN,
            accessToken: accessToken as any,
         },
      });
      // send mail with defined transport object
      const info = await transporter.sendMail({
         from: sendMailData.from, // sender address
         to: sendMailData.to, // list of receivers
         subject: sendMailData.subject, // Subject line
         text: sendMailData.text, // plain text body
         html: sendMailData.html,
      });
      console.log('Send mail Sucess: %s\n', info.messageId);
      return info;
   } catch (error) {
      throw error;
   }
}

export { sendMail };
