import { useEffect, useState } from 'react';
import { db } from '~/lib/firebase.client';
import {
  collection,
  getDocs,
  updateDoc,
  deleteDoc,
  doc,
  query,
  orderBy,
} from 'firebase/firestore';
import { Link, useLocation } from '@remix-run/react';
import styles from '~/styles/admin-project-list.module.scss';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';

type Project = {
  id: string;
  title: string;
  description: string;
  period: string;
  techStack: string;
  imageUrl: string;
  portfolioUrl?: string;
  order?: number;
};

export default function ProjectListPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const newId = searchParams.get('new'); // 쿼리에서 new=ID 추출

  useEffect(() => {
    const fetchProjects = async () => {
      const q = query(collection(db, 'projects'), orderBy('order', 'asc'));
      const snapshot = await getDocs(q);
      const result: Project[] = snapshot.docs.map((docSnap, idx) => {
        const data = docSnap.data() as Partial<Project>;

        return {
          id: docSnap.id,
          title: data.title || '',
          description: data.description || '',
          period: data.period || '',
          techStack: data.techStack || '',
          imageUrl: data.imageUrl || '',
          portfolioUrl: data.portfolioUrl || '',
          order: data.order ?? idx,
        };
      });
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

  const handleDragEnd = async (result: any) => {
    if (!result.destination) return;

    const reordered = Array.from(projects);
    const [moved] = reordered.splice(result.source.index, 1);
    reordered.splice(result.destination.index, 0, moved);

    const updates = reordered.map((p, i) => ({ ...p, order: i }));
    setProjects(updates);

    await Promise.all(
      updates.map((p) =>
        updateDoc(doc(db, 'projects', p.id), { order: p.order })
      )
    );
  };

  return (
    <div className={styles.projectListWrap}>
      <h2>📁 등록된 프로젝트 목록 (드래그로 순서 변경)</h2>
      {projects.length === 0 ? (
        <p>아직 등록된 프로젝트가 없습니다.</p>
      ) : (
        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId='projectList'>
            {(provided) => (
              <ul ref={provided.innerRef} {...provided.droppableProps}>
                {projects.map((project, index) => (
                  <Draggable
                    key={project.id}
                    draggableId={project.id}
                    index={index}
                  >
                    {(provided) => (
                      <li
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        style={provided.draggableProps.style}
                        className={`${styles.projectItem} ${
                          project.id === newId ? styles.highlight : ''
                        }`}
                      >
                        <div className={styles.projectContent}>
                          {project.imageUrl && (
                            <img
                              src={project.imageUrl}
                              alt={project.title}
                              className={styles.projectImage}
                            />
                          )}
                          <div className={styles.projectInfo}>
                            <div className={styles.orderTopRight}>
                              #{project.order}
                            </div>
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
                              <Link to={`/admin/projects/${project.id}/edit`}>
                                ✏️ 수정
                              </Link>
                              <button onClick={() => handleDelete(project.id)}>
                                🗑️ 삭제
                              </button>
                            </div>
                          </div>
                        </div>
                      </li>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </ul>
            )}
          </Droppable>
        </DragDropContext>
      )}
    </div>
  );
}
