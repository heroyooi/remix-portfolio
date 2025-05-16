import type { MetaFunction, LoaderFunctionArgs } from '@remix-run/node';
import { json } from '@remix-run/node';
import { Link, useLoaderData } from '@remix-run/react';
import styles from '~/styles/home.module.scss';
import { getTopProjects } from '~/lib/firebase.server';
import Layout from '~/components/Layout';

export const meta: MetaFunction = () => {
  return [
    { title: 'M사 퍼블리셔 출신 프론트엔드 개발자, 성연욱 ' },
    {
      name: 'description',
      content:
        '퍼블리셔 출신 프론트엔드 개발자 성연욱입니다. UI/UX 구현 경험과 Firebase 기반의 프론트엔드 솔루션을 통해 사용자 중심의 웹을 개발합니다.',
    },
  ];
};

// 🔌 Firestore에서 최신 프로젝트 3개 불러오기
export const loader = async ({}: LoaderFunctionArgs) => {
  const projects = await getTopProjects(); // imageUrl, title, techStack 포함
  return json({ projects });
};

export default function HomePage() {
  const { projects } = useLoaderData<typeof loader>();

  return (
    <Layout>
      <main className={styles.heroWrap}>
        <section className={styles.hero}>
          <h1>
            안녕하세요, <br />
            <span className={styles.name}>성연욱</span>입니다.
          </h1>
          <p className={styles.subtitle}>
            <span className={styles.sublogo}>
              <img src={'/megagong.ico'} alt={'메가공'} />
            </span>
            퍼블리셔 출신 프론트엔드 개발자
          </p>
          <p className={styles.desc}>
            12년 가까운 퍼블리싱 경험을 바탕으로, <br />
            HTML/CSS/JavaScript의 정교한 구현력을 갖춘 프론트엔드 개발자입니다.
            <br />
            사용자 경험과 인터랙션, 그리고 Firebase 기반의 데이터 흐름까지{' '}
            <br />
            <strong>디자인과 구현의 경계를 연결하는</strong> 웹 솔루션을
            만듭니다.
          </p>

          <div className={styles.highlightBox}>
            <div className={styles.highlightIcon}>🚀</div>
            <div className={styles.highlightText}>
              <p>
                이 포트폴리오 사이트는
                <strong className={styles.highlightTech}>
                  React 기반 Remix 프레임워크
                </strong>
                를 활용하여 제작되었으며,
                <br />
                관리자 기능과 문의 시스템, 그리고 포트폴리오 등록 기능까지
                <strong className={styles.highlightTech}>
                  Firebase 기반의 풀스택 구조
                </strong>
                로 직접 개발하였습니다.
              </p>
            </div>
          </div>

          <div className={styles.actions}>
            <Link to='/projects' className={styles.primaryBtn}>
              🚀 프로젝트 보기
            </Link>
            <a
              href='javascript:void(0);'
              className={styles.secondaryBtn}
              onClick={() => alert('이력서 준비중입니다.')}
            >
              📄 이력서 다운로드
            </a>
          </div>
        </section>

        {/* 기술 스택 */}
        <section className={styles.stackSection}>
          <h2>🛠 기술 스택</h2>
          <div className={styles.stackList}>
            {[
              'JS',
              'React.js',
              'Next.js',
              'Remix',
              'Firebase',
              'SCSS',
              'TypeScript',
              'HTML',
              'CSS',
              'jQuery',
              'AI',
            ].map((tech) => (
              <span key={tech} className={styles.techBadge}>
                {tech}
              </span>
            ))}
          </div>
        </section>

        {/* 프로젝트 3개 미리보기 */}
        <section className={styles.projectPreview}>
          <h2>📂 최신 프로젝트</h2>
          <div className={styles.projectCards}>
            {projects.map((p) => {
              const CardContent = (
                <>
                  <img
                    src={p.imageUrl || '/logo-light.png'}
                    alt={p.title}
                    className={styles.projectImage}
                  />
                  <h4>{p.title}</h4>
                  <div className={styles.stackList}>
                    {p.techStack.split(',').map((t: string, i: number) => (
                      <span key={i} className={styles.techBadge}>
                        {t.trim()}
                      </span>
                    ))}
                  </div>
                </>
              );

              return p.portfolioUrl ? (
                <a
                  key={p.id}
                  href={p.portfolioUrl}
                  target='_blank'
                  rel='noopener noreferrer'
                  className={styles.projectCard}
                  style={{ textDecoration: 'none', color: 'inherit' }}
                >
                  {CardContent}
                </a>
              ) : (
                <div key={p.id} className={styles.projectCard}>
                  {CardContent}
                </div>
              );
            })}
          </div>
          <Link to='/projects' className={styles.primaryBtn}>
            전체 프로젝트 보기 →
          </Link>
        </section>
      </main>
    </Layout>
  );
}
