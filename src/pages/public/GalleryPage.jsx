import { useCallback, useEffect, useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import api, { unwrap } from '../../services/api';
import Toolbar from '../../components/public/Toolbar';
import MasonryGrid from '../../components/public/MasonryGrid';
import Lightbox from '../../components/public/Lightbox';

export default function GalleryPage() {
  const { search } = useOutletContext();
  const [projects, setProjects] = useState([]);
  const [categories, setCategories] = useState([]);
  const [category, setCategory] = useState('');
  const [loading, setLoading] = useState(true);
  const [lightboxProject, setLightboxProject] = useState(null);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const params = {};
      if (search?.trim()) params.q = search.trim();
      if (category) params.category = category;
      const [projRes, catRes] = await Promise.all([
        api.get('/projects', { params }),
        api.get('/categories'),
      ]);
      setProjects(unwrap(projRes) || []);
      setCategories(unwrap(catRes) || []);
    } catch {
      setProjects([]);
    } finally {
      setLoading(false);
    }
  }, [search, category]);

  useEffect(() => {
    load();
  }, [load]);

  const onShare = async () => {
    const url = window.location.href;
    try {
      if (navigator.share) {
        await navigator.share({ title: document.title, url });
      } else if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(url);
        alert('Link copied to clipboard');
      }
    } catch {
      /* user cancelled share */
    }
  };

  const openLightbox = (project) => {
    setLightboxProject(project);
    setLightboxIndex(0);
  };

  return (
    <>
      <Toolbar
        categories={categories}
        category={category}
        onCategoryChange={setCategory}
        count={projects.length}
        onShare={onShare}
      />
      {loading ? (
        <p className="contact-note" style={{ textAlign: 'center', padding: '3rem' }}>
          Loading…
        </p>
      ) : (
        <MasonryGrid projects={projects} onOpen={openLightbox} />
      )}
      <Lightbox
        project={lightboxProject}
        index={lightboxIndex}
        onClose={() => setLightboxProject(null)}
        onIndexChange={setLightboxIndex}
      />
    </>
  );
}
