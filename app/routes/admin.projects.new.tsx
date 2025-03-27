import { useState } from 'react';
import { useNavigate } from '@remix-run/react';
import { db, storage } from '~/lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';

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

      // 1. 이미지가 있으면 Firebase Storage에 업로드
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
        imageUrl, // 🔥 이미지 URL 추가
        createdAt: serverTimestamp(),
      });
      
      navigate('/admin/projects'); // 등록 후 목록 페이지로 이동
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h1>새 프로젝트 등록</h1>
      <form onSubmit={handleSubmit}>
        <input placeholder="제목" value={title} onChange={(e) => setTitle(e.target.value)} required /><br />
        <input placeholder="기간 (예: 2022.05 ~ 2023.02)" value={period} onChange={(e) => setPeriod(e.target.value)} required /><br />
        <input placeholder="기술 스택 (쉼표로 구분)" value={techStack} onChange={(e) => setTechStack(e.target.value)} /><br />
        <textarea placeholder="설명" value={description} onChange={(e) => setDescription(e.target.value)} required /><br />
        <input type="file" accept="image/*" onChange={handleImageChange} /><br />
        <button type="submit">등록하기</button>
        {error && <p style={{ color: 'red' }}>{error}</p>}
      </form>
    </div>
  );
}
