# 🔐 Setup Utenti di Base

Questo script crea 3 utenti di base per il testing dell'app.

## 📋 Utenti Creati

| Email | Password | Ruolo | Nome |
|-------|----------|-------|------|
| `founder@hexahub.com` | `Founder@2024!` | founder | Founder CEO |
| `admin@hexahub.com` | `Admin@2024!` | admin | Admin Manager |
| `tester@hexahub.com` | `Tester@2024!` | tester | Tester QA |

## ✅ Come Usare

### Prerequisiti
- Node.js 16+
- `.env.local` configurato con:
  ```
  NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
  NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
  SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
  ```

### Esecuzione

```bash
# Install ts-node if not already installed
npm install -g ts-node

# Run the seed script
npx ts-node scripts/seed-users.ts
```

Oppure con npm script:

```bash
npm run seed:users
```

Se aggiungi questo script in `package.json`:
```json
{
  "scripts": {
    "seed:users": "ts-node scripts/seed-users.ts"
  }
}
```

## 🔍 Output Atteso

```
Starting user seeding...
✓ Created user: founder@hexahub.com (founder)
  Email: founder@hexahub.com
  Password: Founder@2024!
  Name: Founder CEO
  Role: founder

✓ Created user: admin@hexahub.com (admin)
  Email: admin@hexahub.com
  Password: Admin@2024!
  Name: Admin Manager
  Role: admin

✓ Created user: tester@hexahub.com (tester)
  Email: tester@hexahub.com
  Password: Tester@2024!
  Name: Tester QA
  Role: tester

User seeding completed!
```

## ⚠️ Note Importanti

1. **Service Role Key**: Lo script richiede la SERVICE_ROLE_KEY per creare gli utenti
2. **Email Confirmation**: Gli utenti vengono creati con email già confermata
3. **User Metadata**: Sono già impostati i dati di base (nome, cognome, ruolo)
4. **Idempotente**: Lo script controlla se l'utente esiste già prima di crearlo

## 🔐 Sicurezza

⚠️ **IMPORTANTE**: Le password sopra sono solo per il testing locale. In produzione:
- Cambia tutte le password
- Non committare il file seed in version control
- Usa password forti e complesse
- Attiva autenticazione multi-factor

---

**Created**: 2024
**Updated**: 2026-08-18
