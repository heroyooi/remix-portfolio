import { json } from '@remix-run/node';
import { getAuth } from 'firebase-admin/auth';
import { setUserSession, sessionStorage } from '~/lib/session.server';
import { initializeFirebaseAdmin } from '~/lib/firebase.server';

initializeFirebaseAdmin();

export async function action({ request }: any) {
  try {
    const { token } = await request.json();
    console.log('받은 토큰:', token);

    const decoded = await getAuth().verifyIdToken(token);
    const session = await setUserSession(request, token);

    return json(
      { success: true },
      {
        headers: {
          'Set-Cookie': await sessionStorage.commitSession(session),
        },
      }
    );
  } catch (err: any) {
    console.error('세션 저장 실패:', err);
    return json(
      { success: false, error: err.message || '세션 저장 실패' },
      { status: 500 }
    );
  }
}
