import { useState, useEffect } from 'react';

export default function Search({ query, setQuery, type, setType }) {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const searchContainerStyle = {
    marginBottom: isMobile ? '20px' : '30px',
    textAlign: 'center'
  };

  const buttonContainerStyle = {
    marginBottom: '15px',
    display: 'flex',
    justifyContent: 'center',
    gap: isMobile ? '8px' : '10px'
  };

  const buttonStyle = {
    padding: isMobile ? '6px 15px' : '8px 20px',
    borderRadius: '20px',
    border: 'none',
    backgroundColor: type === 'movie' ? '#e50914' : '#333',
    color: 'white',
    cursor: 'pointer',
    fontWeight: 'bold',
    fontSize: isMobile ? '0.9rem' : '1rem'
  };

  const inputStyle = {
    width: isMobile ? '95%' : '80%',
    padding: isMobile ? '10px 15px' : '12px 20px',
    fontSize: isMobile ? '1rem' : '1.1rem',
    borderRadius: '25px',
    border: '2px solid #e0e0e0',
    outline: 'none',
    boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
    backgroundColor: '#2a2a2a',
    color: 'white',
    borderColor: '#444'
  };

  return (
    <div style={searchContainerStyle}>
      <div style={buttonContainerStyle}>
        <button 
          onClick={() => setType('movie')}
          style={{
            ...buttonStyle,
            backgroundColor: type === 'movie' ? '#e50914' : '#333'
          }}
        >
          Películas
        </button>
        <button 
          onClick={() => setType('tv')}
          style={{
            ...buttonStyle,
            backgroundColor: type === 'tv' ? '#e50914' : '#333'
          }}
        >
          Series
        </button>
      </div>

      <input
        type="text"
        placeholder={type === 'movie' ? "Busca una película..." : "Busca una serie..."}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        style={inputStyle}
      />
    </div>
  );
}