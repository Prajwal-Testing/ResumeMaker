import { PenLine, Mic, FileUp } from 'lucide-react';
import { Header, LinkButton } from '@/components/ui';
import { ScaledResume } from '@/components/resume-document';
import { sampleResume, TEMPLATES } from '@/lib/resume';

const WAYS = [
  { icon: PenLine, title: 'Write manually', body: 'Work through guided sections for education, experience, projects, and skills. Add or reorder entries as you go.' },
  { icon: Mic, title: 'Speak your details', body: 'Talk through your background and correct the transcript before anything is used.' },
  { icon: FileUp, title: 'Start from a file', body: 'Upload a PDF, DOCX, or TXT resume. Review the extracted text, then build from there.' },
];

const STEPS = [
  ['Add your details', 'Use any of the three ways. Your draft stays in this browser session.'],
  ['Review what will be sent', 'You see the structured request before anything leaves ResumeMate.'],
  ['Generate with your Gemini account', 'The extension works with your own signed-in Gemini session. Nothing is sent without your approval.'],
  ['Preview and download', 'Pick a template, check the layout, then download your PDF.'],
];

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <section className="mx-auto grid max-w-6xl items-center gap-12 px-5 py-16 md:grid-cols-[1.1fr_1fr] md:py-24">
          <div>
            <h1 className="font-serif text-4xl leading-tight text-navy md:text-5xl">A better resume starts with your story.</h1>
            <p className="mt-5 max-w-lg text-lg leading-relaxed text-ink/75">
              Write it out, say it aloud, or start from a file you already have. ResumeMate turns those details into a clean resume and shows you what is sent before anything is generated.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <LinkButton href="/create">Create My Resume</LinkButton>
              <LinkButton href="/#templates" variant="secondary">Explore Templates</LinkButton>
            </div>
          </div>
          <div className="hidden justify-center md:flex">
            <ScaledResume resume={sampleResume} template="classic" scale={0.5} />
          </div>
        </section>

        <section id="features" className="border-t border-line bg-white/60">
          <div className="mx-auto max-w-6xl px-5 py-20">
            <h2 className="font-serif text-3xl text-navy">Three ways to start</h2>
            <p className="mt-3 max-w-xl text-muted">Pick whichever fits how you work. Each one produces the same structured resume.</p>
            <div className="mt-12 grid gap-10 md:grid-cols-3">
              {WAYS.map((w) => (
                <div key={w.title}>
                  <w.icon className="text-navy" size={24} aria-hidden="true" />
                  <h3 className="mt-4 font-semibold text-ink">{w.title}</h3>
                  <p className="mt-2 leading-relaxed text-ink/75">{w.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="how-it-works" className="mx-auto max-w-6xl px-5 py-20">
          <h2 className="font-serif text-3xl text-navy">How it works</h2>
          <ol className="mt-10 grid gap-8 md:grid-cols-2">
            {STEPS.map(([title, body], i) => (
              <li key={title} className="flex gap-5 border-t border-line pt-5">
                <span className="font-serif text-2xl text-navy">{i + 1}</span>
                <div>
                  <h3 className="font-semibold text-ink">{title}</h3>
                  <p className="mt-1 leading-relaxed text-ink/75">{body}</p>
                </div>
              </li>
            ))}
          </ol>
        </section>

        <section id="templates" className="border-t border-line bg-white/60">
          <div className="mx-auto max-w-6xl px-5 py-20">
            <h2 className="font-serif text-3xl text-navy">Templates</h2>
            <p className="mt-3 max-w-xl text-muted">Four layouts, each built for clear reading by people and applicant tracking systems.</p>
            <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {TEMPLATES.map((t) => (
                <figure key={t.id}>
                  <ScaledResume resume={sampleResume} template={t.id} scale={0.28} />
                  <figcaption className="mt-4">
                    <p className="font-medium text-ink">{t.name}</p>
                    <p className="mt-1 text-sm text-muted">{t.note}</p>
                  </figcaption>
                </figure>
              ))}
            </div>
          </div>
        </section>
      </main>
      <footer className="border-t border-line">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-5 py-8 text-sm text-muted">
          <p className="font-serif text-base text-navy">ResumeMate</p>
          <p>Frontend prototype. Resume generation and PDF export are not connected yet.</p>
        </div>
      </footer>
    </>
  );
}
