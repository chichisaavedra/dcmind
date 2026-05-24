# Mapeo de Tareas para la Integración del Backend (Supabase)

Esta es una lista comprensiva de todos los puntos de la interfaz de usuario (UI) que han sido preparados y simulados, y que requieren ser conectados a la lógica real del backend/Supabase en el futuro.

## Autenticación (Login / Registro)
- [ ] **Google OAuth**: El botón de "Continuar con Google" actualmente simula un inicio de sesión guardando un email estático en `localStorage`. Debe integrarse con `supabase.auth.signInWithOAuth({ provider: 'google' })`.
- [ ] **Recuperación de Contraseña**: El enlace "¿Olvidaste tu contraseña?" actualmente lanza un `alert`. Se debe implementar la vista de recuperación y la función `supabase.auth.resetPasswordForEmail()`.
- [ ] **Recordarme**: El checkbox "Recordarme" requiere lógica para ajustar la persistencia de la sesión en Supabase (ej. `supabase.auth.setSession`).

## Dashboard / Interfaz Principal
- [ ] **Subida Inteligente (Drag & Drop / Input File)**: Actualmente se simula una animación de análisis IA con un timeout y mock data (`MOCK_SMART_FILES`). Debe:
  1. Subir el archivo real a un bucket de Storage en Supabase.
  2. Llamar a una Edge Function (o webhook) que procese el archivo con la API de OpenAI/Claude.
  3. Recibir la sugerencia de enrutamiento y guardarla en la base de datos (PostgreSQL).
- [ ] **Sugerencias IA (Insights Card)**: El botón "Revisar Ahora" lanza un `alert`. Debe abrir un modal real o una vista que traiga los documentos pre-clasificados por la IA desde Supabase para la aprobación del usuario.
- [ ] **Sistema de Notificaciones**: El botón de la campana (Logotipo Bell) en la navegación superior requiere una tabla `notifications` en Supabase con suscripciones en tiempo real usando Supabase Realtime (WebSockets) para avisar sobre procesos de IA terminados, acercamiento de límites, etc.
- [ ] **Menú "+" (Documento, Carpeta Inteligente, Conectar Drive)**: Las opciones cierran el menú pero no hacen nada más. Deben abrir modales para crear registros en la base de datos o iniciar un flujo OAuth para Google Drive.

## Archivos y Carpetas (Biblioteca)
- [ ] **Búsqueda Global (Cmd+K)**: Actualmente filtra un array de `MOCK_FILES` en memoria. Debe conectarse a un endpoint de búsqueda sobre PostgreSQL (idealmente con búsqueda vectorial/semántica mediante pgvector si se habla con los archivos).
- [ ] **Modal de Detalles de Archivos**: Los botones de "Descargar", "Compartir" y "Eliminar" en el modal de detalles de archivo o en la lista son visuales. Requieren:
  - **Descargar**: Generar una URL firmada de Supabase Storage.
  - **Eliminar**: Soft delete en la base de datos y/o eliminación del bucket.
  - **Compartir**: Crear un enlace público u otorgar permisos granulares usando Row Level Security (RLS) en Supabase.
- [ ] **Creación de Carpetas**: Aunque el UI permite añadir carpetas y se guardan en el estado de React, debe crearse una tabla robusta de jerarquía de carpetas u organización de etiquetas en la BBDD, respetando el `user_id`.

## Planes y Suscripciones (Pricing)
- [ ] **Verificación de Límites (Quotas)**: El progreso de "40/100 slots" está hardcodeado. Debería consultarse a PostgreSQL, verificando el uso real mensual por plan.
- [ ] **Mejora a Pro (Stripe)**: Todos los botones de "Conseguir Plan Pro", "Comenzar gratis", etc., navegan al `/login` o al `/pricing` y deben integrarse con el API de facturación (Checkout de Stripe).

## Asistente y Automatización
- [ ] **Chatbot IA**: La vista de "Asistente IA" y "Preguntarle a tus archivos" requerirá RAG (Retrieval-Augmented Generation). Esto implica guardar embeddings de cada documento subido y consultarlos.
- [ ] **Reglas de Automatización**: Flujos tipo zapier requerirán un cron job o webhooks (ej. Edge Functions reaccionando a un INSERT en la base de datos).

*Guarda este archivo en la memoria del proyecto para cuando el equipo de Backend comience a conectar componentes.*
