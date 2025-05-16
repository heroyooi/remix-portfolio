import styles from '~/styles/about-page.module.scss';

export default function AboutPage() {
  return (
    <div className={styles.container}>
      <h1 className={styles.heading}>🙋‍♀️ 소개</h1>

      <section className={styles.section}>
        <p>
          안녕하세요! 저는 <strong>웹 퍼블리셔</strong>로 시작해 현재는
          <strong> 프론트엔드 개발자이자 데이터 사이언티스트</strong>로도
          활동하고 있는 <strong>12년차 웹 전문가</strong>입니다.
        </p>
        <p>
          메가공무원에서 퍼블리싱 리드를 맡으며 대형 교육 플랫폼의 UI/UX를
          총괄하고, 팀원들과 함께 효율적인 작업 환경을 만들기 위해 끊임없이
          고민해왔습니다.
        </p>
      </section>

      <section className={styles.section}>
        <h2 className={styles.subheading}>🔥 강점</h2>
        <ul className={styles.list}>
          <li>디자인 감각을 살리는 섬세한 퍼블리싱</li>
          <li>개발자와 원활한 협업을 위한 코드 이해력</li>
          <li>웹 성능 최적화 및 Lighthouse 점수 개선</li>
          <li>GA(Google Analytics)와 Firebase를 활용한 데이터 기반 개선</li>
        </ul>
      </section>

      <section className={styles.section}>
        <h2 className={styles.subheading}>💼 커리어 요약</h2>
        <ul className={`${styles.list} ${styles.square}`}>
          <li>총 경력: 12년차</li>
          <li>
            <div className={styles.current}>
              <span className={styles.sublogo}>
                <img src={'/megagong.ico'} alt={'메가공'} />
              </span>
              메가공무원 퍼블리싱 리드
            </div>
          </li>
          <li>프론트엔드: React, Remix, Next.js, TypeScript</li>
          <li>백엔드: Firebase Authentication / Firestore / Cloud Functions</li>
        </ul>
      </section>

      <section className={styles.section}>
        <h2 className={styles.subheading}>🌱 현재 배우는 중</h2>
        <p>
          새로운 기술에 대한 호기심이 많아, 최근에는{' '}
          <strong>Remix + Firebase</strong> 조합으로
          <strong> 개인 포트폴리오 및 관리자 대시보드</strong>를 개발 중입니다.
          또한, 데이터를 기반으로 사용자 경험을 개선하기 위해 데이터 시각화와
          딥러닝도 함께 공부하고 있습니다.
        </p>
      </section>
    </div>
  );
}
