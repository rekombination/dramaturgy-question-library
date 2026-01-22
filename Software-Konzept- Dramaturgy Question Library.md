# Software-Konzept: Dramaturgy Question Library

## Übersicht

Ich strukturiere das Konzept in die wesentlichen technischen Komponenten, die für Phase 1 (Launch) benötigt werden, mit Ausblick auf spätere Erweiterungen.

---

## 1. Technologie-Stack (Empfehlung)

### Frontend
- **Next.js 14** (App Router) – Server-Side Rendering für SEO, schnelle initiale Ladezeiten
- **TypeScript** – Typsicherheit, bessere Wartbarkeit
- **Tailwind CSS** – schnelles, konsistentes Styling
- **Radix UI** oder **shadcn/ui** – barrierefreie Komponenten

### Backend
- **Next.js API Routes** oder **separate Node.js/Express API** – je nach Skalierungserwartung
- **PostgreSQL** – relationale Datenbank für komplexe Beziehungen (Fragen, Tags, User, Votes)
- **Prisma** – Type-safe ORM, Migrations

### Authentifizierung
- **NextAuth.js** (Auth.js) – flexibel, unterstützt Magic Links, OAuth (Google, GitHub)
- Später erweiterbar um Organisationen/Teams

### Suche
- **PostgreSQL Full-Text Search** (Phase 1) – ausreichend für Start
- **Meilisearch** oder **Typesense** (später) – für bessere Facetten-Suche, Autocomplete

### Hosting
- **Vercel** (Frontend + API) – einfaches Deployment, Edge-Funktionen
- **Railway** oder **Supabase** (PostgreSQL) – managed Database
- **Cloudflare R2** oder **AWS S3** (später) – für Exports, Uploads

---

## 2. Datenmodell (Core Entities)

```
┌─────────────────────────────────────────────────────────────────┐
│                           USER                                  │
├─────────────────────────────────────────────────────────────────┤
│ id, email, name, avatar_url, role (user|expert|moderator|admin) │
│ created_at, verified_at, bio, expertise_areas[]                 │
└─────────────────────────────────────────────────────────────────┘
           │
           │ 1:n
           ▼
┌─────────────────────────────────────────────────────────────────┐
│                         QUESTION                                │
├─────────────────────────────────────────────────────────────────┤
│ id, author_id, title, body, status (draft|pending|published|    │
│ hidden), context_type (rehearsal|show|touring|funding|team|     │
│ audience), stakes, constraints, tried, sensitivity_note,        │
│ request_expert (boolean), created_at, updated_at,               │
│ vote_count (denormalized)                                       │
└─────────────────────────────────────────────────────────────────┘
           │
           │ n:m                      │ 1:n
           ▼                          ▼
┌─────────────────┐         ┌─────────────────────────────────────┐
│      TAG        │         │              REPLY                  │
├─────────────────┤         ├─────────────────────────────────────┤
│ id, name, slug, │         │ id, question_id, author_id, body,   │
│ description,    │         │ is_expert_perspective (boolean),    │
│ category        │         │ status, created_at, vote_count      │
└─────────────────┘         └─────────────────────────────────────┘
                                       │
                                       │ 1:n
                                       ▼
                            ┌─────────────────────────────────────┐
                            │              VOTE                   │
                            ├─────────────────────────────────────┤
                            │ id, user_id, voteable_type          │
                            │ (question|reply), voteable_id,      │
                            │ type (helpful|insightful)           │
                            └─────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                         BOOKMARK                                │
├─────────────────────────────────────────────────────────────────┤
│ id, user_id, question_id, created_at                            │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                         TOOLKIT                                 │
├─────────────────────────────────────────────────────────────────┤
│ id, title, slug, description, intro_text, is_featured,          │
│ created_by, created_at                                          │
└─────────────────────────────────────────────────────────────────┘
           │
           │ 1:n (ordered)
           ▼
┌─────────────────────────────────────────────────────────────────┐
│                    TOOLKIT_QUESTION                             │
├─────────────────────────────────────────────────────────────────┤
│ toolkit_id, question_id, position, note                         │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                          FLAG                                   │
├─────────────────────────────────────────────────────────────────┤
│ id, reporter_id, flaggable_type, flaggable_id, reason,          │
│ status (pending|resolved|dismissed), resolved_by, resolved_at   │
└─────────────────────────────────────────────────────────────────┘
```

