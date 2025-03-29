import * as functions from 'firebase-functions';
import * as nodemailer from 'nodemailer';
import * as cors from 'cors';
import * as express from 'express';

const app = express();
app.use(cors({ origin: true }));
app.use(express.json());

const mailTransport = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: functions.config().gmail.email,
    pass: functions.config().gmail.password,
  },
});

app.post('/sendMail', async (req, res) => {
  const { name, email, message } = req.body;

  const mailOptions = {
    from: email,
    to: functions.config().gmail.email,
    subject: `[문의] ${name}님으로부터 메일이 도착했습니다.`,
    text: `보낸 사람: ${name} (${email})\n\n메시지:\n${message}`,
  };

  try {
    await mailTransport.sendMail(mailOptions);
    return res.status(200).send({ success: true });
  } catch (error) {
    return res.status(500).send({ success: false, error });
  }
});

exports.api = functions.https.onRequest(app);
