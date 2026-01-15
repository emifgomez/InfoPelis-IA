export default function Search({ query, setQuery, type, setType }) {
  return (
    <div style={{ marginBottom: '30px', textAlign: 'center' }}>
      <div style={{ marginBottom: '15px' }}>
        <button 
          onClick={() => setType('movie')}
          style={{
            padding: '8px 20px',
            marginRight: '10px',
            borderRadius: '20px',
            border: 'none',
            backgroundColor: type === 'movie' ? '#e50914' : '#333',
            color: 'white',
            cursor: 'pointer',
            fontWeight: 'bold'
          }}
        >
          Películas
        </button>
        <button 
          onClick={() => setType('tv')}
          style={{
            padding: '8px 20px',
            borderRadius: '20px',
            border: 'none',
            backgroundColor: type === 'tv' ? '#e50914' : '#333',
            color: 'white',
            cursor: 'pointer',
            fontWeight: 'bold'
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
        style={{
          width: '80%',
          padding: '12px 20px',
          fontSize: '1.1rem',
          borderRadius: '25px',
          border: '2px solid #e0e0e0',
          outline: 'none',
          boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
        }}
      />
    </div>
  );
}