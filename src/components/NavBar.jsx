import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";

export default function Navbar({ toggleSidebars, isMobileSidebarOpen, setIsMobileSidebarOpen }) {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [scrolled, setScrolled] = useState(false);

  const handleLogoClick = () => {
    setSelectedGenre("");
    setType("movie");
    setPage(1);
  };

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);

    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => {
      window.removeEventListener("scroll", handleScroll);
      subscription.unsubscribe();
    };
  }, []);

  const handleAuth = async (type) => {
    if (!email || !password) return alert("Completa los campos");
    const { error } =
      type === "login"
        ? await supabase.auth.signInWithPassword({ email, password })
        : await supabase.auth.signUp({ email, password });
    if (error) alert(error.message);
    else {
      setEmail("");
      setPassword("");
    }
  };

  return (
    <nav
      style={{
        ...navStyle,
        backgroundColor: scrolled ? "rgba(0,0,0,0.95)" : "transparent",
        backdropFilter: scrolled ? "blur(10px)" : "none",
        borderBottom: scrolled ? "1px solid #333" : "none",
      }}
    >
      <div style={containerStyle}>
        <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
          <button
            className="hamburger-menu"
            onClick={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
            style={hamburgerStyle}
          >
            ☰
          </button>

          <Link to="/" style={logoStyle} onClick={handleLogoClick}>
            InfoPelis<span style={{ color: "white" }}>AI</span>
          </Link>

          <div className="nav-links-desktop" style={linksContainerStyle}>
            <Link to="/" style={linkStyle}>
              Inicio
            </Link>
            {user && (
              <Link to="/mi-lista" style={linkStyle}>
                Mi Lista
              </Link>
            )}
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          {user ? (
            <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
              <span className="user-email-nav" style={userDisplayStyle}>
                {user.is_anonymous ? "👤 Invitado" : user.email.split("@")[0]}
              </span>
              <button
                onClick={() => supabase.auth.signOut()}
                style={logoutBtnStyle}
              >
                Salir
              </button>
            </div>
          ) : (
            <div
              className="auth-container-nav"
              style={{ display: "flex", gap: "8px" }}
            >
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={inputStyle}
                className="nav-input"
              />
              <input
                type="password"
                placeholder="Pass"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={inputStyle}
                className="nav-input"
              />
              <button onClick={() => handleAuth("login")} style={loginBtnStyle}>
                Entrar
              </button>
              <button
                onClick={() => handleAuth("signup")}
                style={signupBtnStyle}
                className="signup-nav"
              >
                Unirse
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

const hamburgerStyle = {
  background: "none",
  border: "none",
  color: "white",
  fontSize: "24px",
  cursor: "pointer",
  display: "none",
  padding: "0",
  marginRight: "5px",
};

const navStyle = {
  height: "65px",
  display: "flex",
  alignItems: "center",
  position: "fixed",
  top: 0,
  left: 0,
  width: "100%",
  zIndex: 3000,
  transition: "all 0.3s ease",
  fontFamily: "system-ui, -apple-system, sans-serif",
};

const containerStyle = {
  width: "100%",
  maxWidth: "1200px",
  margin: "0 auto",
  padding: "0 20px",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
};

const logoStyle = {
  color: "#e50914",
  textDecoration: "none",
  fontSize: "22px",
  fontWeight: "900",
  letterSpacing: "-1px",
};
const linksContainerStyle = { display: "flex", gap: "20px" };
const linkStyle = {
  color: "#e5e5e5",
  textDecoration: "none",
  fontSize: "13px",
  fontWeight: "500",
};
const userDisplayStyle = {
  color: "#aaa",
  fontSize: "0.8rem",
  fontWeight: "bold",
};
const inputStyle = {
  backgroundColor: "rgba(255,255,255,0.08)",
  border: "1px solid #444",
  color: "white",
  padding: "5px 10px",
  borderRadius: "4px",
  fontSize: "12px",
  width: "110px",
  outline: "none",
};
const loginBtnStyle = {
  backgroundColor: "#e50914",
  color: "white",
  border: "none",
  padding: "6px 14px",
  borderRadius: "4px",
  fontWeight: "bold",
  cursor: "pointer",
  fontSize: "12px",
};
const signupBtnStyle = {
  backgroundColor: "#222",
  color: "white",
  border: "1px solid #444",
  padding: "6px 14px",
  borderRadius: "4px",
  fontWeight: "bold",
  cursor: "pointer",
  fontSize: "12px",
};
const logoutBtnStyle = {
  backgroundColor: "transparent",
  color: "#888",
  border: "1px solid #444",
  padding: "4px 10px",
  borderRadius: "4px",
  cursor: "pointer",
  fontSize: "11px",
};
