import { useEffect, useState } from 'react';
import { useNavigate, useParams } from '@remix-run/react';
import { db, storage } from '~/lib/firebase.client';
import { doc, getDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import {
  getDownloadURL,
  ref,
  uploadBytes,
  deleteObject,
} from 'firebase/storage';
import styles from '~/styles/admin-project-form.module.scss';

export default function EditProjectPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [period, setPeriod] = useState('');
  const [techStack, setTechStack] = useState('');
  const [portfolioUrl, setPortfolioUrl] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProject = async () => {
      if (!id) return;
      const docRef = doc(db, 'projects', id);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        setTitle(data.title);
        setDescription(data.description);
        setPeriod(data.period);
        setTechStack(data.techStack);
        setPortfolioUrl(data.portfolioUrl || '');
        setImageUrl(data.imageUrl || '');
      } else {
        setError('해당 프로젝트를 찾을 수 없습니다.');
      }
      setLoading(false);
    };

    fetchProject();
  }, [id]);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;

    try {
      let finalImageUrl = imageUrl;

      // ✅ 새 이미지가 있고 기존 이미지도 있으면 기존 이미지 삭제
      if (imageFile && imageUrl) {
        try {
          const path = new URL(imageUrl).pathname.split('/o/')[1].split('?')[0];
          const decodedPath = decodeURIComponent(path);
          const oldImageRef = ref(storage, decodedPath);
          await deleteObject(oldImageRef);
        } catch (err) {
          console.warn('기존 이미지 삭제 실패:', err);
        }
      }

      // ✅ 새 이미지 업로드
      if (imageFile) {
        const storageRef = ref(
          storage,
          `projects/${Date.now()}_${imageFile.name}`
        );
        const snapshot = await uploadBytes(storageRef, imageFile);
        finalImageUrl = await getDownloadURL(snapshot.ref);
      }

      // ✅ Firestore 업데이트
      await updateDoc(doc(db, 'projects', id), {
        title,
        description,
        period,
        techStack,
        portfolioUrl,
        imageUrl: finalImageUrl,
        updatedAt: serverTimestamp(),
      });

      navigate('/admin/projects');
    } catch (err: any) {
      setError('수정 중 오류 발생: ' + err.message);
    }
  };

  if (loading) return <p>불러오는 중...</p>;
  if (error) return <p className={styles.error}>{error}</p>;

  return (
    <div className={styles.projectFormWrap}>
      <h2>✏️ 프로젝트 수정</h2>
      <form onSubmit={handleUpdate}>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder='제목'
          required
        />
        <input
          value={period}
          onChange={(e) => setPeriod(e.target.value)}
          placeholder='기간'
          required
        />
        <input
          value={techStack}
          onChange={(e) => setTechStack(e.target.value)}
          placeholder='기술 스택'
        />
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder='설명'
          required
        />
        <input
          value={portfolioUrl}
          onChange={(e) => setPortfolioUrl(e.target.value)}
          placeholder='포트폴리오 링크 (예: https://example.com)'
        />

        {/* ✅ 이미지 업로드 */}
        <div style={{ margin: '1rem 0' }}>
          {imageUrl && (
            <img
              src={imageUrl}
              alt='기존 썸네일'
              style={{ width: 200, borderRadius: 8, marginBottom: '0.5rem' }}
            />
          )}
          <input
            type='file'
            accept='image/*'
            onChange={(e) => {
              if (e.target.files && e.target.files[0]) {
                setImageFile(e.target.files[0]);
              }
            }}
          />
        </div>

        <button type='submit'>수정 완료</button>
      </form>
    </div>
  );
}
