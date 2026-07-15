# Emily — Chapter 30

A private, mobile-first birthday landing page for Emily's 30th birthday on 16 July 2026.

## Stack

- React
- TypeScript
- Vite
- Plain CSS, no UI framework

## Run locally

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

## Add personal media

Place the files below in `public/`:

- `public/photos/hero.jpg`
- `public/photos/memory-01.jpg`
- `public/photos/memory-02.jpg`
- `public/photos/memory-03.jpg`
- `public/photos/memory-04.jpg`
- `public/video/message.mp4`

The current version intentionally displays elegant placeholders until the personal files are added.

## Edit the writing

Most repeatable content is stored in `src/data.ts`:

- Emily's profile traits
- Her eras
- Evidence cards
- Thirty reasons

The hero, video copy and final promise are in `src/App.tsx`.

## Privacy recommendation

Deploy the final page as a private or unlisted Vercel project. Do not commit personal photos or videos to a public GitHub repository unless both people are comfortable with that.
