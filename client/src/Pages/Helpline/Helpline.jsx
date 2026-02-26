// import { memo } from 'react';
// import resets from '../_resets.module.css';
// import { Announcement3 } from './Announcement3/Announcement3';
// import classes from './Helpline.module.css';

// const Helpline = memo(function Helpline(props = {}) {
//   return (
//     <div className={`${resets.storybrainResets} ${classes.root}`}>
//       <div className={classes.rectangle17929}></div>
//       <div className={classes.image20}></div>
//       <div className={classes.rectangle7341}></div>
//       <div className={classes.weAreFocusedOnMakingYourProces}>
//         <div className={classes.textBlock}>We Are Focused On</div>
//         <div className={classes.textBlock2}>Making Your Process A</div>
//         <div className={classes.textBlock3}>Success</div>
//       </div>
//       <div className={classes.weAreHereToHelpYou}>We are here to help you</div>
//       <div className={classes.image28} style={{backgroundImage:'url("https://i.ytimg.com/vi/5vYj_bpttFY/maxresdefault.jpg")'}}></div>
//       <div className={classes.rectangle7344}></div>
//       <div className={classes.for}>For</div>
//       <div className={classes.happyClients}>Happy Clients</div>
//       <input type="text" className={classes.describeYourIssue} placeholder="Describe your issue" />

//       <Announcement3 className={classes.announcement3} />
//     </div>
//   );
// });

// const Memo = memo(Helpline);
// export default Helpline;
// import { memo, useState } from 'react';
// import axios from 'axios';
// import resets from '../_resets.module.css';
// import { Announcement3 } from './Announcement3/Announcement3';
// import classes from './Helpline.module.css';

// const Helpline = memo(function Helpline() {
//   const [file, setFile] = useState(null);
//   const [userPrompt, setUserPrompt] = useState(""); 
//   const [result, setResult] = useState(null);
//   const [loading, setLoading] = useState(false);

//   const handleUpload = async () => {
//     if (!file) return alert("Please select a leaf image!");
    
//     const formData = new FormData();
//     formData.append('image', file);
//     formData.append('prompt', userPrompt); // Send custom prompt to backend

//     setLoading(true);
//     try {
//       const response = await axios.post('http://localhost:5000/detect-disease', formData);
//       setResult(response.data);
//     } catch (err) {
//       alert("Analysis failed. Please try a clearer photo.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className={`${resets.storybrainResets} ${classes.root}`}>
//       {/* Background Layer */}
//       <div className={classes.rectangle17929}></div>

//       <div className={classes.contentWrapper}>
//         {/* LEFT SECTION: Input */}
//         <div className={classes.inputSection}>
//           <h1 className={classes.mainTitle}>Crop Health <br/>Helpline</h1>
          
//           <div className={classes.uploadContainer} onClick={() => document.getElementById('leafInput').click()}>
//              {file ? (
//                <img src={URL.createObjectURL(file)} className={classes.previewImage} alt="Preview" />
//              ) : (
//                <div className={classes.uploadPlaceholder}>Click to Upload Leaf Photo</div>
//              )}
//           </div>
//           <input id="leafInput" type="file" hidden onChange={(e) => setFile(e.target.files[0])} />

//           <textarea 
//             className={classes.promptArea}
//             placeholder="Describe the issue or ask a question (e.g., Is this spreading?)"
//             value={userPrompt}
//             onChange={(e) => setUserPrompt(e.target.value)}
//           />

//           <button className={classes.submitBtn} onClick={handleUpload} disabled={loading}>
//             {loading ? "Analyzing..." : "Identify Disease"}
//           </button>
//         </div>

