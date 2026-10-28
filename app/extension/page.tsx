'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { CircleAlert, CircleCheck, Puzzle, Unplug } from 'lucide-react';
import { Header, Button, LinkButton, Notice } from '@/components/ui';
import { useApp } from '@/components/providers';

type Conn = 'not-installed' | 'connected' | 'disconnected';

const COPY: Record<Conn, { label: string; title: string; body: string }> = {
  'not-installed': {
    label: 'Not Installed',
    title: 'ResumeMate Extension Required',
    body: 'Install the extension to enable your preferred Gemini workflow.',
  },
  connected: {
    label: 'Connected',
    title: 'Extension connected',
    body: 'ResumeMate can send a request to your Gemini session. You approve each request before anything is sent.',
  },
  disconnected: {
    label: 'Disconnected',
    title: 'Extension disconnected',
    body: 'Reconnect so ResumeMate can reach the extension. Your draft is still here.',
  },
};

const ICON: Record<Conn, typeof Puzzle> = { 'not-installed': Puzzle, connected: CircleCheck, disconnected: Unplug };

export default function ExtensionPage() {
  const { notify } = useApp();
  const router = useRouter();
  const [conn, setConn] = useState<Conn>('not-installed');
  const Icon = ICON[conn];

  return (
    <>
      <Header />
      <main className="mx-auto max-w-2xl px-5 py-12">
        <h1 className="font-serif text-3xl text-navy">Connect your Gemini workflow</h1>
        <p className="mt-2 text-muted">
          ResumeMate uses a Chrome extension to work with your own signed-in Gemini session. Nothing is sent until you approve it.
        </p>

        <section aria-labelledby="ext-status" className="mt-8 rounded-lg border border-line bg-white p-6">
          <div className="flex items-start gap-4">
            <Icon size={24} className="mt-0.5 shrink-0 text-navy" aria-hidden="true" />
            <div className="flex-1">
              <p className="text-sm text-muted">Status: {COPY[conn].label}</p>
              <h2 id="ext-status" className="mt-1 text-lg font-semibold text-ink">{COPY[conn].title}</h2>
              <p className="mt-1 leading-relaxed text-ink/80">{COPY[conn].body}</p>

              <div className="mt-6 flex flex-wrap gap-3">
                {conn === 'not-installed' && (
                  <>
                    <Button onClick={() => notify('The install link is not configured in this prototype.')}>Install Extension</Button>
                    <Button variant="secondary" onClick={() => notify('Prototype: no extension detected. Use the switch below to preview the connected state.')}>Check Again</Button>
                  </>
                )}
                {conn === 'connected' && (
                  <Button onClick={() => router.push('/generate')}>Generate resume</Button>
                )}
                {conn === 'disconnected' && (
                  <Button onClick={() => { setConn('connected'); notify('Prototype: reconnected.'); }}>Reconnect</Button>
                )}
                <Button variant="ghost" onClick={() => router.push('/create')}>Continue Editing</Button>
              </div>
            </div>
          </div>
        </section>

        <div className="mt-8">
          <Notice title="Prototype states">
            <p>This screen shows simulated connection states. It does not detect a real extension.</p>
            <div role="group" aria-label="Prototype connection state" className="mt-3 flex flex-wrap gap-2">
              {(Object.keys(COPY) as Conn[]).map((c) => (
                <Button key={c} variant="secondary" aria-pressed={conn === c} className={conn === c ? 'border-navy text-navy' : ''} onClick={() => setConn(c)}>
                  {COPY[c].label}
                </Button>
              ))}
            </div>
          </Notice>
        </div>

        {conn === 'not-installed' && (
          <p className="mt-6 flex items-start gap-2 text-sm text-muted">
            <CircleAlert size={16} className="mt-0.5 shrink-0" aria-hidden="true" />
            Your resume information is sent to Gemini only after you approve the request.
          </p>
        )}
        <div className="mt-8"><LinkButton href="/create" variant="ghost">Back to the workspace</LinkButton></div>
      </main>
    </>
  );
}
