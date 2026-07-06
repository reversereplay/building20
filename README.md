# Building 20

**Live:** [building20.vercel.app](https://building20.vercel.app) · [reversereplay.github.io/building20](https://reversereplay.github.io/building20/)

A social network for builders, named after MIT's legendary "magical incubator" —
the temporary plywood building where radar, Chomsky's linguistics, and Bose all
collided in the same corridors.

Post ideas, build logs, asks, and demos. Earn prototypes, not likes.
Followers are vanity; forks are love.

## Stack

- React 18 + Vite
- Tailwind CSS v4 (`@tailwindcss/vite`)
- Fonts: Space Grotesk, IBM Plex Sans, IBM Plex Mono

## Develop

```sh
npm install
npm run dev     # http://localhost:5184
```

## Build

```sh
npm run build   # outputs to dist/
```

Pushes to `main` deploy automatically to both Vercel (git integration)
and GitHub Pages (`.github/workflows/deploy.yml`).

---

*The original Building 20 was demolished in 1998. The collisions continue.*