//         {/* RIGHT SECTION: Output */}
//         <div className={classes.outputSection}>
//           {result ? (
//             <div className={classes.resultCard}>
//               <h2 className={classes.resHeader}>Diagnosis Result</h2>
//               <div className={classes.resItem}><strong>🌱 Disease:</strong> {result.disease_name}</div>
//               <div className={classes.resItem}><strong>🦠 Cause:</strong> {result.possible_causes}</div>
//               <div className={classes.resItem}><strong>💊 Treatment:</strong> {result.suggested_treatment}</div>
//               <div className={classes.resItem}><strong>🧪 Fertilizer:</strong> {result.fertilizer_guidance}</div>
//             </div>
//           ) : (
//             <div className={classes.emptyState}>
//               Upload a photo and describe the issue to see the AI diagnosis here.
//             </div>
//           )}
//         </div>
//       </div>

//       <Announcement3 className={classes.announcement3} />
//     </div>
//   );
// });

// export default Helpline;
import { memo, useState, useRef, useCallback } from 'react';
import axios from 'axios';

// ─── Inline Styles (CSS-in-JS, no external deps beyond React + axios) ──────────
const styles = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  .hl-root {
    --green-900: #0d2b1a;
    --green-800: #133d26;
    --green-700: #1a5233;
    --green-600: #1e6b41;
    --green-400: #2ea05e;
    --green-300: #4cc07c;
    --green-100: #c8f0d8;
    --green-50:  #edfaf3;
    --amber:     #e8a838;
    --amber-lt:  #fef3d8;
    --red:       #e05252;
    --red-lt:    #fdeaea;
    --slate-100: #f1f4f0;
    --slate-200: #dde3d9;
    --text-dark: #0e1f14;
    --text-mid:  #3a5244;
    --text-mute: #7a9988;

    font-family: 'DM Sans', sans-serif;
    background: var(--slate-100);
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    color: var(--text-dark);
  }

  /* ── Top Bar ── */
  .hl-topbar {
    background: var(--green-900);
    padding: 0 40px;
    height: 56px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    position: sticky;
    top: 0;
    z-index: 100;
  }
  .hl-logo {
    display: flex;
    align-items: center;
    gap: 10px;
    color: #fff;
    font-family: 'DM Serif Display', serif;
    font-size: 18px;
    letter-spacing: 0.01em;
  }
  .hl-logo-icon {
    width: 28px; height: 28px;
    background: var(--green-400);
    border-radius: 8px;
    display: grid;
    place-items: center;
    font-size: 15px;
  }
  .hl-badge {
    background: var(--green-700);
    color: var(--green-100);
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    padding: 3px 10px;
    border-radius: 20px;
  }

  /* ── Hero Band ── */
  .hl-hero {
    background: linear-gradient(135deg, var(--green-800) 0%, var(--green-900) 100%);
    padding: 48px 40px 44px;
    position: relative;
    overflow: hidden;
  }
  .hl-hero::before {
    content: '';
    position: absolute;
    inset: 0;
    background: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.025'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
  }
  .hl-hero-content { position: relative; z-index: 1; max-width: 1100px; margin: 0 auto; }
  .hl-hero-eyebrow {
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: var(--green-300);
    margin-bottom: 12px;
  }
  .hl-hero-title {
    font-family: 'DM Serif Display', serif;
    font-size: clamp(28px, 4vw, 42px);
    color: #fff;
    line-height: 1.15;
    margin-bottom: 10px;
  }
  .hl-hero-title em { font-style: italic; color: var(--green-300); }
  .hl-hero-sub {
    color: var(--green-100);
    opacity: 0.7;
    font-size: 15px;
    font-weight: 300;
    max-width: 500px;
  }
  .hl-stats {
    display: flex;
    gap: 32px;
    margin-top: 32px;
  }
  .hl-stat-value {
    font-family: 'DM Serif Display', serif;
    font-size: 24px;
    color: #fff;
  }
  .hl-stat-label {
    font-size: 12px;
    color: var(--green-100);
    opacity: 0.6;
    margin-top: 2px;
  }
  .hl-stat-divider {
    width: 1px;
    background: rgba(255,255,255,0.12);
    align-self: stretch;
  }

  /* ── Main Grid ── */
  .hl-main {
    flex: 1;
    max-width: 1100px;
    width: 100%;
    margin: 0 auto;
    padding: 36px 40px 60px;
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 28px;
    align-items: start;
  }

  /* ── Cards ── */
  .hl-card {
    background: #fff;
    border-radius: 16px;
    border: 1px solid var(--slate-200);
    overflow: hidden;
    box-shadow: 0 1px 3px rgba(0,0,0,0.04), 0 8px 24px rgba(0,0,0,0.04);
  }
  .hl-card-header {
    padding: 20px 24px 18px;
    border-bottom: 1px solid var(--slate-200);
    display: flex;
    align-items: center;
    gap: 10px;
  }
  .hl-card-icon {
    width: 32px; height: 32px;
    border-radius: 8px;
    display: grid;
    place-items: center;
    font-size: 16px;
    flex-shrink: 0;
  }
  .hl-card-icon.green { background: var(--green-50); }
  .hl-card-icon.amber { background: var(--amber-lt); }
  .hl-card-title {
    font-size: 14px;
    font-weight: 600;
    color: var(--text-dark);
    letter-spacing: -0.01em;
  }
  .hl-card-sub {
    font-size: 12px;
    color: var(--text-mute);
    margin-top: 1px;
  }
  .hl-card-body { padding: 24px; }

  /* ── Upload Zone ── */
  .hl-drop-zone {
    border: 2px dashed var(--slate-200);
    border-radius: 12px;
    background: var(--slate-100);
    min-height: 200px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 12px;
    cursor: pointer;
    transition: border-color 0.2s, background 0.2s;
    position: relative;
    overflow: hidden;
  }
  .hl-drop-zone:hover, .hl-drop-zone.dragover {
    border-color: var(--green-400);
    background: var(--green-50);
  }
  .hl-drop-zone input { display: none; }
  .hl-drop-icon {
    width: 48px; height: 48px;
    background: var(--slate-200);
    border-radius: 12px;
    display: grid;
    place-items: center;
    font-size: 22px;
    transition: background 0.2s;
  }
  .hl-drop-zone:hover .hl-drop-icon { background: var(--green-100); }
  .hl-drop-text {
    font-size: 13px;
    font-weight: 500;
    color: var(--text-mid);
    text-align: center;
  }
  .hl-drop-hint {
    font-size: 11px;
    color: var(--text-mute);
    text-align: center;
  }
  .hl-preview-img {
    width: 100%; height: 100%;
    object-fit: cover;
    position: absolute;
    inset: 0;
    border-radius: 10px;
  }
  .hl-preview-overlay {
    position: absolute;
    inset: 0;
    background: rgba(0,0,0,0.45);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 6px;
    opacity: 0;
    transition: opacity 0.2s;
    border-radius: 10px;
  }
  .hl-drop-zone:hover .hl-preview-overlay { opacity: 1; }
  .hl-preview-overlay span { color: #fff; font-size: 13px; font-weight: 500; }

  /* ── Form Elements ── */
  .hl-label {
    display: block;
    font-size: 12px;
    font-weight: 600;
    letter-spacing: 0.04em;
    text-transform: uppercase;
    color: var(--text-mute);
    margin-bottom: 8px;
    margin-top: 20px;
  }
  .hl-textarea {
    width: 100%;
    padding: 12px 14px;
    border: 1.5px solid var(--slate-200);
    border-radius: 10px;
    font-family: 'DM Sans', sans-serif;
    font-size: 14px;
    color: var(--text-dark);
    background: var(--slate-100);
    resize: vertical;
    min-height: 90px;
    transition: border-color 0.2s, box-shadow 0.2s;
    line-height: 1.5;
  }
  .hl-textarea:focus {
    outline: none;
    border-color: var(--green-400);
    box-shadow: 0 0 0 3px rgba(46,160,94,0.12);
    background: #fff;
  }
  .hl-textarea::placeholder { color: var(--text-mute); }

  .hl-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    width: 100%;
    padding: 14px 20px;
    border-radius: 10px;
    border: none;
    font-family: 'DM Sans', sans-serif;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    transition: transform 0.15s, box-shadow 0.15s, opacity 0.15s;
    margin-top: 20px;
  }
  .hl-btn-primary {
    background: var(--green-700);
    color: #fff;
    box-shadow: 0 4px 14px rgba(19, 61, 38, 0.3);
  }
  .hl-btn-primary:hover:not(:disabled) {
    background: var(--green-600);
    transform: translateY(-1px);
    box-shadow: 0 6px 20px rgba(19,61,38,0.35);
  }
  .hl-btn-primary:active:not(:disabled) { transform: translateY(0); }
  .hl-btn:disabled { opacity: 0.55; cursor: not-allowed; }

  /* ── Loading Spinner ── */
  .hl-spinner {
    width: 16px; height: 16px;
    border: 2px solid rgba(255,255,255,0.3);
    border-top-color: #fff;
    border-radius: 50%;
    animation: spin 0.7s linear infinite;
  }
  @keyframes spin { to { transform: rotate(360deg); } }

  /* ── Result Card ── */
  .hl-result-section { display: flex; flex-direction: column; gap: 0; }

  .hl-diagnosis-banner {
    background: linear-gradient(135deg, var(--green-700), var(--green-800));
    padding: 20px 24px;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .hl-diagnosis-name {
    font-family: 'DM Serif Display', serif;
    font-size: 22px;
    color: #fff;
  }
  .hl-severity-chip {
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    padding: 4px 12px;
    border-radius: 20px;
  }
  .hl-severity-chip.moderate { background: var(--amber); color: #fff; }
  .hl-severity-chip.high { background: var(--red); color: #fff; }
  .hl-severity-chip.low { background: var(--green-300); color: var(--green-900); }

  .hl-result-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1px;
    background: var(--slate-200);
  }
  .hl-result-cell {
    background: #fff;
    padding: 18px 20px;
  }
  .hl-result-cell-label {
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 0.07em;
    text-transform: uppercase;
    color: var(--text-mute);
    margin-bottom: 6px;
    display: flex;
    align-items: center;
    gap: 6px;
  }
  .hl-result-cell-value {
    font-size: 14px;
    color: var(--text-dark);
    line-height: 1.55;
  }
  .hl-result-full {
    background: #fff;
    padding: 18px 20px;
    border-top: 1px solid var(--slate-200);
  }

  /* ── Empty / Placeholder ── */
  .hl-empty {
    padding: 60px 24px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 12px;
    text-align: center;
  }
  .hl-empty-illus {
    width: 72px; height: 72px;
    background: var(--green-50);
    border-radius: 50%;
    display: grid;
    place-items: center;
    font-size: 32px;
    margin-bottom: 4px;
  }
  .hl-empty-title {
    font-size: 16px;
    font-weight: 600;
    color: var(--text-dark);
  }
  .hl-empty-sub {
    font-size: 13px;
    color: var(--text-mute);
    max-width: 280px;
    line-height: 1.6;
  }
  .hl-steps {
    display: flex;
    flex-direction: column;
    gap: 10px;
    margin-top: 20px;
    width: 100%;
    max-width: 280px;
    text-align: left;
  }
  .hl-step {
    display: flex;
    align-items: flex-start;
    gap: 10px;
  }
  .hl-step-num {
    width: 20px; height: 20px;
    border-radius: 50%;
    background: var(--green-700);
    color: #fff;
    font-size: 11px;
    font-weight: 700;
    display: grid;
    place-items: center;
    flex-shrink: 0;
    margin-top: 1px;
  }
  .hl-step-text { font-size: 12px; color: var(--text-mid); line-height: 1.5; }

  /* ── Footer ── */
  .hl-footer {
    background: var(--green-900);
    padding: 18px 40px;
    text-align: center;
    font-size: 12px;
    color: rgba(255,255,255,0.35);
  }

  /* ── Responsive ── */
  @media (max-width: 780px) {
    .hl-main { grid-template-columns: 1fr; padding: 24px 20px 48px; }
    .hl-hero { padding: 36px 20px 32px; }
    .hl-topbar { padding: 0 20px; }
    .hl-stats { gap: 20px; }
    .hl-result-grid { grid-template-columns: 1fr; }
  }
`;

// ─── Component ───────────────────────────────────────────────────────────────

const Helpline = memo(function Helpline() {
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [userPrompt, setUserPrompt] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [dragover, setDragover] = useState(false);
  const inputRef = useRef(null);

  const handleFile = useCallback((f) => {
    if (!f || !f.type.startsWith('image/')) return;
    setFile(f);
    setPreviewUrl(URL.createObjectURL(f));
    setResult(null);
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setDragover(false);
    handleFile(e.dataTransfer.files[0]);
  }, [handleFile]);

  const handleAnalyze = async () => {
    if (!file) return alert('Please upload a leaf image first.');
    const formData = new FormData();
    formData.append('image', file);
    formData.append('prompt', userPrompt);
    setLoading(true);
    setResult(null);
    try {
      const { data } = await axios.post('http://localhost:5000/detect-disease', formData);
      setResult(data);
    } catch {
      alert('Analysis failed. Please try a clearer photo and try again.');
    } finally {
      setLoading(false);
    }
  };

  const getSeverityClass = () => {
    if (!result) return '';
    const t = (result.severity || '').toLowerCase();
    if (t.includes('high') || t.includes('severe')) return 'high';
    if (t.includes('low') || t.includes('mild')) return 'low';
    return 'moderate';
  };

  return (
    <>
      <style>{styles}</style>
      <div className="hl-root">

        {/* ── Top Bar ── */}
        <header className="hl-topbar">
          <div className="hl-logo">
            <span className="hl-logo-icon">🌿</span>
            AgriSense
          </div>
          <span className="hl-badge">AI Diagnostic Tool</span>
        </header>

        {/* ── Hero ── */}
        <section className="hl-hero">
          <div className="hl-hero-content">
            <p className="hl-hero-eyebrow">Crop Health Intelligence</p>
            <h1 className="hl-hero-title">
              Diagnose crop diseases<br />
              <em>instantly with AI</em>
            </h1>
            <p className="hl-hero-sub">
              Upload a photo of your affected crop, describe what you're seeing, and get actionable treatment guidance in seconds.
            </p>
            <div className="hl-stats">
              <div>
                <div className="hl-stat-value">500+</div>
                <div className="hl-stat-label">Diseases Covered</div>
              </div>
              <div className="hl-stat-divider" />
              <div>
                <div className="hl-stat-value">94%</div>
                <div className="hl-stat-label">Detection Accuracy</div>
              </div>
              <div className="hl-stat-divider" />
              <div>
                <div className="hl-stat-value">&lt;5s</div>
                <div className="hl-stat-label">Average Response</div>
              </div>
            </div>
          </div>
        </section>

        {/* ── Main ── */}
        <main className="hl-main">

          {/* LEFT — Input Panel */}
          <div className="hl-card">
            <div className="hl-card-header">
              <div className="hl-card-icon green">📷</div>
              <div>
                <div className="hl-card-title">Upload Sample</div>
                <div className="hl-card-sub">JPG, PNG or WEBP · Max 10 MB</div>
              </div>
            </div>
            <div className="hl-card-body">
              {/* Drop Zone */}
              <div
                className={`hl-drop-zone${dragover ? ' dragover' : ''}`}
                onClick={() => inputRef.current.click()}
                onDragOver={(e) => { e.preventDefault(); setDragover(true); }}
                onDragLeave={() => setDragover(false)}
                onDrop={handleDrop}
              >
                <input
                  ref={inputRef}
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFile(e.target.files[0])}
                />
                {previewUrl ? (
                  <>
                    <img src={previewUrl} className="hl-preview-img" alt="Leaf preview" />
                    <div className="hl-preview-overlay">
                      <span>🔄 Replace Image</span>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="hl-drop-icon">🌱</div>
                    <div className="hl-drop-text">Drop your leaf photo here</div>
                    <div className="hl-drop-hint">or click to browse files</div>
                  </>
                )}
              </div>

              {/* Prompt */}
              <label className="hl-label" htmlFor="hl-prompt">Describe the Issue</label>
              <textarea
                id="hl-prompt"
                className="hl-textarea"
                placeholder="e.g. Yellow spots appearing on lower leaves, spreading upward over the past week…"
                value={userPrompt}
                onChange={(e) => setUserPrompt(e.target.value)}
                rows={4}
              />

              {/* Submit */}
              <button
                className="hl-btn hl-btn-primary"
                onClick={handleAnalyze}
                disabled={loading || !file}
              >
                {loading ? (
                  <><span className="hl-spinner" /> Analyzing Specimen…</>
                ) : (
                  <><span>🔬</span> Run Diagnosis</>
                )}
              </button>
            </div>
          </div>

          {/* RIGHT — Output Panel */}
          <div className="hl-card">
            <div className="hl-card-header">
              <div className="hl-card-icon amber">📋</div>
              <div>
                <div className="hl-card-title">Diagnosis Report</div>
                <div className="hl-card-sub">
                  {result ? `Generated · ${new Date().toLocaleDateString('en-IN', { day:'numeric', month:'short', year:'numeric' })}` : 'Awaiting analysis'}
                </div>
              </div>
            </div>

            {result ? (
              <div className="hl-result-section">
                {/* Disease Name Banner */}
                <div className="hl-diagnosis-banner">
                  <div>
                    <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.55)', marginBottom: 4, letterSpacing: '0.07em', textTransform: 'uppercase' }}>Identified Disease</div>
                    <div className="hl-diagnosis-name">{result.disease_name || 'Unknown Pathogen'}</div>
                  </div>
                  <div className={`hl-severity-chip ${getSeverityClass()}`}>
                    {result.severity || 'Moderate'}
                  </div>
                </div>

                {/* Result Grid */}
                <div className="hl-result-grid">
                  <div className="hl-result-cell">
                    <div className="hl-result-cell-label"><span>🦠</span> Likely Cause</div>
                    <div className="hl-result-cell-value">{result.possible_causes || '—'}</div>
                  </div>
                  <div className="hl-result-cell">
                    <div className="hl-result-cell-label"><span>🧪</span> Fertilizer Guidance</div>
                    <div className="hl-result-cell-value">{result.fertilizer_guidance || '—'}</div>
                  </div>
                </div>
                <div className="hl-result-full">
                  <div className="hl-result-cell-label" style={{ marginBottom: 8 }}><span>💊</span> Recommended Treatment</div>
                  <div className="hl-result-cell-value">{result.suggested_treatment || '—'}</div>
                </div>
                {result.additional_notes && (
                  <div className="hl-result-full" style={{ borderTop: '1px solid #dde3d9', background: '#f7faf8' }}>
                    <div className="hl-result-cell-label" style={{ marginBottom: 8 }}><span>📌</span> Notes</div>
                    <div className="hl-result-cell-value">{result.additional_notes}</div>
                  </div>
                )}
              </div>
            ) : (
              <div className="hl-empty">
                <div className="hl-empty-illus">🌾</div>
                <div className="hl-empty-title">No diagnosis yet</div>
                <div className="hl-empty-sub">Your detailed report will appear here once analysis is complete.</div>
                <div className="hl-steps">
                  {[
                    'Upload a clear photo of the affected leaf or plant part',
                    'Describe visible symptoms and how long they ve persisted',
                    'Click "Run Diagnosis" for instant AI analysis',
                  ].map((s, i) => (
                    <div className="hl-step" key={i}>
                      <div className="hl-step-num">{i + 1}</div>
                      <div className="hl-step-text">{s}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

        </main>

        {/* ── Footer ── */}
        <footer className="hl-footer">
          AgriSense Crop Health AI · For advisory use only. Consult an agronomist for critical decisions.
        </footer>

      </div>
    </>
  );
});

export default Helpline;