import { useEffect, useRef } from 'react';
import GridCard from './GridCard';

/** Match reference PARA masonry rhythm when layout is default "item". */
function resolveLayout(project, index) {
  if (project.layout && project.layout !== 'item') return project.layout;
  if (index % 11 === 0) return 'wide';
  if (index % 7 === 3) return 'tall';
  return 'item';
}

export default function MasonryGrid({ projects, onOpen }) {
  const ref = useRef(null);

  useEffect(() => {
    const root = ref.current;
    if (!root) return undefined;

    const cards = root.querySelectorAll('.grid-card--enter');
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );

    cards.forEach((card, i) => {
      card.style.setProperty('--stagger', `${Math.min(i, 12) * 0.04}s`);
      io.observe(card);
    });
    root.classList.add('is-ready');

    return () => io.disconnect();
  }, [projects]);

  if (!projects.length) {
    return (
      <div className="masonry-grid masonry-grid--live is-ready" ref={ref}>
        <p className="contact-note" style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '3rem 1rem' }}>
          No projects found.
        </p>
      </div>
    );
  }

  return (
    <div className="masonry-grid masonry-grid--live" ref={ref}>
      {projects.map((project, index) => (
        <GridCard
          key={project._id}
          project={project}
          layout={resolveLayout(project, index)}
          onOpen={onOpen}
          index={index}
        />
      ))}
    </div>
  );
}
