import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { mediaUrl } from '../../utils/mediaUrl';

function collectSlides(project) {
  const images = [...(project.images || [])].sort((a, b) => (a.order || 0) - (b.order || 0));
  if (images.length) {
    return images.map((img) => ({ url: mediaUrl(img.url), type: img.type || 'image' }));
  }
  if (project.thumbnail) return [{ url: mediaUrl(project.thumbnail), type: 'image' }];
  return [];
}

export default function StageView({ project }) {
  const slides = useMemo(() => collectSlides(project), [project]);
  const [index, setIndex] = useState(0);
  const safeIndex = slides.length ? index % slides.length : 0;
  const tags = [
    ...(project.tags || []),
    ...(project.tools || []),
    project.category?.name,
  ].filter(Boolean);

  const go = (dir) => {
    if (!slides.length) return;
    setIndex((i) => (i + dir + slides.length) % slides.length);
  };

  return (
    <article className="stage">
      <div className="stage__top">
        <div className="stage__tags">
          {tags.map((tag) => (
            <span key={tag} className="stage-tag">
              {tag}
            </span>
          ))}
        </div>
        <div className="stage__stats">
          {project.client && <span className="stage-stat">{project.client}</span>}
          {slides.length > 1 && (
            <button type="button" className="stage-stat stage-stat--btn" onClick={() => go(1)}>
              {safeIndex + 1} / {slides.length}
            </button>
          )}
          {project.projectUrl && (
            <a className="stage-stat stage-stat--btn" href={project.projectUrl} target="_blank" rel="noreferrer">
              Visit project
            </a>
          )}
        </div>
      </div>

      {slides.length > 0 && (
        <div className="carousel">
          <div className="carousel__viewport">
            <div
              className="carousel__track"
              style={{ transform: `translateX(-${safeIndex * 100}%)` }}
            >
              {slides.map((slide, i) => (
                <div className="carousel-slide" key={`${slide.url}-${i}`}>
                  {slide.type === 'video' ? (
                    <video src={slide.url} controls playsInline />
                  ) : (
                    <img src={slide.url} alt={project.title || ''} decoding="sync" loading="eager" />
                  )}
                </div>
              ))}
            </div>
          </div>
          {slides.length > 1 && (
            <>
              <button type="button" className="carousel__nav carousel__nav--prev" onClick={() => go(-1)} aria-label="Previous">
                ‹
              </button>
              <button type="button" className="carousel__nav carousel__nav--next" onClick={() => go(1)} aria-label="Next">
                ›
              </button>
              <div className="carousel__dots">
                {slides.map((_, i) => (
                  <button
                    key={i}
                    type="button"
                    className={i === safeIndex ? 'is-active' : ''}
                    onClick={() => setIndex(i)}
                    aria-label={`Slide ${i + 1}`}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      )}

      <div className="stage__body">
        <h1 className="stage__title">{project.title}</h1>
        <div className="stage__copy">
          {(project.description || '')
            .split(/\n+/)
            .filter(Boolean)
            .map((para) => (
              <p key={para.slice(0, 40)}>{para}</p>
            ))}
        </div>

        {project.videoUrl && (
          <div className="stage-video">
            {/youtube|vimeo/i.test(project.videoUrl) ? (
              <iframe src={project.videoUrl} title={project.title} allowFullScreen />
            ) : (
              <video src={project.videoUrl} controls playsInline />
            )}
          </div>
        )}

        <Link className="stage__back" to="/">
          ← Back to gallery
        </Link>
      </div>
    </article>
  );
}
