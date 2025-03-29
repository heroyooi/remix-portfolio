import { useState } from 'react';

export default function ContactPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [result, setResult] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const res = await fetch(
      'https://us-central1-remix-portfolio.cloudfunctions.net/sendMail',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, message }),
      }
    );

    if (res.ok) {
      setResult('✅ 메일이 성공적으로 전송되었습니다!');
      setName('');
      setEmail('');
      setMessage('');
    } else {
      setResult('❌ 메일 전송에 실패했습니다. 다시 시도해주세요.');
    }
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h1>📬 Contact</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="이름"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <br />
        <input
          type="email"
          placeholder="이메일"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <br />
        <textarea
          placeholder="메시지"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          required
        />
        <br />
        <button type="submit">보내기</button>
      </form>
      {result && <p>{result}</p>}
    </div>
  );
}
