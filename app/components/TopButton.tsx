import { useEffect, useState } from 'react';
import styles from './TopButton.module.scss';

export default function TopButton() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setVisible(window.scrollY > 200);
    };
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <button
      className={`${styles.topButton} ${visible ? styles.show : ''}`}
      onClick={scrollToTop}
      aria-label='맨 위로 이동'
    >
      ↑
    </button>
  );
}
