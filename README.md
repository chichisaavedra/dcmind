<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/bbd69c7e-0a85-49b9-9746-45b3cd4d4fb2

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`

## Publicar en GitHub Pages

Este proyecto ya incluye un workflow en `.github/workflows/deploy-pages.yml`.

1. Crea un repositorio nuevo en GitHub.
2. Sube este proyecto a la rama `main`.
3. En GitHub, entra a `Settings > Pages`.
4. En `Build and deployment`, selecciona `GitHub Actions`.
5. Cada vez que hagas push a `main`, GitHub construira la app y la publicara.

Si el repositorio se llama `tu-usuario.github.io`, la pagina saldra en:
`https://tu-usuario.github.io`

Si el repositorio tiene otro nombre, por ejemplo `docmind`, la pagina saldra en:
`https://tu-usuario.github.io/docmind/`
