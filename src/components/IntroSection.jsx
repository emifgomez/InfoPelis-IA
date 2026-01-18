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
    borderRadius: '20px',
    padding: isMobile ? '25px 20px' : '35px 40px',
    margin: isMobile ? '20px 5px 30px 5px' : '20px auto 40px auto',
    maxWidth: isMobile ? '100%' : '900px',
    textAlign: 'center',
    border: '1px solid #333',
    boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
    position: 'relative',
    overflow: 'hidden'
  };

  const titleStyle = {
    fontSize: isMobile ? '1.5rem' : '2rem',
    fontWeight: '800',
    color: '#e50914',
    marginBottom: isMobile ? '15px' : '20px',
    lineHeight: '1.2',
    textShadow: '2px 2px 4px rgba(0,0,0,0.5)'
  };

  const subtitleStyle = {
    fontSize: isMobile ? '1rem' : '1.2rem',
    color: '#ffffff',
    marginBottom: isMobile ? '20px' : '25px',
    lineHeight: '1.6',
    fontWeight: '400'
  };

  const featuresStyle = {
    display: 'flex',
    justifyContent: 'center',
    gap: isMobile ? '10px' : '30px',
    flexWrap: 'wrap',
    marginBottom: isMobile ? '20px' : '30px'
  };

  const featureStyle = {
    backgroundColor: 'rgba(229, 9, 20, 0.1)',
    border: '1px solid rgba(229, 9, 20, 0.3)',
    borderRadius: '12px',
    padding: isMobile ? '10px 12px' : '15px 20px',
    minWidth: isMobile ? '100px' : '150px',
    textAlign: 'center',
    flex: isMobile ? '1' : 'auto'
  };

  const featureIconStyle = {
    fontSize: isMobile ? '1.5rem' : '2rem',
    marginBottom: '8px',
    display: 'block'
  };

  const featureTextStyle = {
    fontSize: isMobile ? '0.8rem' : '0.9rem',
    color: '#cccccc',
    fontWeight: '600',
    margin: 0
  };

  const ctaStyle = {
    fontSize: isMobile ? '0.9rem' : '1.1rem',
    color: '#ffffff',
    backgroundColor: 'rgba(229, 9, 20, 0.2)',
    border: '2px solid #e50914',
    borderRadius: '15px',
    padding: isMobile ? '15px 20px' : '20px 35px',
    fontWeight: '600',
    lineHeight: '1.5',
    position: 'relative',
    overflow: 'hidden'
  };

  const highlightStyle = {
    color: '#e50914',
    fontWeight: '700'
  };

  const aiIconStyle = {
    position: 'absolute',
    top: isMobile ? '-15px' : '-20px',
    right: isMobile ? '-15px' : '-20px',
    fontSize: isMobile ? '3rem' : '4rem',
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
        Obtén recomendaciones personalizadas, analiza tramas y debate sobre tus títulos favoritos.
      </p>

      <div style={featuresStyle}>
        <div style={featureStyle}>
          <span style={featureIconStyle}>💬</span>
          <p style={featureTextStyle}>Chat Inteligente</p>
        </div>
        <div style={featureStyle}>
          <span style={featureIconStyle}>🎯</span>
          <p style={featureTextStyle}>Recomendaciones</p>
        </div>
        <div style={featureStyle}>
          <span style={featureIconStyle}>🍿</span>
          <p style={featureTextStyle}>Análisis Crítico</p>
        </div>
      </div>

      <div style={ctaStyle}>
        <span style={highlightStyle}>💡 Tip Pro:</span> Haz clic en el botón 🤖 de la esquina inferior derecha 
        y pregunta sobre cualquier película o serie mientras navegas. Tu IA conoce todos los títulos!
      </div>
    </div>
  );
}