# HubSpot CTA Reporting - Quick Deploy

## Pre-requisitos
- Node.js (local) para pruebas
- Cuenta en Render (o similar) para deploy
- Token personal de HubSpot (HS_TOKEN)

## Pasos locales (opcional)
1. Clonar repo o copiar los archivos en una carpeta.
2. Abrir la carpeta en VSCode.
3. Ejecutar `npm install`.
4. Ejecutar `npm start`.
5. Abrir `http://localhost:3000` y usar `public/index.html`.

## Subir a GitHub
1. Inicializar git: `git init`.
2. `git add . && git commit -m "initial"`.
3. Crear repo en GitHub y pushearlo.

## Deploy en Render
1. Crear cuenta en https://render.com.
2. New → Web Service → Connect GitHub repo.
3. Build Command: `npm install`.
3. Start Command: `npm start`.
4. En Environment variables agrega `HS_TOKEN` = *tu token*.
5. Deploy y obtenerás la URL pública.

## Uso
- Abrir `https://TU-URL` y usar la UI minimalista.
- Endpoints disponibles:
  - `/cta?id=CTA_ID` → métricas CTA
  - `/cta/url?id=CTA_ID&url=PAGE_URL&from=YYYY-MM-DD&to=YYYY-MM-DD` → conteos filtrados
  - `/event?id=EVENT_ID&from=...&to=...` → eventos personalizados