---

## 3. API-Struktur (REST oder tRPC)

### Öffentlich (kein Auth)
```
GET  /api/questions          → Liste mit Pagination, Filter, Suche
GET  /api/questions/:id      → Einzelne Frage mit Replies
GET  /api/tags               → Alle Tags
GET  /api/toolkits           → Kuratierte Toolkits
GET  /api/toolkits/:slug     → Toolkit mit Fragen
```

### Authentifiziert (Closed Area)
```
POST   /api/questions              → Frage einreichen
PATCH  /api/questions/:id          → Eigene Frage bearbeiten
DELETE /api/questions/:id          → Eigene Frage löschen (soft delete)

POST   /api/questions/:id/replies  → Antwort schreiben
PATCH  /api/replies/:id            → Eigene Antwort bearbeiten

POST   /api/questions/:id/vote     → Vote abgeben
DELETE /api/questions/:id/vote     → Vote entfernen

POST   /api/questions/:id/bookmark → Bookmark setzen
DELETE /api/questions/:id/bookmark → Bookmark entfernen

POST   /api/flags                  → Inhalt melden

GET    /api/me/bookmarks           → Eigene Bookmarks
GET    /api/me/questions           → Eigene Fragen
```

### Expert (Role: expert)
```
POST   /api/questions/:id/replies  → mit is_expert_perspective: true
GET    /api/expert/queue           → Fragen mit request_expert: true
```

### Moderation (Role: moderator|admin)
```
GET    /api/moderation/pending     → Fragen/Replies zur Prüfung
PATCH  /api/moderation/questions/:id → Status ändern, editieren
PATCH  /api/moderation/replies/:id   → Status ändern
GET    /api/moderation/flags       → Gemeldete Inhalte
PATCH  /api/moderation/flags/:id   → Flag bearbeiten
POST   /api/moderation/merge       → Duplikate zusammenführen
```

---

## 4. Seitenstruktur (Routes)

```
/                           → Startseite (Mission, Featured, How to use)
/explore                    → Fragenkatalog mit Suche/Filter
/questions/:id              → Frage-Detailseite
/toolkits                   → Toolkit-Übersicht
/toolkits/:slug             → Einzelnes Toolkit
/tags                       → Tag-Übersicht
/tags/:slug                 → Fragen zu einem Tag
/guidelines                 → Community Guidelines

/login                      → Magic Link / OAuth
/signup                     → Registrierung

/submit                     → Frage einreichen (Auth required)
/me                         → Dashboard (Bookmarks, eigene Fragen)
/me/settings                → Profil-Einstellungen

/expert                     → Expert Dashboard (Expert Queue)

/mod                        → Moderations-Dashboard
/mod/pending                → Pending Content
/mod/flags                  → Gemeldete Inhalte
```

---

## 5. Komponenten-Architektur

```
src/
├── app/                          # Next.js App Router
│   ├── (public)/                 # Öffentliche Seiten
│   ├── (auth)/                   # Login, Signup
│   ├── (protected)/              # Auth-required Seiten
│   └── api/                      # API Routes
│
├── components/
│   ├── ui/                       # Basis-Komponenten (Button, Input, Card)
│   ├── question/
│   │   ├── QuestionCard.tsx
│   │   ├── QuestionDetail.tsx
│   │   ├── QuestionForm.tsx
│   │   └── QuestionFilters.tsx
│   ├── reply/
│   │   ├── ReplyList.tsx
│   │   ├── ReplyForm.tsx
│   │   └── ExpertBadge.tsx
│   ├── toolkit/
│   │   ├── ToolkitCard.tsx
│   │   └── ToolkitDetail.tsx
│   ├── layout/
│   │   ├── Header.tsx
│   │   ├── Footer.tsx
│   │   └── Sidebar.tsx
│   └── moderation/
│       ├── ModerationQueue.tsx
│       └── FlagReview.tsx
│
├── lib/
│   ├── db.ts                     # Prisma Client
│   ├── auth.ts                   # NextAuth Config
│   ├── validators.ts             # Zod Schemas
│   └── utils.ts
│
├── hooks/
│   ├── useQuestions.ts
│   ├── useVote.ts
│   └── useBookmark.ts
│
└── types/
    └── index.ts                  # TypeScript Interfaces
```

