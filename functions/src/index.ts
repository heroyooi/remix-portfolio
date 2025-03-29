import * as functions from 'firebase-functions/v1';
import nodemailer from 'nodemailer';
import express, { Request, Response } from 'express';
import cors from 'cors';

const app = express();
app.use(cors({ origin: true }));
app.use(express.json());

// Nodemailer 설정 (Gmail SMTP 사용)
const mailTransport = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: functions.config().gmail.email,
    pass: functions.config().gmail.password,
  },
});

// 이메일 전송 API
app.post('/', (req: Request, res: Response) => {
  (async () => {
    const { name, email, message } = req.body;

    const mailOptions = {
      from: email,
      to: functions.config().gmail.email,
      subject: `[문의] ${name}님으로부터 메일이 도착했습니다.`,
      text: `보낸 사람: ${name} (${email})\n\n메시지:\n${message}`,
    };

    console.log('보내는 사람:', email);
    console.log('받는 사람:', functions.config().gmail.email);
    console.log('메시지:', message);

    try {
      await mailTransport.sendMail(mailOptions);
      return res.status(200).send({ success: true });
    } catch (error) {
      console.error('메일 전송 실패:', error);
      return res.status(500).send({ success: false, error });
    }
  })();
});

// Firebase Functions export
export const sendMail = functions
  .runWith({ memory: '256MB', timeoutSeconds: 30 })
  .https.onRequest(app);
