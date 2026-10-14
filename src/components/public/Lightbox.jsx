import { useEffect, useMemo, useCallback, useRef } from 'react';
import { mediaUrl } from '../../utils/mediaUrl';

function collectSlides(project) {
  if (!project) return [];
  const images = [...(project.images || [])].sort((a, b) => (a.order || 0) - (b.order || 0));
  if (images.length) {
    return images.map((img, i) => {
      const url = mediaUrl(img.url);
      const looksVideo =
        img.type === 'video' || /\.(mp4|webm|mov|m4v|avi|mkv|ogv|ogg|3gp)(\?|$)/i.test(img.url || '');
      return {
        url,
        type: looksVideo ? 'video' : img.type || 'image',
        key: `${project._id}-${i}`,
      };
    });
  }
  if (project.thumbnail) {
    const looksVideo = /\.(mp4|webm|mov|m4v|avi|mkv|ogv|ogg|3gp)(\?|$)/i.test(project.thumbnail);
    return [
      {
        url: mediaUrl(project.thumbnail),
        type: looksVideo ? 'video' : 'image',
        key: `${project._id}-thumb`,
      },
    ];
  }
  if (project.videoUrl) {
    return [{ url: project.videoUrl, type: 'video', key: `${project._id}-video` }];
  }
  return [];
}

function isEmbed(url) {
  return /youtube\.com|youtu\.be|vimeo\.com/i.test(url || '');
}

export default function Lightbox({ project, index, onClose, onIndexChange }) {
  const slides = useMemo(() => collectSlides(project), [project]);
  const open = Boolean(project);
  const safeIndex = slides.length ? ((index % slides.length) + slides.length) % slides.length : 0;
  const current = slides[safeIndex];
  const viewportRef = useRef(null);

  const go = useCallback(
    (dir) => {
      if (!slides.length) return;
      onIndexChange?.((safeIndex + dir + slides.length) % slides.length);
    },
    [slides.length, safeIndex, onIndexChange]
  );

  useEffect(() => {
    if (!open) {
      document.body.classList.remove('lightbox-open');
      return undefined;
    }
    document.body.classList.add('lightbox-open');
    const onKey = (e) => {
      if (e.key === 'Escape') onClose?.();
      if (e.key === 'ArrowLeft') go(-1);
      if (e.key === 'ArrowRight') go(1);
    };
    document.addEventListener('keydown', onKey);
    return () => {
      document.body.classList.remove('lightbox-open');
      document.removeEventListener('keydown', onKey);
    };
  }, [open, onClose, go]);

  useEffect(() => {
    const el = viewportRef.current;
    if (el) el.scrollTop = 0;
  }, [open, safeIndex, current?.url]);

  if (!open) {
    return (
      <div className="lightbox" id="gallery-lightbox" role="dialog" aria-modal="true" aria-hidden="true" hidden />
    );
  }

  return (
    <div
      className="lightbox is-open"
      id="gallery-lightbox"
      role="dialog"
      aria-modal="true"
      aria-label="Project gallery"
      aria-hidden="false"
    >
      <div className="lightbox__backdrop" aria-hidden="true" onClick={onClose} />
      <div className="lightbox__shell">
        <header className="lightbox__header">
          <div className="lightbox__meta">
            <h2 className="lightbox__title">{project.title}</h2>
            <p className="lightbox__client">{project.client || project.category?.name || ''}</p>
          </div>
          <div className="lightbox__tools">
            <span className="lightbox__counter" aria-live="polite">
              {slides.length ? `${safeIndex + 1} / ${slides.length}` : '0 / 0'}
            </span>
            <button className="lightbox__close" type="button" aria-label="Close gallery" onClick={onClose}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <path d="M6 6l12 12M18 6L6 18" />
              </svg>
            </button>
          </div>
        </header>

        <div className="lightbox__body">
          <div className="lightbox__stage">
            <div className="lightbox__viewport" id="lightbox-viewport" ref={viewportRef}>
              <div className="lightbox__viewport-inner">
                {current && (
                  <figure className="lightbox__figure is-active">
                    {current.type === 'video' || isEmbed(current.url) ? (
                      isEmbed(current.url) ? (
                        <iframe
                          className="lightbox__video-iframe"
                          src={current.url}
                          title={project.title}
                          allow="autoplay; fullscreen"
                          allowFullScreen
                        />
                      ) : (
                        <video className="lightbox__video" src={current.url} controls playsInline />
                      )
                    ) : (
                      <img
                        className="lightbox__image"
                        src={current.url}
                        alt={project.title || ''}
                        decoding="sync"
                        loading="eager"
                        fetchPriority="high"
                      />
                    )}
                  </figure>
                )}
              </div>
            </div>
            {slides.length > 1 && (
              <>
                <button className="lightbox__nav lightbox__prev" type="button" aria-label="Previous image" onClick={() => go(-1)}>
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                    <path d="M14 6l-6 6 6 6" />
                  </svg>
                </button>
                <button className="lightbox__nav lightbox__next" type="button" aria-label="Next image" onClick={() => go(1)}>
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                    <path d="M10 6l6 6-6 6" />
                  </svg>
                </button>
              </>
            )}
          </div>

          <div className="lightbox__filmstrip-wrap">
            <div className="lightbox__filmstrip" role="tablist" aria-label="Project images">
              {slides.map((slide, i) => (
                <button
                  key={slide.key}
                  type="button"
                  role="tab"
                  aria-selected={i === safeIndex}
                  className={`lightbox__thumb${i === safeIndex ? ' is-active' : ''}${slide.type === 'video' ? ' lightbox__thumb--video' : ''}`}
                  onClick={() => onIndexChange?.(i)}
                >
                  {slide.type === 'video' ? (
                    <span className="lightbox__thumb-label">▶</span>
                  ) : (
                    <img src={slide.url} alt="" />
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
