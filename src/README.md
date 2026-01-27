The purpose of this project is to hone the following skills:
- TypeScript + React (frontend)
- Node.js (backend)
- OAuth (Spotify login = real auth experience)
- Data modeling (users, artists, snapshots, sessions)
- Pipelines (scheduled sync, enrichment jobs)
- CI/CD (GitHub Actions build/test/deploy)
- Docker (you containerize backend + frontend)
- Azure deployment (Container Apps/App Service + Postgres)
- Observability (App Insights + structured logs)


It needs the following before being shipped for my Resume:
- Deployed on Azure (public URL)
- CI/CD (GitHub Actions) running tests + build
- Observability (logs/metrics/healthcheck; App Insights)
- Docs (README + runbook + architecture diagram)
- Issues/roadmap (GitHub issues showing planned work)
- Versioned releases (tags/releases)
- Ideally: some real users (even a handful of friends), or at least “multi-tenant support”

The base app will need to contain the following:
- Spotify OAuth login
- Pull top artists/tracks + recently played
- Store snapshots in DB
- “Mini Wrapped” dashboard:
- top artists/tracks by time window
- “on repeat”
- time-of-day chart
- Background sync job + job status page
- Docker compose local dev
- GitHub Actions CI
- Deployed on Azure + healthcheck endpoint

Tech points to fill in gaps and skills needed in my resume:
- Frontend: React + TypeScript
- Backend: Node.js + TypeScript (Express or Fastify)
- DB: Postgres (or MySQL if you prefer) + migrations
- Jobs/Queue: Redis + BullMQ (or a simple cron worker to start)
- CI/CD: GitHub Actions
- Containers: Docker + Docker Compose
- Azure deploy: Azure Container Apps (simple, modern) + Azure Database for Postgres + Azure Cache for Redis
- Observability: Application Insights + structured logs