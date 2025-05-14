import { useEffect, useState } from 'react';
import { db } from '~/lib/firebase.client';
import {
  collection,
  getDocs,
  deleteDoc,
  doc,
  query,
  orderBy,
} from 'firebase/firestore';

import { Link } from '@remix-run/react';
import styles from '~/styles/admin-project-list.module.scss';

type Project = {
  id: string;
  title: string;
  description: string;
  period: string;
  techStack: string;
  imageUrl: string;
  portfolioUrl?: string;
};

export default function ProjectListPage() {
  const [projects, setProjects] = useState<Project[]>([]);

  useEffect(() => {
    const fetchProjects = async () => {
      const q = query(collection(db, 'projects'), orderBy('createdAt', 'desc'));
      const snapshot = await getDocs(q);
      const result: Project[] = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Project[];
      setProjects(result);
    };

    fetchProjects();
  }, []);

  const handleDelete = async (id: string) => {
    const ok = confirm('정말 삭제하시겠습니까?');
    if (!ok) return;

    await deleteDoc(doc(db, 'projects', id));
    setProjects((prev) => prev.filter((p) => p.id !== id));
  };

  return (
    <div className={styles.projectListWrap}>
      <h2>📁 등록된 프로젝트 목록</h2>
      {projects.length === 0 ? (
        <p>아직 등록된 프로젝트가 없습니다.</p>
      ) : (
        <ul>
          {projects.map((project) => (
            <li key={project.id} className={styles.projectItem}>
              {project.imageUrl && (
                <img
                  src={project.imageUrl}
                  alt={project.title}
                  className={styles.projectImage}
                />
              )}
              <div className={styles.projectInfo}>
                <strong>{project.title}</strong>
                <span>{project.period}</span>
                <br />
                <span>{project.techStack}</span>
                <br />
                {project.portfolioUrl && (
                  <a
                    href={project.portfolioUrl}
                    target='_blank'
                    rel='noopener noreferrer'
                    className={styles.portfolioLink}
                  >
                    🔗 포트폴리오 보기
                  </a>
                )}
                <div className={styles.actionButtons}>
                  <Link to={`/admin/projects/${project.id}/edit`}>✏️ 수정</Link>
                  <button onClick={() => handleDelete(project.id)}>
                    🗑️ 삭제
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
