'use client';

import { useEffect, useRef, useState, type ChangeEvent, type DragEvent } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronDown, ChevronUp, FileText, Mic, Pause, Play, Plus, Square, Trash2, Upload, X } from 'lucide-react';
import { Button, Notice } from '@/components/ui';
import { useApp } from '@/components/providers';
import { SECTIONS, blankEntry, sampleResume, validateResume, type Fields, type FieldDef, type Resume, type Section, type SectionId } from '@/lib/resume';

const inputCls = 'mt-1.5 w-full rounded-md border border-line bg-white px-3 py-2.5 text-[15px] text-ink placeholder:text-muted/70 focus:border-navy focus:outline-none focus:ring-2 focus:ring-navy/20';

function Field({ id, label, value, onChange, multiline, hint }: { id: string; label: string; value: string; onChange: (v: string) => void; multiline?: boolean; hint?: string }) {
  const describe = hint ? `${id}-hint` : undefined;
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-ink">{label}</label>
      {hint && <p id={describe} className="mt-1 text-sm text-muted">{hint}</p>}
      {multiline
        ? <textarea id={id} rows={4} value={value} onChange={(e) => onChange(e.target.value)} aria-describedby={describe} className={inputCls} />
        : <input id={id} value={value} onChange={(e) => onChange(e.target.value)} aria-describedby={describe} className={inputCls} />}
    </div>
  );
}

function FieldGroup({ fields, value, onChange, prefix }: { fields: FieldDef[]; value: Fields; onChange: (v: Fields) => void; prefix: string }) {
  return (
    <div className="grid gap-5 md:grid-cols-2">
      {fields.map(([key, label, multi]) => (
        <div key={key} className={multi ? 'md:col-span-2' : undefined}>
          <Field id={`${prefix}-${key}`} label={label} multiline={multi} value={value[key] ?? ''} onChange={(v) => onChange({ ...value, [key]: v })} />
        </div>
      ))}
    </div>
  );
}

function SectionEditor({ sec, resume, set }: { sec: Section; resume: Resume; set: (id: SectionId, v: unknown) => void }) {
  if (sec.kind === 'text') {
    return <Field id="summary" label="Summary" multiline hint={sec.hint} value={resume.summary} onChange={(v) => set('summary', v)} />;
  }
  if (sec.kind === 'object') {
    return <FieldGroup prefix={sec.id} fields={sec.fields ?? []} value={resume[sec.id] as Fields} onChange={(v) => set(sec.id, v)} />;
  }

  const list = resume[sec.id] as Fields[];
  const update = (next: Fields[]) => set(sec.id, next);
  const move = (i: number, d: number) => {
    const n = [...list];
    [n[i], n[i + d]] = [n[i + d], n[i]];
    update(n);
  };

  return (
    <div className="space-y-5">
      {list.length === 0 && (
        <p className="rounded-md border border-dashed border-line p-6 text-sm text-muted">Nothing here yet. Add an entry to start this section.</p>
      )}
      {list.map((item, i) => (
        <fieldset key={i} className="rounded-md border border-line p-5">
          <legend className="px-1 text-sm text-muted">Entry {i + 1}</legend>
          <FieldGroup prefix={`${sec.id}-${i}`} fields={sec.fields ?? []} value={item} onChange={(v) => update(list.map((x, j) => (j === i ? v : x)))} />
          <div className="mt-5 flex flex-wrap gap-2">
            <Button variant="ghost" aria-label={`Move entry ${i + 1} up`} disabled={i === 0} onClick={() => move(i, -1)}><ChevronUp size={18} />Up</Button>
            <Button variant="ghost" aria-label={`Move entry ${i + 1} down`} disabled={i === list.length - 1} onClick={() => move(i, 1)}><ChevronDown size={18} />Down</Button>
            <Button variant="ghost" aria-label={`Remove entry ${i + 1}`} onClick={() => update(list.filter((_, j) => j !== i))}><Trash2 size={18} />Remove</Button>
          </div>
        </fieldset>
      ))}
      <Button variant="secondary" onClick={() => update([...list, blankEntry(sec.id)])}><Plus size={18} />Add entry</Button>
    </div>
  );
}

