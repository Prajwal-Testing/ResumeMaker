# ResumeMate frontend (UI prototype)

Frontend-only phase. Uses local state and sample data. No backend, Gemini, extension messaging, auth, database, or PDF generation is connected.

## Run locally

    npm install
    npm run dev

Open http://localhost:3000.

## Pages

- `/` landing page
- `/create` workspace: manual form, voice prototype, file upload prototype
- `/extension` connection status with simulated states
- `/generate` simulated progress screen
- `/preview` A4 preview with four templates

## Notes

- Voice transcript and file extraction are simulated. The app does not access the microphone or read uploaded files beyond checking type, size, and name.
- Save Draft and all edits live in memory. Reloading the page clears them.
- Download PDF is a demo action and creates no file.
- Sample data is fictional.
