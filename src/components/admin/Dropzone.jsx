import { useRef, useState } from 'react';

export default function Dropzone({
  onFiles,
  accept = 'image/*,video/*,.heic,.heif,.mov,.mkv,.avi,.m4v',
  multiple = true,
  label,
}) {
  const inputRef = useRef(null);
  const [over, setOver] = useState(false);

  const handleFiles = (fileList) => {
    const files = Array.from(fileList || []);
    if (files.length) onFiles?.(files);
  };

  return (
    <div
      className={`dropzone${over ? ' is-over' : ''}`}
      role="button"
      tabIndex={0}
      onClick={() => inputRef.current?.click()}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') inputRef.current?.click();
      }}
      onDragOver={(e) => {
        e.preventDefault();
        setOver(true);
      }}
      onDragLeave={() => setOver(false)}
      onDrop={(e) => {
        e.preventDefault();
        setOver(false);
        handleFiles(e.dataTransfer.files);
      }}
    >
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        multiple={multiple}
        hidden
        onChange={(e) => {
          handleFiles(e.target.files);
          e.target.value = '';
        }}
      />
      {label || 'Drop images or videos here, or click to browse'}
    </div>
  );
}