export function ManualForm() {
  const { resume, setResume, notify } = useApp();
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [errors, setErrors] = useState<string[]>([]);
  const sec = SECTIONS[step];
  const set = (id: SectionId, value: unknown) => setResume({ ...resume, [id]: value } as Resume);

  const review = () => {
    const errs = validateResume(resume);
    setErrors(errs);
    if (errs.length) {
      setStep(0);
      return;
    }
    router.push('/extension');
  };

  return (
    <div>
      <div className="flex items-center justify-between gap-4 text-sm text-muted">
        <span>Step {step + 1} of {SECTIONS.length}</span>
        <span>{sec.title}</span>
      </div>
      <div className="mt-3 h-1 rounded-full bg-line" aria-hidden="true">
        <div className="h-1 rounded-full bg-navy transition-[width] duration-300" style={{ width: `${((step + 1) / SECTIONS.length) * 100}%` }} />
      </div>

      {errors.length > 0 && (
        <div className="mt-6">
          <Notice tone="error" title="Fix these before reviewing">
            <ul className="list-disc pl-5">{errors.map((e) => <li key={e}>{e}</li>)}</ul>
          </Notice>
        </div>
      )}

      <h2 className="mt-8 font-serif text-2xl text-navy">{sec.title}</h2>
      <div className="mt-6">
        <SectionEditor sec={sec} resume={resume} set={set} />
      </div>

      <div className="mt-10 flex flex-wrap items-center justify-between gap-3 border-t border-line pt-6">
        <Button variant="ghost" onClick={() => setStep((s) => s - 1)} disabled={step === 0}>Back</Button>
        <div className="flex flex-wrap gap-3">
          <Button variant="secondary" onClick={() => notify('Draft kept for this session. Reloading the page clears it.')}>Save Draft</Button>
          {step < SECTIONS.length - 1 && <Button variant="secondary" onClick={() => setStep((s) => s + 1)}>Next</Button>}
          <Button onClick={review}>Review</Button>
        </div>
      </div>
    </div>
  );
}

const SAMPLE_LINES = [
  'I am a final-year computer engineering student focused on AI and machine learning.',
  'I built a course search tool in Python and FastAPI that ranks results by relevance.',
  'My strongest skills are Python, SQL, and PyTorch, and I have used Docker on most projects.',
  'I completed a six-week backend internship where I wrote tests for a payments API.',
];

type Rec = 'idle' | 'recording' | 'paused' | 'stopped';

export function VoiceInput() {
  const { setResume, notify } = useApp();
  const [rec, setRec] = useState<Rec>('idle');
  const [transcript, setTranscript] = useState('');
  const [supported, setSupported] = useState(true);
  const nextLine = useRef(0);
  const textRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (rec !== 'recording') return;
    const id = setInterval(() => {
      const line = SAMPLE_LINES[nextLine.current];
      if (line === undefined) {
        setRec('stopped');
        return;
      }
      nextLine.current += 1;
      setTranscript((t) => (t ? `${t}\n${line}` : line));
    }, 2600);
    return () => clearInterval(id);
  }, [rec]);

  if (!supported) {
    return (
      <div className="space-y-4">
        <Notice tone="warn" title="Voice input is not available in this browser">
          Type your details in the manual form instead, or upload a file.
        </Notice>
        <Button variant="secondary" onClick={() => setSupported(true)}>Show voice controls</Button>
      </div>
    );
  }

  const status: Record<Rec, string> = {
    idle: 'Ready. Your browser asks for microphone access only after you press Start.',
    recording: 'Recording. Pause or stop at any time.',
    paused: 'Paused. Resume when you are ready.',
    stopped: 'Stopped. Review and correct the transcript before using it.',
  };

  return (
    <div className="space-y-8">
      <Notice title="Prototype">
        This screen does not access your microphone. The transcript shows sample text so you can see the flow.
      </Notice>

      <div className="flex flex-wrap items-center gap-6">
        <div className={`flex h-20 w-20 items-center justify-center rounded-full border ${rec === 'recording' ? 'border-navy bg-navy text-white' : 'border-line bg-white text-navy'}`} aria-hidden="true">
          <Mic size={30} />
        </div>
        <p role="status" className="max-w-md text-sm text-ink/80">{status[rec]}</p>
      </div>

      <div className="flex flex-wrap gap-2">
        {rec !== 'recording' && (
          <Button onClick={() => setRec('recording')}><Play size={16} />{rec === 'paused' ? 'Resume' : 'Start Recording'}</Button>
        )}
        {rec === 'recording' && <Button variant="secondary" onClick={() => setRec('paused')}><Pause size={16} />Pause</Button>}
        <Button variant="secondary" disabled={rec === 'idle' || rec === 'stopped'} onClick={() => setRec('stopped')}><Square size={16} />Stop</Button>
        <Button variant="ghost" onClick={() => { setRec('stopped'); textRef.current?.focus(); }}>Review Transcript</Button>
      </div>

      <div>
        <label htmlFor="transcript" className="block text-sm font-medium text-ink">Transcript</label>
        <textarea
          id="transcript"
          ref={textRef}
          rows={8}
          value={transcript}
          onChange={(e) => setTranscript(e.target.value)}
          placeholder="Your transcript appears here while recording. You can edit it before using it."
          className={inputCls}
        />
        <div className="mt-4 flex flex-wrap items-center gap-3">
          <Button disabled={!transcript.trim()} onClick={() => { setResume(sampleResume); notify('Prototype: sample fields replaced your draft.'); }}>Structure transcript</Button>
          <Button variant="ghost" onClick={() => setSupported(false)}>Preview unsupported-browser state</Button>
        </div>
      </div>
    </div>
  );
}

