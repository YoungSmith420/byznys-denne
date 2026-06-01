# Byznys Denne

Web pro českou byznys a finanční vzdělávací platformu **Byznys Denne** (@byznysdenne).

Postaven na **Astro + Tailwind CSS**, tmavý design, zlatá paleta.

## Spuštění

```bash
# Instalace závislostí
npm install

# Vývojový server (http://localhost:4321)
npm run dev

# Build pro produkci
npm run build

# Náhled produkčního buildu
npm run preview
```

## Struktura projektu

```
src/
├── components/
│   ├── ArticleCard.astro     # Karta článku
│   ├── CategoryBadge.astro   # Badge kategorie
│   ├── Footer.astro          # Patička
│   ├── Navigation.astro      # Navigace
│   └── NewsletterForm.astro  # Formulář newsletteru
├── content/
│   └── clanky/               # MDX články
├── layouts/
│   └── BaseLayout.astro      # Základní layout
├── pages/
│   ├── index.astro           # Domovská stránka
│   ├── o-nas.astro           # O nás
│   └── clanky/
│       ├── index.astro       # Seznam článků
│       └── [slug].astro      # Detail článku
└── styles/
    └── global.css            # Globální CSS
```

## Přidání článku

Vytvoř nový soubor v `src/content/clanky/muj-clanek.mdx`:

```mdx
---
title: "Název článku"
excerpt: "Krátký popis článku."
category: finance  # investice | podnikani | finance | krypto
date: 2025-06-01
readTime: 5
---

## Nadpis sekce

Text článku v Markdownu...
```

## Deploy

### Vercel (doporučeno)
Připoj GitHub repozitář na [vercel.com](https://vercel.com). Build nastavení jsou v `vercel.json`.

### Netlify
Připoj GitHub repozitář na [netlify.com](https://netlify.com). Build nastavení jsou v `netlify.toml`.

## Barvy

| Proměnná | Hex | Použití |
|---|---|---|
| `background` | `#0a0a0a` | Pozadí stránky |
| `surface` | `#111111` | Sekce, panely |
| `card` | `#1a1a1a` | Karty |
| `gold-primary` | `#D4AF37` | Primární akcent |
| `gold-light` | `#F0CC5A` | Hover stav |
| `text-primary` | `#F5F5F5` | Hlavní text |
| `text-secondary` | `#A0A0A0` | Sekundární text |
