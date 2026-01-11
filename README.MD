# Links Dashboard

Application de gestion de liens avec dashboard, authentification et panel admin.

## Stack Technique

- **Frontend**: React + TypeScript + Vite + TailwindCSS + DaisyUI
- **Backend**: Node.js + Express + TypeScript + Prisma
- **Base de données**: MySQL 8.0
- **Containerisation**: Docker + Docker Compose

## Fonctionnalités

- Authentification (inscription/connexion) avec JWT
- Gestion des liens (CRUD)
- Catégories avec couleurs personnalisées
- Favoris
- Compteur de clics
- Recherche et filtrage
- Theme switcher (32 thèmes DaisyUI)
- Panel admin avec statistiques
- Gestion des utilisateurs (admin)

## Démarrage rapide

### Avec Docker (recommandé)

```bash
# Cloner et accéder au projet
cd dashboard

# Copier le fichier d'environnement
cp .env.example .env

# Lancer les containers
docker-compose up -d

# Initialiser la base de données avec un admin par défaut
docker-compose exec backend npm run db:seed
```

L'application sera accessible sur:
- Frontend: http://localhost:5173
- Backend API: http://localhost:3001

### Credentials par défaut

- **Email**: admin@example.com
- **Password**: admin123

## Développement sans Docker

### Backend

```bash
cd backend
npm install
npm run db:generate
npm run db:push
npm run db:seed
npm run dev
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

## Structure du projet

```
dashboard/
├── docker-compose.yml
├── .env.example
├── backend/
│   ├── Dockerfile
│   ├── package.json
│   ├── prisma/
│   │   ├── schema.prisma
│   │   └── seed.ts
│   └── src/
│       ├── index.ts
│       ├── controllers/
│       ├── middleware/
│       ├── routes/
│       ├── types/
│       └── utils/
└── frontend/
    ├── Dockerfile
    ├── package.json
    ├── tailwind.config.js
    └── src/
        ├── main.tsx
        ├── App.tsx
        ├── components/
        ├── context/
        ├── pages/
        ├── services/
        └── types/
```

## API Endpoints

### Auth
- `POST /api/auth/register` - Inscription
- `POST /api/auth/login` - Connexion
- `GET /api/auth/profile` - Profil utilisateur
- `PUT /api/auth/profile` - Mise à jour profil

### Links
- `GET /api/links` - Liste des liens
- `GET /api/links/:id` - Détail d'un lien
- `POST /api/links` - Créer un lien
- `PUT /api/links/:id` - Modifier un lien
- `DELETE /api/links/:id` - Supprimer un lien
- `POST /api/links/:id/favorite` - Toggle favori
- `POST /api/links/:id/click` - Incrémenter clics

### Categories
- `GET /api/categories` - Liste des catégories
- `POST /api/categories` - Créer une catégorie
- `PUT /api/categories/:id` - Modifier une catégorie
- `DELETE /api/categories/:id` - Supprimer une catégorie

### Admin (requiert rôle ADMIN)
- `GET /api/admin/stats` - Statistiques
- `GET /api/admin/users` - Liste des utilisateurs
- `POST /api/admin/users` - Créer un utilisateur
- `PUT /api/admin/users/:id` - Modifier un utilisateur
- `DELETE /api/admin/users/:id` - Supprimer un utilisateur

## Thèmes disponibles

L'application inclut 32 thèmes DaisyUI:
light, dark, cupcake, bumblebee, emerald, corporate, synthwave, retro, cyberpunk, valentine, halloween, garden, forest, aqua, lofi, pastel, fantasy, wireframe, black, luxury, dracula, cmyk, autumn, business, acid, lemonade, night, coffee, winter, dim, nord, sunset

## Troubleshooting

### Backend ne démarre pas (Cannot find module '/app/dist/index.js')

Si le backend ne démarre pas avec cette erreur, reconstruisez les containers:

```bash
# Arrêter et supprimer les containers
docker-compose down

# Reconstruire les images sans cache
docker-compose build --no-cache

# Redémarrer les containers
docker-compose up -d

# Vérifier les logs
docker-compose logs -f backend
```

### Réinitialiser complètement l'environnement

```bash
# Arrêter et supprimer tout (containers, volumes, images)
docker-compose down -v
docker-compose build --no-cache
docker-compose up -d
docker-compose exec backend npm run db:seed
```

## License

MIT
