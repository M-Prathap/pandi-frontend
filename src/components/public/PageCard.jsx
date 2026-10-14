export default function PageCard({ title, lead, bodyHtml, wide, children }) {
  return (
    <article className={`page-card page-enter${wide ? ' page-card--wide' : ''}`}>
      {title && <h1>{title}</h1>}
      {lead && <p className="page-card__lead">{lead}</p>}
      {bodyHtml ? (
        <div className="page-card__body" dangerouslySetInnerHTML={{ __html: bodyHtml }} />
      ) : null}
      {children}
    </article>
  );
}
