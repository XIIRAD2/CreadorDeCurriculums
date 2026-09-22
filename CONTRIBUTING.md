# Documentación técnica

Esta parte es para quien quiera leer o modificar el código de
[Creador de Currículums](README.md).

## Stack técnico

- **React 19 + TypeScript + Vite**, estilos con **Tailwind CSS v4**.
- **Dexie (IndexedDB)** como base de datos local — cada CV es un documento JSON
  completo, lo que hace trivial duplicar/versionar currículums.
- **Zustand** para el estado en memoria del CV activo, con autoguardado
  debounced hacia Dexie.
- **@dnd-kit** para el reordenado por arrastre (habilidades, experiencia,
  educación, secciones del CV...).
- **`@react-pdf/renderer`** para la exportación a PDF: es un motor de PDF que
  se ejecuta en el navegador y compone el documento con sus propios
  componentes (`Document`/`Page`/`View`/`Text`), escribiendo texto real
  embebido con las mismas fuentes de `@fontsource` — nada de capturar una
  imagen de la pantalla. Se carga solo al pulsar "Exportar a PDF"
  (`import()` dinámico), así que no engorda la carga inicial de la app.
- **react-colorful** para el selector de color libre.
- **react-easy-crop** para el editor de foto (arrastrar + zoom); el recorte
  elegido se renderiza a un cuadrado fijo en un `<canvas>` y esa es la imagen
  que se guarda — ni la vista previa ni el PDF necesitan recortarla ellos.
- **Tauri** para el empaquetado de escritorio — mismo frontend, sin rama de
  código distinta (ver `src-tauri/`).
- Tipografías autoalojadas con **@fontsource** (sin llamadas a Google Fonts).

## Estructura

```
src/
  types/cv.ts              Modelo de datos del CV
  types/jobTracker.ts      Modelo de datos de una oferta del seguimiento
  types/settings.ts        "Mi perfil de búsqueda": tecnologías base + puestos buscados
  db/db.ts                 Base de datos local (Dexie/IndexedDB) — tablas cvs, jobApplications y settings
  store/useCvStore.ts       Estado del CV activo + autoguardado
  store/useViewStore.ts     Qué pantalla se muestra: CV o seguimiento de ofertas
  store/useAppThemeStore.ts Modo día/noche de la interfaz (no del documento)
  lib/                      Utilidades (paletas, fuentes, fechas, color, importar JSON…)
  components/
    layout/                 Cabecera (con las pestañas CV/Ofertas) y configurador
    configurator/            Formularios de cada sección del CV
    cvManager/               Selector/gestor de CVs guardados + importador con IA
    jobTracker/              Tabla de seguimiento de ofertas + su importador con IA
    preview/                 Vista previa A4 (HTML/Tailwind), plantillas y bloques
    ui/                      Componentes de interfaz reutilizables
  pdf/                      Documento PDF real (react-pdf): fuentes, plantillas y
                             bloques equivalentes a preview/, pero con componentes
                             Document/Page/View/Text en vez de HTML
```

## Poner el proyecto en marcha

```bash
git clone https://github.com/XIIRAD2/CreadorDeCurriculums.git
cd CreadorDeCurriculums
npm install
npm run dev
```

```bash
npm run build    # build de producción en dist/
npm run preview  # sirve el build de producción para probarlo
npm run lint     # oxlint
npm run desktop:dev     # abre la app de escritorio (Tauri), con recarga en caliente
npm run desktop:build   # genera el instalador para tu sistema operativo
```

