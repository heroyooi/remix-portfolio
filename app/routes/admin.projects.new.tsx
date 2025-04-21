import { useState } from 'react';
import { useNavigate } from '@remix-run/react';
import { db, storage } from '~/lib/firebase.client';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import styles from '~/styles/admin-project-form.module.scss';

export default function NewProjectPage() {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [period, setPeriod] = useState('');
  const [techStack, setTechStack] = useState('');
  const [error, setError] = useState('');
  const [image, setImage] = useState<File | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      let imageUrl = '';
      if (image) {
        const storageRef = ref(storage, `projects/${Date.now()}_${image.name}`);
        const snapshot = await uploadBytes(storageRef, image);
        imageUrl = await getDownloadURL(snapshot.ref);
      }

      await addDoc(collection(db, 'projects'), {
        title,
        description,
        period,
        techStack,
        imageUrl,
        createdAt: serverTimestamp(),
      });

      navigate('/admin/projects');
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className={styles.projectFormWrap}>
      <h1>🆕 새 프로젝트 등록</h1>
      <form onSubmit={handleSubmit}>
        <input
          placeholder='제목'
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <input
          placeholder='기간 (예: 2022.05 ~ 2023.02)'
          value={period}
          onChange={(e) => setPeriod(e.target.value)}
          required
        />
        <input
          placeholder='기술 스택 (쉼표로 구분)'
          value={techStack}
          onChange={(e) => setTechStack(e.target.value)}
        />
        <textarea
          placeholder='설명'
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />
        <input
          type='file'
          accept='image/*'
          onChange={(e) => {
            if (e.target.files && e.target.files[0])
              setImage(e.target.files[0]);
          }}
        />
        <button type='submit'>등록하기</button>
        {error && <p className={styles.error}>{error}</p>}
      </form>
    </div>
  );
}