---

## 6. Sicherheit & Moderation

### Rate Limiting
```typescript
// Beispiel mit Upstash Ratelimit
const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(10, "1 m"), // 10 requests/minute
});
```

### Content Moderation Flow
```
Neuer Inhalt
     │
     ▼
┌────────────────┐
│ User Trust     │
│ Level Check    │
└────────────────┘
     │
     ├── Trusted User ──────► Sofort published
     │
     └── New User ──────────► Status: pending
                                   │
                                   ▼
                            ┌─────────────┐
                            │ Mod Queue   │
                            └─────────────┘
                                   │
                        ┌──────────┼──────────┐
                        ▼          ▼          ▼
                    Approve     Edit      Reject
                        │          │          │
                        ▼          ▼          ▼
                   published   published   hidden
                              + note sent
```

### Trust Levels
```typescript
enum TrustLevel {
  NEW = 0,        // Alle Beiträge werden geprüft
  BASIC = 1,      // Nach 3 approved posts
  TRUSTED = 2,    // Nach 10 approved posts
  EXPERT = 3,     // Manuell vergeben
  MODERATOR = 4,  // Manuell vergeben
}
```

---

## 7. Such- und Filter-Logik

### Filter-Dimensionen
- **Context Type:** rehearsal, show, touring, funding, team, audience
- **Tags:** multiple selection
- **Status:** has_expert_response, needs_expert, recent
- **Sort:** newest, most_helpful, trending

### Suche (PostgreSQL)
```sql
-- Full-text search mit ts_vector
SELECT *
FROM questions
WHERE to_tsvector('english', title || ' ' || body) 
      @@ plainto_tsquery('english', :search_term)
ORDER BY ts_rank(...) DESC;
```

---

## 8. Phase 1 – MVP Feature Set

| Feature | Priorität | Komplexität |
|---------|-----------|-------------|
| Fragenkatalog mit Suche/Filter | Must | Medium |
| Frage-Detailseite | Must | Low |
| User Registration (Magic Link) | Must | Low |
| Frage einreichen (mit Formular) | Must | Medium |
| Replies/Diskussion | Must | Medium |
| Votes (Helpful) | Must | Low |
| Bookmarks | Must | Low |
| Tags | Must | Low |
| Expert Badge + Expert Perspective | Must | Low |
| Basic Moderation Queue | Must | Medium |
| Flag/Report | Must | Low |
| Toolkits (statisch kuratiert) | Should | Low |
| Guidelines Page | Should | Low |

---

## 9. Erweiterungen (Phase 2+)

### Phase 2: Kuration & Stabilität
- Duplicate Detection/Merge UI
- Trending Algorithm
- Tag-Kategorien mit Beschreibungen
- Expert Queue mit Notifications
- Email Digests

### Phase 3: Members Area
- **Workspaces** (neues Datenmodell)
- **Team Invitations**
- **Export als PDF** (react-pdf oder Puppeteer)
- **Stripe Integration** für Subscriptions

---

## 10. Performance & Skalierung

### Caching-Strategie
```
┌─────────────────┐
│   CDN Edge      │ ← Statische Assets, Toolkit-Seiten
└────────┬────────┘
         │
┌────────▼────────┐
│   Redis/Vercel  │ ← Question counts, trending scores
│     KV Cache    │
└────────┬────────┘
         │
┌────────▼────────┐
│   PostgreSQL    │ ← Source of truth
└─────────────────┘
```

### Denormalisierung
- `vote_count` auf Questions/Replies (Update via Trigger oder Application)
- `reply_count` auf Questions
- Materialized Views für Trending/Featured

---

## Zusammenfassung

Das System ist bewusst schlank gehalten für Phase 1, aber strukturell vorbereitet für Wachstum. Die Kernentscheidungen:

1. **Next.js + PostgreSQL** – bewährter Stack, gute Developer Experience
2. **Trust-basierte Moderation** – skaliert besser als alles manuell prüfen
3. **Expert als Rolle, nicht als separates System** – einfache Architektur
4. **Toolkits als kuratierte Collections** – redaktioneller Mehrwert ohne komplexe Features

Soll ich als nächstes detaillierter auf einen Bereich eingehen – etwa das Datenbankschema mit Prisma, die Frage-Formular-Logik, oder das Moderations-Dashboard?