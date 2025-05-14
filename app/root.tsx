import {
  Form,
  Link,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useRouteLoaderData,
} from '@remix-run/react';
import type { LinksFunction, MetaFunction } from '@remix-run/node';
import { LoaderFunctionArgs, json } from '@remix-run/node';
import { getUserToken } from '~/lib/session.server';
import ThemeToggle from '~/components/ThemeToggle';
import '~/styles/global.scss';
import styles from '~/styles/root.module.scss';
import { useEffect, useState } from 'react';

export async function loader({ request }: LoaderFunctionArgs) {
  const token = await getUserToken(request);

  if (!token) {
    return json({ user: null });
  }

  const { initializeFirebaseAdmin } = await import('~/lib/firebase.server');
  const { getAuth } = await import('firebase-admin/auth');

  initializeFirebaseAdmin();

  try {
    const decoded = await getAuth().verifyIdToken(token);
    const email = decoded.email ?? '';
    const isAdmin = email === process.env.ADMIN_EMAIL;
    return json({
      user: {
        email,
        isAdmin,
      },
    });
  } catch (error) {
    console.error('유저 인증 실패:', error);
    return json({ user: null });
  }
}

export const meta: MetaFunction = () => {
  return [
    { title: '내 포트폴리오' },
    { name: 'description', content: '퍼블리셔의 경력 포트폴리오입니다.' },
  ];
};

export const links: LinksFunction = () => [
  { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
  {
    rel: 'preconnect',
    href: 'https://fonts.gstatic.com',
    crossOrigin: 'anonymous',
  },
  {
    rel: 'stylesheet',
    href: 'https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap',
  },
];

export function Layout({ children }: { children: React.ReactNode }) {
  const data = useRouteLoaderData('root') as
    | { user: { email: string; isAdmin?: boolean } }
    | undefined;
  const user = data?.user ?? null;

  const isDark =
    typeof document !== 'undefined'
      ? document.documentElement.classList.contains('dark')
      : false;
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const body = document.body;

    if (menuOpen) {
      body.style.overflow = 'hidden';
    } else {
      body.style.overflow = '';
    }

    return () => {
      body.style.overflow = '';
    };
  }, [menuOpen]);

  return (
    <html lang='en' className={isDark ? 'dark' : ''}>
      <head>
        <meta charSet='utf-8' />
        <meta name='viewport' content='width=device-width, initial-scale=1' />
        <Meta />
        <Links />
      </head>
      <body>
        <header className={styles.header}>
          <div className={styles.header_inner}>
            <h1 className={styles.logo}>
              <Link to='/'>🏠 퍼블리싱 폴포츠</Link>
            </h1>

            <button
              className={`${styles.menu_toggle} ${menuOpen ? styles.open : ''}`}
              onClick={() => setMenuOpen(!menuOpen)}
            >
              {menuOpen ? '✖' : '☰'}
            </button>

            <nav className={`${styles.nav} ${menuOpen ? styles.open : ''}`}>
              <Link to='/about'>🙋‍♀️ 소개</Link>
              <Link to='/projects'>🧩 프로젝트</Link>
              <Link to='/contact'>📬 문의</Link>
              {user?.isAdmin && (
                <>
                  <Link to='/admin/messages'>📬 문의 메시지</Link>
                  <Link to='/admin/projects'>🔐 관리자</Link>
                </>
              )}
              <div className={styles.auth}>
                <ThemeToggle />
                {user ? (
                  <>
                    <span>👤 {user.email}</span>
                    <Form action='/logout' method='post'>
                      <button type='submit'>🚪 로그아웃</button>
                    </Form>
                  </>
                ) : (
                  <>
                    <Link to='/login'>🔐 로그인</Link>
                    <Link to='/signup'>📝 회원가입</Link>
                  </>
                )}
              </div>
            </nav>
          </div>
        </header>

        {/* ✅ 메뉴 오픈 시 딤 처리 */}
        {menuOpen && (
          <div
            className={`${styles.overlay} ${styles.show}`}
            onClick={() => setMenuOpen(false)}
          />
        )}

        <main style={{ padding: '2rem' }}>
          <Outlet />
        </main>

        <footer
          style={{
            padding: '1rem',
            borderTop: '1px solid #ccc',
            marginTop: '2rem',
          }}
        >
          <p>© {new Date().getFullYear()} 성연욱. All rights reserved.</p>
        </footer>
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return <Outlet />;
}