La app de escritorio necesita además el toolchain de [Rust](https://rustup.rs/)
— en Windows también el WebView2 Runtime (ya viene con Windows 11) y las Build
Tools de Visual Studio con el componente "Desktop development with C++".

## Notas de implementación

- Los datos viven en el IndexedDB del navegador. Borrar los datos del sitio
  (o usar otro navegador/perfil) empieza de cero.
- No hay backend: la exportación a PDF ocurre enteramente en el navegador.
- La vista previa (`components/preview/`) y el PDF exportado (`pdf/`) son dos
  implementaciones paralelas del mismo diseño — una en HTML/CSS para editar en
  vivo, otra con los componentes nativos de react-pdf para que el PDF final
  tenga texto real. Si cambias el diseño de una plantilla, hazlo en ambos sitios.
- El modo día/noche funciona redefiniendo las variables CSS de color que ya
  usan las clases de Tailwind (`index.css`, bloque `.dark`) en vez de añadir
  `dark:` a cada componente — por eso casi ningún componente tiene clases de
  modo oscuro propias. `.cv-page` fija esas mismas variables de vuelta a sus
  valores claros originales, así que el documento nunca cambia con el modo.
- Guardar archivos (PDF, JSON) usa `src/lib/saveFile.ts`: en la app de
  escritorio, el WebView de Tauri ignora en silencio un `<a download>` normal
  (la misma restricción que bloqueaba los enlaces externos — ver
  `openExternal.ts`), así que ahí se abre un diálogo nativo "Guardar como"
  (`@tauri-apps/plugin-dialog` + `@tauri-apps/plugin-fs`) y se escribe el
  archivo de verdad; en la versión web sigue siendo la descarga normal del
  navegador. El permiso `fs:default` de Tauri solo da lectura a las carpetas
  internas de la app — escribir en la ruta que elige el usuario necesita el
  permiso `fs:allow-write-file` con scope explícito (`src-tauri/capabilities/
  default.json`, `$HOME/**`), si no, `writeFile` falla con un error de
  permiso denegado aunque el diálogo de guardado se vea bien.
- `.cv-page` es un contenedor flex en columna (no solo `min-height`) para que
  un CV corto siga ocupando la página A4 entera — un `min-height` por sí solo
  no cuenta como "altura definida" para que un `height:100%` de dentro (la
  barra lateral, por ejemplo) se resuelva bien; por eso las plantillas usan
  `flex-1` en su contenedor raíz en vez de `h-full`.
- La plantilla PDF de "barra lateral" (`pdf/SidebarPdfTemplate.tsx`) posiciona
  la columna de color con `position: absolute` + `fixed` en vez de un
  `flexDirection: 'row'` normal — un row normal hace que react-pdf estire esa
  columna a la altura completa de cada página nueva al paginar, dejando un
  bloque de color vacío cuando el CV ocupa 2+ páginas y el contenido de la
  barra lateral ya se ha acabado.
- El tamaño del recuadro de la foto (`theme.photoZoom`, pestaña Diseño) agranda
  o encoge la caja de la foto en sí (`CornerPhoto.tsx`/`AvatarPlaceholder.tsx`),
  no solo lo que se ve dentro — por eso el recorte de `object-fit: cover`
  simplemente muestra más o menos foto en vez de hacer zoom óptico. Cada
  plantilla centra esa caja con flexbox (`items-center`/`justify-center`), así
  que crece desde el centro de su posición en vez de desbordar hacia un lado.
- La forma de foto "Esquina" (`components/preview/CornerPhoto.tsx` +
  `pdf/CornerPhotoPdf.tsx`) usa un margen negativo igual al padding de la
  cabecera/barra lateral para que la foto "sangre" más allá de ese padding y
  llegue de verdad al borde de la página, en vez de quedarse dentro de la
  caja con espacio alrededor.
- Los logos de tecnología (`lib/techLogos.ts`) vienen del paquete
  `simple-icons` (CC0, sin llamadas a internet) — solo se importan por
  nombre los ~130 iconos que se usan de verdad, así que Vite los deja fuera
  del bundle final aunque el paquete completo pese varios MB (tree-shaking).
- `lib/cvConfig.ts` (exportar/importar solo el diseño) valida `templateId` y
  `photoShape` contra listas propias (`TEMPLATES`/`PHOTO_SHAPES`), no contra
  los tipos de `types/cv.ts` — si añades una plantilla o forma de foto nueva
  hay que añadirla ahí también, o un archivo de diseño exportado con ese
  valor cae silenciosamente al valor por defecto al reimportarlo.
- El importador con IA (`lib/importCv.ts`) descarta automáticamente
  entradas de "links" que en realidad repiten el correo o el teléfono ya
  guardados en "personal" (algo que las IAs hacen a veces si el texto
  original mezcla el email entre los enlaces de contacto), y también
  entradas duplicadas entre sí por URL — para que importar no deje el
  correo o un enlace repetido dos veces.

## Contribuir

Issues y pull requests son bienvenidos. El proyecto usa TypeScript estricto
y `oxlint` — antes de un PR, comprueba que `npm run build` y `npm run lint`
pasan sin errores.
