# Lumen Hermandades - Backend

## Introducción

Lumen Hermandades es una plataforma integral para la gestión de Hermandades de Semana Santa, abarcando áreas como Censo, Tesorería, Patrimonio y Comunicación.

## Arquitectura y Estilo de Código

### Modularidad
Cada funcionalidad se organiza en su propio módulo bajo `es.lumen.lumen_backend`:
- `hermano_modulo`: Gestión del censo de hermanos.
- `tesoreria_modulo`: Gestión financiera y cuotas.
- Otros módulos según necesidades.

### Patrón DTO
El uso de Data Transfer Objects (DTO) es obligatorio para la comunicación entre frontend y backend. Las entidades deben incluir constructores que mapeen directamente desde los DTOs correspondientes.

### Capa Service
La lógica de negocio se separa en interfaces y implementaciones:
- Interfaces en `services`.
- Implementaciones en `services.impl`.
- Los controladores nunca contienen lógica de negocio; delegan a los servicios.

## Tecnologías y Configuración

### JPA & Hibernate
Se utiliza JPA con Hibernate para la persistencia de datos. Las consultas personalizadas se implementan mediante anotaciones `@Query` en los repositorios.

### Seguridad (Próximamente)
Se implementará Spring Security con autenticación JWT para proteger los endpoints. Se definirán roles como Admin, Hermano y Junta.

### Validaciones
Se emplearán anotaciones de validación de Spring para asegurar la integridad de los datos en las entradas del sistema.

## Guía de Trabajo con Git

### Ramas
- **main**: Rama de producción. No se modifica directamente.
- **develop**: Rama de integración para fusionar características completadas.
- **feature/nombre-tarea**: Ramas para tareas individuales, creadas desde develop.

### Pull Requests
Antes de fusionar a develop, el código debe ser revisado por al menos un compañero y asegurar que compila correctamente.

## Instalación Rápida

1. Clonar el repositorio.
2. Configurar `application.properties` con los parámetros de base de datos.
3. Ejecutar `mvn install`.
4. Levantar la aplicación con `mvn spring-boot:run`.

## Ejemplo de Referencia
El módulo `hermano_modulo` está completamente implementado y sirve como plantilla para desarrollar nuevos módulos, siguiendo las mejores prácticas establecidas.