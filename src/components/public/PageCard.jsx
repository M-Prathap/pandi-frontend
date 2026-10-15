export default function PageCard({ title, lead, bodyHtml, wide, children }) {
  return (
    <div className="page-wrapper">
      <article className={`page-card page-enter${wide ? ' page-card--wide' : ''}`}>
        <div className="page-card__header">
          <span className="page-card__eyebrow">Studio Origin</span>
          {title && <h1 className="page-card__title">{title}</h1>}
          {lead && <p className="page-card__lead">{lead}</p>}
        </div>

        {bodyHtml ? (
          <div className="page-card__body" dangerouslySetInnerHTML={{ __html: bodyHtml }} />
        ) : null}

        {children}
      </article>
    </div>
  );
}
