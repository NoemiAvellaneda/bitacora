# Protección de datos y copias de seguridad

La aplicación conserva `app_state` en Supabase. Este cambio no requiere ejecutar SQL ni modifica datos al publicarse. Las pruebas usan datos inventados y no se conectan a Supabase.

## Guardado

- Una lectura fallida mantiene el guardado bloqueado. Una lectura sin fila permite crear una cuenta nueva mediante `insert`, nunca `upsert`.
- Abrir la aplicación no escribe en Supabase. La normalización y el arrastre de tareas se guardan con el siguiente cambio del usuario.
- Los cambios se agrupan durante 600 ms y se envían uno a uno. La pantalla indica cambios pendientes, guardando, guardado o error.
- Cada actualización exige la misma cuenta y el `updated_at` que se leyó o guardó anteriormente. Si otra sesión cambió esa versión, se detiene el guardado. El usuario descarga sus cambios y recarga; no se fusionan automáticamente.
- Si se pierde conexión, los cambios permanecen en pantalla, con un borrador local si el navegador permite guardarlo. El usuario puede descargar o reintentar; cerrar el navegador puede perder cambios si falló también la copia local.
- Se impide que una operación deje vacías todas las colecciones que antes tenían registros.
- La importación valida la estructura, pide confirmación y descarga el estado actual antes de reemplazarlo. La plantilla financiera y la copia del mes anterior también piden confirmación y descargan un respaldo si reemplazan movimientos existentes.

## Copias

IndexedDB guarda, por cuenta y navegador, la primera versión confirmada de cada día de uso, hasta 14 días distintos, además de la última versión confirmada. Un borrador pendiente se guarda separado y se elimina cuando se confirma exactamente esa versión. Al iniciar una nueva sesión se preserva el borrador anterior antes de reemplazarlo; se conservan hasta tres borradores de sesiones anteriores. Las copias se pueden descargar desde la aplicación, también desde la pantalla de error de carga cuando se pudo identificar la cuenta.

La primera copia del día no se reemplaza por ediciones posteriores. Las copias se crean al cargar datos confirmados o al confirmar un guardado; no hay un proceso que funcione con la aplicación cerrada. Si IndexedDB falla, se avisa y el guardado remoto sigue disponible.

Cada navegador recuerda la última descarga y avisa al abrir, recuperar foco o cada hora si han pasado siete días. El aviso requiere pulsar Descargar; no genera archivos ni copias externas sin intervención. Una descarga iniciada no permite saber si el usuario conservó el archivo.

Las copias locales no son un respaldo externo: borrar los datos del sitio, perder el dispositivo o la expulsión del almacenamiento por el navegador puede eliminarlas. Guarda los JSON descargados en dos ubicaciones, una fuera del dispositivo. El plan gratuito de Supabase no garantiza respaldos administrados. No se guardan respaldos personales, claves privadas ni datos de producción en GitHub.

## Validación antes de publicar

1. Ejecutar `npm ci`, `npm test` y `npm run build`.
2. Mantener un JSON externo reciente y comprobar que está completo.
3. Probar en un entorno separado con datos de ejemplo: carga fallida, falta de conexión, dos pestañas y conflicto, importación cancelada e inválida, descarga y recuperación de copias locales.
4. Probar en navegador móvil y escritorio. Las pruebas automatizadas de React y de IndexedDB no sustituyen estas comprobaciones visuales.
5. Tras publicar, cerrar o recargar todas las pestañas y dispositivos para retirar versiones anteriores que aún utilizan `upsert`. La protección por versión depende de que todos los clientes usen el nuevo guardado; tampoco impide escrituras externas hechas desde el panel o herramientas administrativas.

El almacenamiento sigue siendo una sola fila por cuenta: estas protecciones reducen riesgos, pero no sustituyen un historial de revisiones y respaldos independientes en el servidor. Ese nivel requiere una migración de base de datos y una política de respaldo externo que deben diseñarse y probarse por separado.
