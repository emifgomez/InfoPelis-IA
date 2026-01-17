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

## 🔧 Instalación
1. Clona el repositorio: `git clone https://github.com/TU_USUARIO/TU_REPO.git`
2. Instala las dependencias: `npm install`
3. Crea un archivo `.env` con tus credenciales:
   ```env
   VITE_TMDB_KEY=tu_llave
   VITE_MISTRAL_KEY=tu_llave
   VITE_SUPABASE_URL=tu_url
   VITE_SUPABASE_ANON_KEY=tu_llave
