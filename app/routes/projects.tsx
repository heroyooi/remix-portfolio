import { useLoaderData } from '@remix-run/react';
import { getAllProjects } from '~/lib/firebase.server';
import { json } from '@remix-run/node';
import Layout from '~/components/Layout';
import styles from '~/styles/projects.module.scss';

export const loader = async () => {
  const projects = await getAllProjects();

  return json({ projects });
};

export default function ProjectsPage() {
  const { projects } = useLoaderData<typeof loader>();

  return (
    <Layout>
      <div className={styles.wrapper}>
        <h1>🧩 프로젝트</h1>
        <div className={styles.projectList}>
          {projects.map((project) => (
            <div key={project.id} className={styles.projectCard}>
              <img
                className={styles.projectImage}
                src={project.imageUrl || '/logo-light.png'}
                alt={project.title}
              />

              <h3>{project.title}</h3>

              <p>
                <strong>설명:</strong>
                {(project.description ?? '')
                  .split('\n')
                  .map((line: string, idx: number) => (
                    <span key={idx}>
                      {line}
                      <br />
                    </span>
                  ))}
              </p>

              <p>
                <strong>기간:</strong> {project.period}
              </p>

              <div>
                <strong>기술 스택:</strong>
                <div className={styles.stackList}>
                  {(project.techStack ?? '')
                    .split(',')
                    .map((tech: string, index: number) => (
                      <span key={index} className={styles.techBadge}>
                        {tech.trim()}
                      </span>
                    ))}
                </div>
              </div>

              {project.portfolioUrl && (
                <a
                  href={project.portfolioUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.projectLink}
                >
                  🔗 포트폴리오 링크 보기
                </a>
              )}

              <p className={styles.createdAt}>
                등록일: {new Date(project.createdAt).toLocaleDateString()}
              </p>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
}
