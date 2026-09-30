# Gainlytic Affiliate Website

Helle, responsive statische Affiliate-Website für Sport, Supplements und Proteinpulver.

## Amazon Tracking

Die zentrale Tracking-ID steht in `config.js`:

```js
amazonTag: "gainlytic-21"
```

Jeder von der Website erzeugte Amazon.de-Link bekommt automatisch `tag=gainlytic-21`.

## Produkte pflegen

Alle Produktkarten stehen in `products.js`. Für neue Produkte einfach einen Eintrag kopieren. Du kannst entweder `query` für eine Amazon-Suche, `asin` für eine direkte Produktseite oder `amazonUrl` für eine bereits vorhandene Amazon-URL setzen. Der Code ergänzt/überschreibt automatisch den Tracking-Parameter mit `gainlytic-21`. Es werden absichtlich keine dauerhaft gespeicherten Amazon-Preise angezeigt, damit keine veralteten Preise auf der Seite stehen.

## GitHub Pages

1. Neues GitHub-Repository erstellen, z. B. `gainlytic`.
2. Alle Dateien aus diesem Ordner in den `main`-Branch hochladen.
3. In GitHub: **Settings → Pages → Build and deployment → Source: GitHub Actions**.
4. Der Workflow `.github/workflows/pages.yml` veröffentlicht die Seite bei jedem Push auf `main` automatisch.

## Vor Veröffentlichung

- `impressum.html` mit den tatsächlichen Anbieterangaben vervollständigen.
- `datenschutz.html` an den tatsächlichen Hosting-/Tracking-Stack anpassen.
- Amazon-Partnerkonto prüfen und die veröffentlichte Website dort hinterlegen.
- Produkttexte und Links regelmäßig kontrollieren.

## Keine externen Tracker

Die Ausgangsversion lädt keine externen Fonts, Analyse-Skripte oder Werbetracker. Dadurch bleibt sie schnell und datensparsam.
