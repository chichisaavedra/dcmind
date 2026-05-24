# 🧠 Guía de Implementación del Backend para DocMind

## 📌 Contexto del Proyecto
**DocMind** es una plataforma inteligente de gestión documental diseñada para automatizar la organización de archivos mediante Inteligencia Artificial. La aplicación permite a los usuarios subir documentos (PDFs, Excel, Imágenes), procesarlos automáticamente usando modelos avanzados (Claude 3.5 Sonnet y GPT-4o Vision), y organizarlos en carpetas basadas en reglas inteligentes.

**Objetivo Final:** Convertirse en el "cerebro" documental de profesionales y pequeñas empresas, eliminando la carga manual de clasificar y resumir información.

---

## 👤 Perfil del Usuario (Dueño del Proyecto)
El dueño de este proyecto es una persona con **conocimientos limitados en programación**. 
> **⚠️ NOTA PARA LA IA/DESARROLLADOR:** Por favor, utiliza un lenguaje sencillo, claro y paciente. Explica los conceptos técnicos ("API Keys", "Database", "Environment Variables") como si estuvieras enseñando a un principiante. No asumas que el usuario sabe dónde pegar el código o cómo configurar un servidor.

---

## 🛠️ Requerimientos Técnicos del Backend

### 1. Autenticación y Seguridad (Prioridad Máxima)
El usuario valora la seguridad por encima de todo. Necesitamos:
- **Inicio de Sesión Real:** Implementar un sistema robusto (preferiblemente usando **Supabase Auth** o **Firebase**) que permita registro por email/contraseña y OAuth (Google).
- **Protección de Datos:** Los documentos de un usuario **NUNCA** deben ser accesibles por otro. Implementar RLS (Row Level Security) en la base de datos.
- **Cifrado:** Asegurar que los archivos en el Storage estén protegidos.

### 2. Procesamiento de IA (Modelo Híbrido y Diferenciación de Planes)
La app utiliza un sistema de "Slots de IA" con una lógica específica según el plan del usuario para optimizar costos y fomentar el upgrade.

#### **Plan FREE:**
- **Documentos (PDF/DOCX/PPT/XLS):** Usar **DeepSeek V3** (vía API compatible con OpenAI). Es más económico para procesar usuarios gratuitos.
- **Imágenes:** Usar **GPT-4o Vision** con un **LÍMITE ESTRICTO de 3 imágenes por mes**.
- **Velocidad:** Implementar un **delay artificial de 7 segundos** en el procesamiento para incentivar el upgrade a planes pagos.
- **Nota:** No mencionar "DeepSeek" en el frontend, referirse como "IA Estándar".

#### **Plan PRO/BUSINESS:**
- **Documentos:** Usar **Claude 3.5 Sonnet** (Anthropic) para máxima precisión y análisis profesional.
- **Imágenes:** Usar **GPT-4o Vision** sin límites mensuales.
- **Velocidad:** Procesamiento inmediato, sin delays artificiales.

#### **Lógica del Worker (Pseudocódigo):**
1. Verificar plan del usuario (`free` vs `pro`).
2. Si es `free` y el archivo es imagen, verificar `images_used_this_month < 3`.
3. Si es `free`, aplicar `sleep(7000)` antes o durante el procesamiento.
4. Seleccionar modelo: `deepseek-chat` para Free Docs, `claude-3-5-sonnet` para Pro Docs, `gpt-4o` para imágenes.
5. Descontar slot de IA y (si aplica) incrementar contador de imágenes.

### 3. Almacenamiento y Organización
- **Storage:** Configurar un bucket de almacenamiento para los archivos físicos.
- **Base de Datos:** Guardar la metadata de los archivos (nombre, tamaño, fecha, resumen de IA, carpeta, subcarpeta, etiquetas).
- **Reglas Automáticas:** Implementar la lógica que, al subir un archivo, verifique si cumple con alguna "Regla" (ej: "Si el nombre contiene 'Factura', mover a la carpeta 'Contabilidad'").

### 4. Integración de Pagos
- **Stripe:** Preparar la infraestructura para suscripciones (Plan Pro de $7/mes). El backend debe validar el estado de la suscripción para habilitar los límites superiores.

---

