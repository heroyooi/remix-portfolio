import { Form, useActionData, useNavigate } from '@remix-run/react';
import { json, redirect } from '@remix-run/node';
import { signInWithEmailAndPassword, signInWithPopup } from 'firebase/auth';
import { auth, googleProvider, githubProvider } from '~/lib/firebase.client';
import { setUserSession } from '~/lib/session.server';

export const action = async ({ request }: any) => {
  const formData = await request.formData();
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    const token = await userCredential.user.getIdToken();

    const session = await setUserSession(request, token);
    return redirect('/', {
      headers: {
        'Set-Cookie': await sessionStorage.commitSession(session),
      },
    });
  } catch (error: any) {
    console.error('이메일 로그인 실패:', error);
    return json({ error: '이메일 또는 비밀번호가 올바르지 않습니다.' });
  }
};

export default function LoginPage() {
  const navigate = useNavigate();
  const actionData = useActionData<{ error?: string }>();

  const handleSocialLogin = async (provider: any) => {
    try {
      const result = await signInWithPopup(auth, provider);
      const token = await result.user.getIdToken();

      await fetch('/auth/session', {
        method: 'POST',
        body: JSON.stringify({ token }),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      navigate('/');
    } catch (err) {
      console.error('소셜 로그인 실패:', err);
      alert('소셜 로그인에 실패했습니다.');
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: '0 auto' }}>
      <h1>🔐 로그인</h1>

      {actionData?.error && (
        <p style={{ color: 'red', marginBottom: '1rem' }}>{actionData.error}</p>
      )}

      {/* ✅ 일반 이메일 로그인 */}
      <Form method='post'>
        <p>
          <label>
            이메일:
            <input type='email' name='email' required />
          </label>
        </p>
        <p>
          <label>
            비밀번호:
            <input type='password' name='password' required />
          </label>
        </p>
        <button type='submit'>로그인</button>
      </Form>

      <hr style={{ margin: '2rem 0' }} />

      {/* ✅ 소셜 로그인 */}
      <button
        onClick={() => handleSocialLogin(googleProvider)}
        style={{ display: 'block', marginBottom: '1rem' }}
      >
        🔐 Google로 로그인
      </button>
      <button onClick={() => handleSocialLogin(githubProvider)}>
        🐱 GitHub로 로그인
      </button>
    </div>
  );
}
