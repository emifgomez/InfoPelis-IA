import { useState, useEffect } from 'react';

export default function IntroSection() {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const introStyle = {
    backgroundColor: 'linear-gradient(135deg, #1f1f1f 0%, #2a2a2a 100%)',
    borderRadius: '15px',
    padding: isMobile ? '15px 15px' : '20px 30px',
    margin: isMobile ? '15px 5px 20px 5px' : '15px auto 25px auto',
    maxWidth: isMobile ? '100%' : '800px',
    textAlign: 'center',
    border: '1px solid #333',
    boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
    position: 'relative',
    overflow: 'hidden'
  };

  const titleStyle = {
    fontSize: isMobile ? '1.3rem' : '1.8rem',
    fontWeight: '700',
    color: '#e50914',
    marginBottom: isMobile ? '10px' : '15px',
    lineHeight: '1.2',
    textShadow: '2px 2px 4px rgba(0,0,0,0.5)'
  };

  const subtitleStyle = {
    fontSize: isMobile ? '0.9rem' : '1rem',
    color: '#ffffff',
    marginBottom: isMobile ? '15px' : '20px',
    lineHeight: '1.5',
    fontWeight: '400'
  };

  const ctaStyle = {
    fontSize: isMobile ? '0.8rem' : '0.95rem',
    color: '#ffffff',
    backgroundColor: 'rgba(229, 9, 20, 0.2)',
    border: '2px solid #e50914',
    borderRadius: '12px',
    padding: isMobile ? '12px 15px' : '15px 25px',
    fontWeight: '600',
    lineHeight: '1.4',
    position: 'relative',
    overflow: 'hidden'
  };

  const highlightStyle = {
    color: '#e50914',
    fontWeight: '700'
  };

  const aiIconStyle = {
    position: 'absolute',
    top: isMobile ? '-10px' : '-15px',
    right: isMobile ? '-10px' : '-15px',
    fontSize: isMobile ? '2.5rem' : '3rem',
    opacity: '0.1',
    transform: 'rotate(-15deg)'
  };

  return (
    <div style={introStyle}>
      <span style={aiIconStyle}>🤖</span>
      
      <h2 style={titleStyle}>
        Tu Experto Cinefilo IA te Espera
      </h2>
      
      <p style={subtitleStyle}>
        Descubre películas y series mientras conversas con tu asistente especialista en cine. 
        Obtén recomendaciones personalizadas y debate sobre tus títulos favoritos.
      </p>

      <div style={ctaStyle}>
        <span style={highlightStyle}>💡 Tip:</span> Haz clic en el botón 🤖 de la esquina inferior derecha 
        y pregunta sobre cualquier película o serie mientras navegas.
      </div>
    </div>
  );
}