## 🔑 Guía Paso a Paso para el Back-End (PARA PRINCIPIANTES)
Como mencionaste que no tienes experiencia en programación, aquí te explico EXÁCTAMENTE qué necesitas, por qué, y de dónde sacarlo. Yo me encargaré de todo el código, tú solo debes crear las cuentas y pasarme las "Llaves" (API Keys) de seguridad.

### 1. Sistema Central, Base de Datos y Seguridad (SUPABASE)
**¿Qué es?** Es tu servidor principal. Guardará los usuarios (contraseñas), la base de datos (nombres de archivos), y los archivos físicos en su "Storage".
**¿Por qué es ultra seguro?** Supabase utiliza algo llamado **RLS (Row Level Security)**. Básicamente son reglas matemáticas inflexibles que dicen: *"El archivo X solo puede ser leído o borrado por el Usuario Y"*. Es imposible hackerlo desde el frontend porque la base de datos rechaza cualquier manipulación.
**Lo que debes hacer:**
1. Ve a [Supabase.com](https://supabase.com/) y regístrate gratis.
2. Crea un **Nuevo Proyecto** y ponle la contraseña más difícil que puedas inventar.
3. Al terminar de crear el proyecto, entra a "Project Settings" (Ajustes de proyecto) -> "API".
4. Ahí verás la **Project URL** y la **Project API Key (anon/public)**. Guárdalas para dármelas.

### 2. Inteligencia Artificial (LOS CEREBROS)
Para procesar texto e imágenes, DocMind usará "Motores" alquilados a empresas líderes.

**A) DeepSeek (Para el Plan Gratuito - Barato y Veloz)**
**¿Qué es?** Es una IA increíblemente potente y muy barata. La usaremos de forma secreta en el código para procesar docenas de Excel y PDFs de usuarios gratuitos sin que te cueste dinero. Solo lee texto, no imágenes.
**Lo que debes hacer:**
1. Ve a [DeepSeek Platform](https://platform.deepseek.com/) y regístrate.
2. Entra a la sección "API Keys", crea una nueva llave y guárdala.

**B) Anthropic Claude 3.5 Sonnet (Para el Plan Premium - El Cerebro Maestro)**
**¿Qué es?** Es la IA más inteligente del momento para lectura de documentos, supera a ChatGPT. La usarán tus usuarios de pago.
**Lo que debes hacer:**
1. Ve a [Anthropic Console](https://console.anthropic.com/) y regístrate.
2. En "Settings" -> "API Keys", crea tu llave secreta empezada en `sk-ant-..`.

**C) OpenAI GPT-4o Vision (Para leer Imágenes/Recibos)**
**¿Qué es?** Como Claude y Deepseek solo leen hojas de texto o PDF, cuando suban una "Foto de un recibo arrugado", llamaremos a GPT-4o Vision para extraer el texto. Estará limitado a 3 fotos para los gratis.
**Lo que debes hacer:**
1. Ve a [Platform OpenAI](https://platform.openai.com/api-keys) y regístrate.
2. Genera una nueva API Key empezada en `sk-proj...`.

### 3. Sistema de Pagos (STRIPE)
**¿Qué es?** Es el banco de internet. Recibirá las tarjetas de crédito de tus usuarios y nos avisará si alguien pagó los $7 al mes para cambiarle su cuenta a "PRO" automáticamente.
**Lo que debes hacer:**
1. Ve a [Stripe.com](https://stripe.com/) y regístrate.
2. En el panel de control (Dashboard), busca la pestaña "Desarrolladores" (Developers) -> "API Keys".
3. Necesitaremos dos: La **Publishable Key** (Empieza con `pk_`) y la **Secret Key** (Empieza con `sk_`).

---

## 📂 Estructura Actual del Frontend
El frontend ya está construido con **React + Tailwind CSS**.
- `src/App.tsx`: Maneja el estado global y la navegación.
- `src/components/MainLayout.tsx`: Contiene el buscador y la estructura principal.
- `src/components/views/Dashboard.tsx`: Donde ocurre la magia de la subida y visualización.
- `src/lib/mockData.ts`: **IMPORTANTE:** Aquí hay datos falsos que deben ser reemplazados por llamadas reales a la API.

---

---

## 🚀 Próximos Pasos Sugeridos
1. Configurar el servidor (Express.js o integración directa con Supabase).
2. Crear las tablas en la base de datos (`profiles`, `files`, `folders`, `rules`).
3. Implementar el endpoint de subida de archivos con procesamiento de IA en segundo plano (Webhooks o Edge Functions).
4. Conectar el buscador del Header con una consulta real a la base de datos.

---

## 📝 Historial de Cambios Frontend y de Diseño Reciente
**Nota para el futuro desarrollador / IA:** Se realizaron modificaciones importantes en la interfaz (febrero):
- **Tipografía:** Se reemplazó por la combinación elegante de *Plus Jakarta Sans* y *Playfair Display* en `index.css`.
- **Fondo Interactivo:** El `ParticleBackground.tsx` ahora muestra pequeñas partículas del logo corporativo (`BrainCircuit`) para dar un efecto premium. Se ha extendido en todo el `MainLayout.tsx` con menor densidad, integrándose de forma sutil y estética.
- **Widgets de Analytics:** Se rediseñó por completo `Analytics.tsx` para quitar gráficos genéricos, reemplazando por métricas más útiles ("Horas ahorradas vs manual", "Precisión IA", "Tipos de Origen") combinados con "tooltips" informativos e iconos refinados.
- **Correcciones UI:** Se arregló un bug en los modales de `Settings.tsx` para que el `backdrop-blur` se ponga en pantalla completa con react `createPortal`. También se eliminó el badge de "ESTADO: SEGURO" en el Dashboard para mantener un interfaz más conciso.

---

## 📅 [NUEVO] - Requerimientos Avanzados de IA Proactiva (A implementar en Backend)
**INSTRUCCIONES CLAVE PARA LA LOGICA DEL MOTOR IA:**
Cuando se procesen documentos (PDFs, Excel, etc.), la IA (*Claude / Deepseek*) debe estar instruida ("traineada a través de system prompts") para ser **SÚPER ATENTA** y **PROACTIVA**. Debe realizar obligatoriamente los siguientes análisis extra:

1. **Detección de Acontecimientos Cercanos (5 Días):** Si el documento contiene fechas de vencimiento (ej. facturas), fechas de audiencias, exámenes próximos, pagos de pólizas o reuniones que ocurran en los próximos 5 días, la IA DEBE aislar ese dato e incluirlo en el resumen con alertas rojas/importantes.
2. **Recomendaciones y Resúmenes Medianos:** Los resúmenes no pueden ser de 1 sola línea; deben listar: ¿De qué trata? ¿Hay fechas críticas? ¿Qué recomendación de acción se da? (Ej: "Pagar antes de X fecha").
3. **Búsqueda Relacional y QA de Carpetas:** El endpoint del Asistente debe permitir al usuario referenciar y preguntar "chateando" sobre carpetas enteras, subcarpetas, o archivos concretos, para escupir un resumen consolidado de lo contenido ahí.
4. **Detección de Entidades Cíclicas (Memoria a Largo Plazo):** Si la IA detecta nombres de empresas o personas que se repiten sospechosamente mucho a lo largo de varios documentos, el Backend debe emitir un *Flag* para añadirlo a un objeto tipo `UserContextMemory`. Además, guardar los datos explícitos del *Onboarding* (Nombres, proveedores, a qué se dedica). Esta "memoria" debe inyectarse como *System Prompt* en todas las interacciones futuras.
5. **Recomendaciones en Pantalla de Inicio:** Al abrir la app, la IA debe hacer sugerencias *push*. Ej: "¿Quieres que agende el examen de matemáticas que leí en tus apuntes como importante?" o "Tienes un examen en 5 días y aquí hay recursos relacionados". Evaluar fallos en documentos (ej: fechas vencidas, cálculos malos) y avisar al vuelo.
6. **Integraciones Dinámicas (Drive, Outlook, Dropbox):** El backend debe poseer módulos de autenticación OAuth paralelos a Supabase para sincronizar carpetas en tiempo real desde Google Drive, Dropbox y correos de Outlook, ingiriendo esos archivos a los ciclos de análisis IA.
*La premisa es: El asistente DEBE hacer el trabajo por el usuario antes de que este se lo pida, adaptándose a su vida personal y laboral como un secretario.*

---
*Documento actualizado y asegurado para no perder de vista los requerimientos futuros de la IA proactiva.*
