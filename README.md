# Creador de Currículums

Una aplicación gratuita y de código abierto para hacer tu currículum (y su
carta de presentación) sin depender de plantillas de pago, cuentas, ni subir
tus datos a ningún servidor. Todo pasa en tu propio ordenador.

## ¿Qué es esto?

Si alguna vez has intentado hacer un currículum decente, seguramente te has
encontrado con lo mismo: plantillas bonitas que hay que pagar para
descargar, herramientas que te piden crear una cuenta, o Word peleándose
contigo cada vez que mueves un párrafo un milímetro.

Este proyecto es un editor de currículums que funciona directamente en tu
navegador (o como programa de escritorio normal, si lo prefieres). Rellenas
tus datos una vez —experiencia, estudios, habilidades, idiomas— y eliges
entre varias plantillas y combinaciones de colores y tipografía para ver al
instante cómo queda. Cuando estás conforme, lo exportas a PDF con un clic,
con texto real y seleccionable (no una imagen), listo para enviar o subir a
cualquier portal de empleo.

No hace falta instalar nada para probarlo, no pide registro, y no tiene
anuncios. Es software libre: el código es público, cualquiera puede verlo,
usarlo o modificarlo.

## Por qué es diferente

- **Tus datos son solo tuyos.** No hay servidor: todo se guarda en tu propio
  equipo (en el almacenamiento local del navegador o de la app de
  escritorio). Nada se sube a internet salvo que tú lo decidas explícitamente
  (por ejemplo, al pedirle a una IA externa que te ayude a redactar algo —
  ver más abajo).
- **Es gratis y lo seguirá siendo.** No hay planes de pago, ni funciones
  "premium" bloqueadas.
- **Puedes tener varios currículums a la vez**, uno por cada empresa u
  oferta a la que te presentes, y cambiar entre ellos en un clic.
- **También lleva un seguimiento de tus candidaturas**: una tabla donde
  apuntas cada oferta a la que aplicas, con una nota automática de qué tan
  bien encajas según tu perfil.
- **Funciona igual en el navegador y como programa de escritorio** (Windows,
  macOS y Linux), por si prefieres tenerlo como una aplicación normal con su
  propio icono.

## Qué puedes hacer con la app

- **Rellenar tu perfil por secciones**: datos de contacto y foto,
  experiencia laboral, formación, habilidades (con su logo automático:
  React, Python, Docker, AWS...), idiomas, proyectos, certificaciones y
  enlaces (LinkedIn, portfolio...). Todo se reordena arrastrando.
- **Elegir cómo se ve**: 5 plantillas distintas, paletas de color
  predefinidas o un color a tu gusto, varias combinaciones de tipografía,
  tamaño de letra y densidad ajustables, y 4 formas para tu foto de perfil
  (incluida una que ocupa toda la esquina de la página). El tamaño del
  recuadro de la foto también se puede ajustar si queda muy recortada.
- **Editar y recortar tu foto** sin salir de la app: arrastra para
  encuadrar y usa el zoom antes de guardarla.
- **Ver el resultado en tiempo real**, con el formato exacto de una hoja A4,
  y ocultar las secciones que no quieras mostrar.
- **Exportar a PDF de verdad**: el texto es seleccionable y copiable (no una
  captura de pantalla), para que tanto una persona como un sistema
  automático de selección de candidatos (ATS) puedan leerlo sin problema.
- **Escribir una carta de presentación a juego**, con los mismos colores y
  tipografía que tu CV, y exportarla también a PDF.
- **Rellenar todo de golpe con ayuda de una IA**: copias un texto ya
  preparado, se lo pegas a tu IA favorita (ChatGPT, Gemini, Claude...) junto
  con tu información, y pegas su respuesta de vuelta para rellenar el CV,
  la carta o una tanda de ofertas de trabajo entera en segundos. Nada de
  esto pasa automáticamente por ti — la copia/pega la haces tú, así que
  sigue siendo tan privado como el resto de la app.
- **Llevar la cuenta de tus candidaturas**: una tabla con cada oferta a la
  que te presentas (empresa, enlace, tecnologías que piden, si ya la
  enviaste...) y una nota de 0 a 100 de qué tan bien encaja contigo, para
  saber dónde merece más la pena insistir.
- **Tener varias versiones de tu CV** guardadas a la vez y cambiar entre
  ellas al instante, para adaptar una copia distinta a cada empresa.
- **Modo día/noche** para la interfaz (el propio currículum siempre
  mantiene los colores que le hayas puesto, da igual el modo).

## Cómo probarlo

Necesitas tener instalado [Node.js](https://nodejs.org/) (versión 20 o
superior). Luego, en una terminal:

```bash
git clone https://github.com/XIIRAD2/CreadorDeCurriculums.git
cd CreadorDeCurriculums
npm install
npm run dev
```

Abre la dirección que te indique la terminal (normalmente
`http://localhost:5173`) y ya puedes empezar a rellenar tu currículum.

Otros comandos útiles:

```bash
npm run build    # genera la versión de producción en dist/
npm run preview  # sirve esa versión de producción para probarla
npm run lint     # revisa el estilo del código
```

### Como aplicación de escritorio

La misma app se puede abrir como programa normal de Windows, macOS o Linux
(con su propio icono e instalador), usando [Tauri](https://tauri.app/):

```bash
npm run desktop:dev     # abre una ventana nativa, con recarga en caliente
npm run desktop:build   # genera el instalador para tu sistema operativo
```

Para esto hace falta además el toolchain de [Rust](https://rustup.rs/) — en
Windows también el WebView2 Runtime (ya viene con Windows 11) y las Build
Tools de Visual Studio con el componente "Desktop development with C++".

> La app de escritorio guarda sus datos por separado del navegador (usa su
> propia ventana WebView2). Si quieres pasar un CV de un sitio a otro, usa
> "Exportar JSON" en uno y el importador con IA (o "Importar" con el mismo
> archivo) en el otro.

## Tu privacidad, en corto

No hay ninguna cuenta que crear ni servidor al que se conecte la app para
guardar tus datos. Todo —tu nombre, tu foto, tu experiencia— se queda
guardado en el almacenamiento local de tu navegador o de la app de
escritorio (una base de datos llamada IndexedDB), exactamente igual que
cualquier página guarda tus preferencias. Si borras los datos de navegación
de tu navegador, o desinstalas la app, esa información desaparece con
ellos — igual que si nunca hubiera salido de tu ordenador, porque nunca lo
hizo.

## ¿Quieres contribuir?

Este proyecto es de código abierto bajo licencia [MIT](LICENSE): puedes
usarlo, copiarlo, modificarlo o construir algo encima libremente. Si
encuentras un fallo, tienes una idea, o quieres echar una mano con el
código, los issues y pull requests son bienvenidos.

---

## Documentación técnica

Esta parte es para quien quiera leer o modificar el código.

### Stack técnico

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

### Estructura

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

### Notas de implementación

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
