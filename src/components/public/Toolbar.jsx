export default function Toolbar({ categories, category, onCategoryChange, count, onShare }) {
  const label = count === 1 ? 'Showing 1 item' : `Showing ${count} items`;

  return (
    <div className="toolbar" id="toolbar">
      <div className="toolbar__left">
        <label className="toolbar__select">
          <span className="toolbar__select-label">Choose Category</span>
          <select
            id="category-filter"
            aria-label="Choose category"
            value={category}
            onChange={(e) => onCategoryChange?.(e.target.value)}
          >
            <option value="">All categories</option>
            {categories.map((cat) => (
              <option key={cat._id} value={cat._id}>
                {cat.name}
              </option>
            ))}
          </select>
        </label>
      </div>
      <div className="toolbar__right">
        <span className="toolbar__count" id="item-count">
          {label}
        </span>
        <button className="toolbar__share" type="button" id="share-page" onClick={onShare}>
          <span>Share this page</span>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <circle cx="18" cy="5" r="3" />
            <circle cx="6" cy="12" r="3" />
            <circle cx="18" cy="19" r="3" />
            <path d="M8.6 13.5l6.8 3.9M15.4 6.6L8.6 10.5" />
          </svg>
        </button>
      </div>
    </div>
  );
}
