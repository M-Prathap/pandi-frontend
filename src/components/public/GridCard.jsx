import { Link } from 'react-router-dom';
import { mediaUrl } from '../../utils/mediaUrl';

function imageCount(project) {
  const imgs = project.images || [];
  return imgs.length || (project.thumbnail ? 1 : 0);
}

function isVideoMedia(project) {
  const first = project.images?.[0];
  if (first?.type === 'video') return true;
  const url = first?.url || project.thumbnail || '';
  return /\.(mp4|webm|mov|m4v|avi|mkv|ogv|ogg|3gp)(\?|$)/i.test(url);
}

export default function GridCard({ project, onOpen, index = 0, layout: layoutProp }) {
  const layout = layoutProp || project.layout || 'item';
  const thumb = mediaUrl(project.thumbnail || project.images?.[0]?.url);
  const count = imageCount(project);
  const categoryName = project.category?.name || '';
  const video = isVideoMedia(project);

  return (
    <button
      type="button"
      className={`grid-card grid-card--${layout} grid-card--enter`}
      style={{ '--stagger': `${Math.min(index, 12) * 0.04}s` }}
      onClick={() => onOpen?.(project)}
      aria-label={`Open ${project.title}`}
    >
      <div className="grid-card__media">
        {thumb ? (
          video ? (
            <video
              className="grid-card__video-preview"
              src={thumb}
              muted
              playsInline
              preload="metadata"
            />
          ) : (
            <img src={thumb} alt="" loading="lazy" decoding="async" />
          )
        ) : (
          <div className="grid-card__placeholder" />
        )}
        <span className="grid-card__view" aria-hidden="true">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
            <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7S1 12 1 12z" />
            <circle cx="12" cy="12" r="3" />
          </svg>
        </span>
        {count > 1 && (
          <span className="grid-card__count">
            {count} {count === 1 ? 'image' : 'images'}
          </span>
        )}
        <span className="grid-card__shine" aria-hidden="true" />
      </div>
      <div className="grid-card__overlay">
        <span className="grid-card__title">{project.title}</span>
        <span className="grid-card__meta">
          {project.client || categoryName}
          {count > 0 && (
            <span className="grid-card__stat">
              {count} {count === 1 ? 'image' : 'images'}
            </span>
          )}
        </span>
      </div>
    </button>
  );
}

export function GridCardLink({ project }) {
  return (
    <Link to={`/project/${project._id}`} className="grid-card__stage-link sr-only">
      Open case study
    </Link>
  );
}
