import { useEffect, useRef, useState } from 'react';
import { Download, Upload } from 'lucide-react';
import { baseName, extFor, formatBytes, loadImage, renderToBlob, type LoadedImage } from '../lib/image.ts';
import { ClearButton, ErrorNote, Grid, Note, Results, SelectField, Stat } from '../components/ui';

type Fmt = 'image/jpeg' | 'image/webp' | 'image/png';

export default function ImageCompressor() {
  const [src, setSrc] = useState<LoadedImage | null>(null);
  const [fmt, setFmt] = useState<Fmt>('image/jpeg');
  const [quality, setQuality] = useState(75);
  const [result, setResult] = useState<{ url: string; blob: Blob } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const urlRef = useRef<string | null>(null);
  const runId = useRef(0);

  const revoke = () => { if (urlRef.current) { URL.revokeObjectURL(urlRef.current); urlRef.current = null; } };
  useEffect(() => () => { revoke(); if (src) URL.revokeObjectURL(src.url); }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const onFile = async (file: File | undefined) => {
    if (!file) return;
    setError(null); revoke(); setResult(null);
    try {
      const img = await loadImage(file);
      if (src) URL.revokeObjectURL(src.url);
      setSrc(img);
      setFmt(img.type === 'image/webp' ? 'image/webp' : 'image/jpeg');
    } catch (e) { setError(e instanceof Error ? e.message : 'Could not open this image.'); }
  };

  // Recompress automatically (debounced) when the image, format or quality changes.
  useEffect(() => {
    if (!src) return;
    const id = ++runId.current;
    setBusy(true);
    const t = setTimeout(async () => {
      try {
        const blob = await renderToBlob(src.img, src.width, src.height, fmt, quality / 100);
        if (id !== runId.current) return;
        revoke();
        const url = URL.createObjectURL(blob);
        urlRef.current = url;
        setResult({ url, blob });
        setError(blob.type !== fmt ? `Your browser could not create ${fmt.replace('image/', '').toUpperCase()} files, so a ${blob.type.replace('image/', '').toUpperCase()} file was made instead.` : null);
      } catch (e) {
        if (id === runId.current) setError(e instanceof Error ? e.message : 'Compression failed.');
      } finally { if (id === runId.current) setBusy(false); }
    }, 250);
    return () => clearTimeout(t);
  }, [src, fmt, quality]);

  const clear = () => { runId.current++; revoke(); if (src) URL.revokeObjectURL(src.url); setSrc(null); setResult(null); setError(null); setBusy(false); };
  const saved = src && result ? Math.round((1 - result.blob.size / src.size) * 100) : 0;
  const larger = src && result ? result.blob.size >= src.size : false;

  return (
    <div>
      <label htmlFor="cp-file" className="flex cursor-pointer flex-col items-center gap-2 rounded-xl border-2 border-dashed border-line p-8 text-center hover:border-teal dark:border-slate-600">
        <Upload aria-hidden className="text-teal-dark dark:text-teal" />
        <span className="font-medium">{src ? `Selected: ${src.name}` : 'Choose an image'}</span>
        <span className="text-xs text-muted">JPEG, PNG, WebP, GIF or BMP, up to 25 MB. Stays on your device.</span>
        <input id="cp-file" type="file" accept="image/jpeg,image/png,image/webp,image/gif,image/bmp" className="sr-only" onChange={(e) => { void onFile(e.target.files?.[0]); e.target.value = ''; }} />
      </label>
      <ErrorNote message={error} />

      {src && (
        <>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <SelectField label="Output format" value={fmt} onChange={setFmt}
              options={[{ value: 'image/jpeg', label: 'JPEG (best for photos)' }, { value: 'image/webp', label: 'WebP (smaller files)' }, { value: 'image/png', label: 'PNG (lossless, may not shrink)' }]} />
            {fmt !== 'image/png' ? (
              <div><label htmlFor="cp-q" className="label">Quality: {quality}%</label><input id="cp-q" type="range" min={10} max={100} value={quality} onChange={(e) => setQuality(+e.target.value)} className="w-full accent-teal" /><p className="mt-1 text-xs text-muted">Lower quality means a smaller file.</p></div>
            ) : <p className="self-end text-sm text-muted">PNG is lossless, so quality does not apply. Use JPEG or WebP for smaller files.</p>}
          </div>
          {busy && <p className="mt-4 text-sm text-muted" role="status">Compressing…</p>}
        </>
      )}

      {src && result && !busy && (
        <Results>
          <Grid cols={3}>
            <Stat label="Original size" value={formatBytes(src.size)} />
            <Stat label="Compressed size" value={formatBytes(result.blob.size)} />
            <Stat big label={larger ? 'Size change' : 'You saved'} value={larger ? `+${Math.abs(saved)}%` : `${saved}%`} />
          </Grid>
          {larger && <Note tone="warn">The result is not smaller than the original. This image may already be well compressed. Try a lower quality or a different format.</Note>}
          <Grid>
            <figure><figcaption className="mb-1 text-sm font-medium">Before</figcaption><img src={src.url} alt="Original image" className="max-h-72 w-full rounded-lg border border-line object-contain dark:border-slate-700" /></figure>
            <figure><figcaption className="mb-1 text-sm font-medium">After</figcaption><img src={result.url} alt="Compressed image" className="max-h-72 w-full rounded-lg border border-line object-contain dark:border-slate-700" /></figure>
          </Grid>
          <div className="flex flex-wrap gap-2">
            <a className="btn-primary" href={result.url} download={`${baseName(src.name)}-compressed.${extFor(result.blob.type)}`}><Download size={18} aria-hidden /> Download compressed image</a>
            <ClearButton onClick={clear} label="Remove image" />
          </div>
        </Results>
      )}
      <Note>Your image is processed entirely in your browser and is never uploaded. Converting a PNG with transparency to JPEG replaces transparent areas with white. Animated GIFs are compressed as a single still frame.</Note>
    </div>
  );
}