const ACCEPT = ['pdf', 'docx', 'txt'];
const MAX_BYTES = 5 * 1024 * 1024;
const EXTRACT = 'Maya Thornton\nmaya.thornton@example.com | Pune\n\nEducation\nB.Tech. Computer Science, Lakeside Institute of Technology, 2026\n\nProjects\nStudy Planner: scheduling app built with React and PostgreSQL.';

export function FileUpload() {
  const { setResume, notify } = useApp();
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState('');
  const [progress, setProgress] = useState<number | null>(null);
  const [text, setText] = useState('');
  const [jd, setJd] = useState('');
  const [drag, setDrag] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (progress === null) return;
    if (progress >= 100) {
      setText(EXTRACT);
      return;
    }
    const t = setTimeout(() => setProgress((p) => Math.min(100, (p ?? 0) + 20)), 350);
    return () => clearTimeout(t);
  }, [progress]);

  const pick = (f?: File) => {
    if (!f) return;
    const ext = f.name.split('.').pop()?.toLowerCase() ?? '';
    if (!ACCEPT.includes(ext)) return setError(`"${f.name}" is not supported. Upload a PDF, DOCX, or TXT file.`);
    if (f.size === 0) return setError('This file is empty. Choose a different file.');
    if (f.size > MAX_BYTES) return setError('This file is over 5 MB. Choose a smaller file.');
    setError('');
    setFile(f);
    setText('');
    setProgress(0);
  };

  const reset = () => {
    setFile(null);
    setText('');
    setProgress(null);
    setError('');
    if (inputRef.current) inputRef.current.value = '';
  };

  const onDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDrag(false);
    pick(e.dataTransfer.files[0]);
  };

  return (
    <div className="space-y-8">
      <div
        onDragOver={(e) => { e.preventDefault(); setDrag(true); }}
        onDragLeave={() => setDrag(false)}
        onDrop={onDrop}
        className={`rounded-md border border-dashed p-8 text-center transition-colors ${drag ? 'border-navy bg-navy/5' : 'border-line bg-white'}`}
      >
        <Upload className="mx-auto text-navy" size={28} aria-hidden="true" />
        <p className="mt-3 text-ink">Drag a resume here</p>
        <p className="mt-1 text-sm text-muted">PDF, DOCX, or TXT, up to 5 MB</p>
        <Button variant="secondary" className="mt-5" onClick={() => inputRef.current?.click()}>Browse Files</Button>
        <input
          ref={inputRef}
          type="file"
          accept=".pdf,.docx,.txt"
          className="sr-only"
          aria-label="Choose a resume file"
          onChange={(e: ChangeEvent<HTMLInputElement>) => pick(e.target.files?.[0])}
        />
      </div>

      {error && <Notice tone="error">{error}</Notice>}

      {file && (
        <div className="flex flex-wrap items-center justify-between gap-4 rounded-md border border-line bg-white p-4">
          <div className="flex items-center gap-3">
            <FileText className="text-navy" size={20} aria-hidden="true" />
            <div>
              <p className="font-medium text-ink">{file.name}</p>
              <p className="text-sm text-muted">{file.name.split('.').pop()?.toUpperCase()} | {(file.size / 1024).toFixed(0)} KB</p>
            </div>
          </div>
          <Button variant="ghost" onClick={reset}><X size={16} />Remove file</Button>
        </div>
      )}

      {progress !== null && progress < 100 && (
        <div role="status">
          <p className="text-sm text-muted">Extracting text: {progress}%</p>
          <div className="mt-2 h-1 rounded-full bg-line">
            <div className="h-1 rounded-full bg-navy transition-[width] duration-300" style={{ width: `${progress}%` }} />
          </div>
        </div>
      )}

      {progress === 100 && (
        <div className="space-y-4">
          <Notice title="Check the extracted text">
            Fix anything that came through wrong. If this PDF is scanned, the text may be missing and OCR may be needed.
          </Notice>
          <div>
            <label htmlFor="extracted" className="block text-sm font-medium text-ink">Extracted content</label>
            <textarea id="extracted" rows={8} value={text} onChange={(e) => setText(e.target.value)} className={inputCls} />
          </div>
          <Button onClick={() => { setResume(sampleResume); notify('Prototype: extracted fields replaced your draft.'); }}>Use extracted content</Button>
        </div>
      )}

      <div>
        <label htmlFor="jd" className="block text-sm font-medium text-ink">Target job description (optional)</label>
        <p className="mt-1 text-sm text-muted">Paste the posting you are applying for.</p>
        <textarea id="jd" rows={4} value={jd} onChange={(e) => setJd(e.target.value)} className={inputCls} />
      </div>
    </div>
  );
}
