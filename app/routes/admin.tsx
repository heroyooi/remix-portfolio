import { useEffect } from 'react';
import { useNavigate } from '@remix-run/react';
import { auth } from '~/lib/firebase';

export default function AdminPage() {
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (!user) {
        navigate('/login');
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <div style={{ padding: '2rem' }}>
      <h1>관리자 전용 페이지</h1>
      <p>여기서 프로젝트를 관리할 수 있어요.</p>
    </div>
  );
}
