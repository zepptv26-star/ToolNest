import { useEffect, useRef, useState } from 'react';
import { Download, Upload } from 'lucide-react';
import { baseName, extFor, formatBytes, loadImage, renderToBlob, MAX_PIXELS, type LoadedImage } from '../lib/image.ts';
import { parseNumber } from '../lib/calc/result.ts';
import { ClearButton, ErrorNote, Grid, Note, NumberInput, Results, SelectField, Stat } from '../components/ui';

type OutType = 'same' | 'image/jpeg' | 'image/png' | 'image/webp';

export default function ImageResizer() {
  const [src, setSrc] = useState<LoadedImage | null>(null);
  const [w, setW] = useState(''); const [h, setH] = useState('');
  const [lock, setLock] = useState(true);
  const [out, setOut] = useState<OutType>('same');
  const [quality, setQuality] = useState(90);
  const [result, setResult] = useState<{ url: string; blob: Blob; w: number; h: number } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const resultUrl = useRef<string | null>(null);

  const revokeResult = () => { if (resultUrl.current) { URL.revokeObjectURL(resultUrl.current); resultUrl.current = null; } };
  useEffect(() => () => { revokeResult(); if (src) URL.revokeObjectURL(src.url); }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const onFile = async (file: File | undefined) => {
    if (!file) return;
    setError(null); revokeResult(); setResult(null);
    try {
      const img = await loadImage(file);
      if (src) URL.revokeObjectURL(src.url);
      setSrc(img); setW(String(img.width)); setH(String(img.height));
    } catch (e) { setError(e instanceof Error ? e.message : 'Could not open this image.'); }
  };

  const changeW = (v: string) => {
    setW(v); setResult(null);
    const n = parseNumber(v);
    if (lock && src && n !== null && n > 0) setH(String(Math.max(1, Math.round((n * src.height) / src.width))));
  };
  const changeH = (v: string) => {
    setH(v); setResult(null);
    const n = parseNumber(v);
    if (lock && src && n !== null && n > 0) setW(String(Math.max(1, Math.round((n * src.width) / src.height))));
  };

  const outType = (): string => {
    if (out !== 'same') return out;
    return src && ['image/jpeg', 'image/png', 'image/webp'].includes(src.type) ? src.type : 'image/png';
  };

  const resize = async () => {
    if (!src) return;
    const nw = parseNumber(w), nh = parseNumber(h);
    if (nw === null || nh === null || !Number.isInteger(nw) || !Number.isInteger(nh) || nw < 1 || nh < 1) { setError('Enter whole-number width and height of at least 1 pixel.'); return; }
    if (nw * nh > MAX_PIXELS || nw > 16384 || nh > 16384) { setError('That size is too large to create in the browser. Try a smaller width and height.'); return; }
    setError(null); setBusy(true); revokeResult();
    try {
      const type = outType();
      const blob = await renderToBlob(src.img, nw, nh, type, quality / 100);
      if (blob.type !== type) setError(`Your browser could not create ${type.replace('image/', '').toUpperCase()} files, so a ${blob.type.replace('image/', '').toUpperCase()} file was made instead.`);
      const url = URL.createObjectURL(blob);
      resultUrl.current = url;
      setResult({ url, blob, w: nw, h: nh });
    } catch (e) { setError(e instanceof Error ? e.message : 'Resizing failed.'); }
    finally { setBusy(false); }
  };

  const clear = () => { revokeResult(); if (src) URL.revokeObjectURL(src.url); setSrc(null); setResult(null); setW(''); setH(''); setError(null); };
  const type = outType();

  return (
    <div>
      <label htmlFor="rs-file" className="flex cursor-pointer flex-col items-center gap-2 rounded-xl border-2 border-dashed border-line p-8 text-center hover:border-teal dark:border-slate-600">
        <Upload aria-hidden className="text-teal-dark dark:text-teal" />
        <span className="font-medium">{src ? `Selected: ${src.name}` : 'Choose an image'}</span>
        <span className="text-xs text-muted">JPEG, PNG, WebP, GIF or BMP, up to 25 MB. Stays on your device.</span>
        <input id="rs-file" type="file" accept="image/jpeg,image/png,image/webp,image/gif,image/bmp" className="sr-only" onChange={(e) => { void onFile(e.target.files?.[0]); e.target.value = ''; }} />
      </label>
      <ErrorNote message={error} />

      {src && (
        <div className="mt-6">
          <p className="mb-3 text-sm text-muted">Original: {src.width} × {src.height} px · {formatBytes(src.size)}</p>
          <Grid>
            <NumberInput label="Width" value={w} onChange={changeW} suffix="px" />
            <NumberInput label="Height" value={h} onChange={changeH} suffix="px" />
          </Grid>
          <label className="mt-3 flex items-center gap-2 text-sm"><input type="checkbox" checked={lock} onChange={(e) => setLock(e.target.checked)} className="h-4 w-4 accent-teal" /> Maintain aspect ratio</label>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <SelectField label="Output format" value={out} onChange={(v) => { setOut(v); setResult(null); }}
              options={[{ value: 'same', label: 'Same as original' }, { value: 'image/jpeg', label: 'JPEG' }, { value: 'image/png', label: 'PNG' }, { value: 'image/webp', label: 'WebP' }]} />
            {type !== 'image/png' && (
              <div><label htmlFor="rs-q" className="label">Quality: {quality}%</label><input id="rs-q" type="range" min={10} max={100} value={quality} onChange={(e) => { setQuality(+e.target.value); setResult(null); }} className="w-full accent-teal" /></div>
            )}
          </div>
          <div className="mt-5 flex flex-wrap gap-2">
            <button type="button" className="btn-primary" onClick={() => void resize()} disabled={busy}>{busy ? 'Resizing…' : 'Resize image'}</button>
            <ClearButton onClick={clear} label="Remove image" />
          </div>
        </div>
      )}

      {src && result && (
        <Results>
          <Grid>
            <Stat label="New size" value={`${result.w} × ${result.h} px`} />
            <Stat label="File size" value={formatBytes(result.blob.size)} sub={`Original: ${formatBytes(src.size)}`} />
          </Grid>
          <div className="overflow-auto rounded-lg border border-line bg-[repeating-conic-gradient(#e2e8f0_0%_25%,transparent_0%_50%)] [background-size:16px_16px] p-2 dark:border-slate-700">
            <img src={result.url} alt="Resized preview" className="mx-auto max-h-96 max-w-full" />
          </div>
          <a className="btn-primary" href={result.url} download={`${baseName(src.name)}-${result.w}x${result.h}.${extFor(result.blob.type)}`}><Download size={18} aria-hidden /> Download resized image</a>
        </Results>
      )}
      <Note>Your image is processed entirely in your browser and is never uploaded. Enlarging an image cannot add detail, so it may look soft. JPEG does not support transparency; transparent areas become white.</Note>
    </div>
  );
}
