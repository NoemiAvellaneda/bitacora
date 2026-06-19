# Bitácora

Tu herramienta personal de gestión de vida. Esta carpeta es el proyecto completo,
listo para abrir en VS Code, probar en tu computador y publicar en internet con un enlace.

---

## 1. Qué necesitas (una sola vez)

- **VS Code** (ya lo tienes).
- **Node.js** — descárgalo en https://nodejs.org (elige la versión **LTS**). Es lo que
  permite "correr" y "construir" el proyecto. Instálalo con todas las opciones por defecto.
- Una **cuenta de GitHub** (con tu correo **personal**) — la creas en https://github.com

Para saber si ya tienes Node.js: abre VS Code, menú *Terminal → New Terminal*, escribe
`node -v` y aprieta Enter. Si aparece un número (ej. `v20.11.0`), ya está.

---

## 2. Probarla en tu computador

1. Abre esta carpeta en VS Code (*File → Open Folder…* y elige la carpeta `bitacora`).
2. Abre la terminal (*Terminal → New Terminal*) y escribe, una línea a la vez:

   ```
   npm install
   npm run dev
   ```

3. Te mostrará una dirección como `http://localhost:5173/`. Ábrela en el navegador
   (Ctrl+clic sobre el enlace) y verás la Bitácora funcionando.
4. Para detenerla, en la terminal aprieta `Ctrl + C`.

> `npm install` solo se hace la primera vez (descarga lo necesario). Después, basta `npm run dev`.

---

## 3. Tus datos y el respaldo

Por ahora, tus datos se guardan en **este navegador, en este computador** (no se suben a
internet todavía). Al pie de la app tienes dos botones:

- **exportar respaldo**: descarga un archivo con todos tus datos. Guárdalo de vez en cuando.
- **importar respaldo**: vuelve a cargar tus datos desde ese archivo (por ejemplo, en otro
  computador).

> La sincronización automática entre computadores (con Supabase) es el **siguiente paso**.
> Cuando la conectemos, ya no necesitarás los respaldos manuales.

---

## 4. Publicarla en internet (GitHub Pages)

Así obtienes el **enlace público** que abres desde cualquier computador.

### Subir el proyecto a GitHub (lo más fácil desde VS Code)

1. En VS Code, abre el panel **Source Control** (el icono de ramas, a la izquierda).
2. Haz clic en **Publish to GitHub** (o *Publicar en GitHub*).
3. Inicia sesión en GitHub cuando te lo pida (se abre el navegador).
4. Elige **repositorio público** y un nombre, por ejemplo `bitacora`.
5. VS Code sube todo solo. (No subirá `node_modules` ni `dist`; eso es lo correcto.)

### Activar GitHub Pages

1. En github.com, entra a tu repositorio `bitacora`.
2. Ve a **Settings → Pages**.
3. En **Source**, elige **GitHub Actions**.
4. Listo. El proyecto trae un "workflow" que **construye y publica solo**.

Espera 1–2 minutos. En la pestaña **Actions** verás el progreso; cuando termine, el enlace
aparece en **Settings → Pages** (será algo como
`https://TU-USUARIO.github.io/bitacora/`).

Ese enlace lo abres desde cualquier computador. Y cada vez que subas un cambio (un nuevo
"commit/push" desde VS Code), **se vuelve a publicar solo**.

> Alternativa sin VS Code: en el repositorio vacío usa *Add file → Upload files* y arrastra
> todo el contenido de la carpeta **menos** `node_modules` y `dist`. Luego activa Pages igual.

---

## 5. Estructura de la carpeta

```
bitacora/
├─ index.html              ← página base
├─ package.json            ← dependencias y comandos
├─ vite.config.js          ← configuración (lista para GitHub Pages)
├─ .github/workflows/      ← publicación automática en Pages
├─ src/
│  ├─ main.jsx             ← arranque de la app
│  └─ Bitacora.jsx         ← la Bitácora completa (el corazón)
└─ README.md               ← esta guía
```

Todo cambio de diseño o de funciones se hace en `src/Bitacora.jsx`.

---

Hecha con cariño para uso personal. 🌱
