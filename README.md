# 🎬 Movie Explorer AI

Una plataforma interactiva para amantes del cine donde puedes gestionar tus favoritos, dejar reseñas y conversar con una inteligencia artificial experta en cada obra.

## 🚀 Características Principales
- **Integración con Mistral AI:** Chat contextual que conoce los detalles de la película que estás viendo.
- **Base de Datos con Supabase:** Autenticación de usuarios, almacenamiento de favoritos y reseñas en tiempo real.
- **TMDB API:** Consumo de datos actualizados sobre trailers, reparto y sinopsis.
- **Arquitectura Modular:** Componentes refactorizados para una alta mantenibilidad (`ChatIA`, `Reviews`, `Show`).

## 🛠️ Tecnologías utilizadas
- [React](https://reactjs.org/) + [Vite](https://vitejs.dev/)
- [Supabase](https://supabase.com/) (Base de datos y Auth)
- [Mistral AI API](https://mistral.ai/)
- [React Router Dom](https://reactrouter.com/)
- [CSS3](https://developer.mozilla.org/es/docs/Web/CSS) (Diseño responsivo y Dark Mode)

- Implementé un backend Serverless mediante Vercel Functions, permitiendo una comunicación segura con la API de Mistral AI y protegiendo las credenciales del lado del servidor.

## 🔧 Instalación
1. Clona el repositorio: `git clone https://github.com/TU_USUARIO/TU_REPO.git`
2. Instala las dependencias: `npm install`
3. Crea un archivo `.env` con tus credenciales:
   ```env
   TMDB_API_KEY=tu_llave
   MISTRAL_API_KEY=tu_llave
   SUPABASE_URL=tu_url
   SUPABASE_SERVICE_ROLE_KEY=tu_llave

Retos Técnicos y Soluciones

Gestión de Estado Asincrónico: Implementación de flujos de datos complejos integrando Mistral AI y TMDB, asegurando una experiencia de usuario fluida mediante estados de carga y manejo de errores.

Persistencia y Seguridad: Configuración de Supabase Auth y manejo de bases de datos relacionales para la gestión de perfiles de usuario, reseñas y listas de favoritos.

Optimización de Consultas: Consumo eficiente de APIs REST con filtrado dinámico de datos y renderizado condicional de componentes.

UI/UX Modular: Arquitectura basada en componentes reutilizables con CSS Modules/Custom Properties para soportar modo oscuro y diseño adaptable.
