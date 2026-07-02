import { useState, useRef } from 'react';

export default function Uploader({ onUploadSuccess }) {
  const [uploading, setUploading] = useState(false);
  const [error,     setError]     = useState(null);
  const [drag,      setDrag]      = useState(false);
  const inputRef = useRef(null);

  const cloudName    = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
  const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

  const doUpload = async (file) => {
    if (!file) return;

    if (!cloudName || cloudName.includes('your_')) {
      setError('⚠  Add your Cloudinary credentials in .env to enable uploads.');
      return;
    }

    setUploading(true); setError(null);
    const fd = new FormData();
    fd.append('file', file);
    fd.append('upload_preset', uploadPreset);

    try {
      const res  = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, { method:'POST', body:fd });
      const data = await res.json();
      res.ok ? onUploadSuccess(data) : setError(data.error?.message || 'Upload failed.');
    } catch {
      setError('Network error. Check your connection.');
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = '';
    }
  };

  return (
    <section className="upload-section" id="upload">
      <div className="upload-inner">
        <div className="sec-header reveal">
          <div>
            <p className="sec-label">Add to Archive</p>
            <h2 className="sec-title">Upload New <em>Work</em></h2>
          </div>
        </div>

        <div
          className={`drop-zone${drag ? ' drag-over' : ''}`}
          onDragOver={(e) => { e.preventDefault(); setDrag(true); }}
          onDragLeave={() => setDrag(false)}
          onDrop={(e) => { e.preventDefault(); setDrag(false); doUpload(e.dataTransfer.files[0]); }}
        >
          <div className="drop-icon">
            {uploading ? <span className="spinner" /> : '✦'}
          </div>

          <h3 className="drop-title">
            {uploading ? 'Uploading to Cloudinary…' : 'Drop artwork here'}
          </h3>
          <p className="drop-sub">
            {uploading ? 'Please wait' : 'JPG, PNG, WebP, GIF · or click to browse'}
          </p>

          {!uploading && (
            <label className="upload-btn">
              Browse Files
              <input ref={inputRef} type="file" accept="image/*"
                     onChange={(e) => doUpload(e.target.files[0])} />
            </label>
          )}

          {error && <p className="error-msg">{error}</p>}
        </div>
      </div>
    </section>
  );
}
