# Australia Study Quiz

A web app for practising Australian citizenship test questions. Users work through
topic-based quizzes, get instant feedback, and track their progress across sessions.

**Live:** https://australia-study-quiz.vercel.app/

## Stack

- **Next.js** (App Router) with **TypeScript**
- **Firebase** for auth and **Firestore** for question data and user progress
- **Tailwind CSS** for styling
- Deployed on **Vercel** with automated builds on push to `main`

## Features

- Topic-based quiz selection with an onboarding intro flow
- Instant per-question feedback and end-of-quiz scoring
- Progress persistence via Firestore
- Responsive layout for mobile and desktop

## About

Built as a capstone project for ICT30017 at Swinburne University of Technology
with a five-person Agile team across three sprints. My contributions covered
the intro flow, quiz pages, Firestore setup, repository management, and
resolving TypeScript and Vercel deployment issues.

## Running locally

```bash
npm install
npm run dev
```

Requires a `.env.local` with your Firebase config keys.
