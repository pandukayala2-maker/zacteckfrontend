import React, { useState, FormEvent } from 'react';
import { useData } from '../context/DataContext';
import { Lock, User, LogIn, ArrowLeft } from 'lucide-react';

interface LoginProps {
  onBackToCatalog: () => void;
}

export default function Login({ onBackToCatalog }: LoginProps) {
  const { login, settings } = useData();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setError('');

    const success = login(username, password);
    if (success) {
      // App will update view automatically
    } else {
      setError('Invalid username or password. Please try again.');
    }
  };

  return (
    <div style={styles.container}>
      <button onClick={onBackToCatalog} style={styles.backBtn} className="btn btn-secondary">
        <ArrowLeft size={16} /> Back to Catalog
      </button>

      <div style={styles.loginCard} className="glass-panel animate-fade-in">
        <div style={styles.header}>
          <div style={styles.logoBadge}>ZT</div>
          <h2 style={styles.title}>{settings.companyName}</h2>
          <p style={styles.subtitle}>Management Console Login</p>
        </div>

        {error && <div style={styles.errorAlert} className="animate-fade-in">{error}</div>}

        <form onSubmit={handleSubmit} style={styles.form}>
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <div style={styles.inputWrapper}>
              <User size={18} style={styles.inputIcon} />
              <input
                id="username"
                type="text"
                className="form-control"
                placeholder="Enter admin username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                style={styles.inputWithIcon}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <div style={styles.inputWrapper}>
              <Lock size={18} style={styles.inputIcon} />
              <input
                id="password"
                type="password"
                className="form-control"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={styles.inputWithIcon}
                required
              />
            </div>
          </div>

          <button type="submit" className="btn btn-primary" style={styles.submitBtn}>
            <LogIn size={18} /> Authenticate
          </button>
        </form>
        
        <div style={styles.hint}>
          <p>Default credentials: <code>admin</code> / <code>admin123</code></p>
        </div>
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    padding: '20px',
  },
  backBtn: {
    position: 'absolute',
    top: '20px',
    left: '20px',
    zIndex: 10,
  },
  loginCard: {
    width: '100%',
    maxWidth: '420px',
    padding: '40px 30px',
    textAlign: 'center',
  },
  header: {
    marginBottom: '30px',
  },
  logoBadge: {
    width: '56px',
    height: '56px',
    borderRadius: '12px',
    backgroundColor: 'var(--color-primary)',
    color: '#fff',
    fontSize: '1.5rem',
    fontWeight: '800',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '0 auto 16px auto',
    boxShadow: '0 0 20px var(--color-primary-glow)',
  },
  title: {
    fontSize: '1.5rem',
    marginBottom: '6px',
  },
  subtitle: {
    color: 'var(--color-text-secondary)',
    fontSize: '0.875rem',
  },
  errorAlert: {
    backgroundColor: 'rgba(239, 68, 68, 0.15)',
    border: '1px solid var(--color-danger)',
    color: '#f87171',
    padding: '12px',
    borderRadius: '8px',
    fontSize: '0.875rem',
    marginBottom: '20px',
    textAlign: 'left',
  },
  form: {
    textAlign: 'left',
  },
  inputWrapper: {
    position: 'relative',
  },
  inputIcon: {
    position: 'absolute',
    left: '14px',
    top: '50%',
    transform: 'translateY(-50%)',
    color: 'var(--color-text-muted)',
  },
  inputWithIcon: {
    paddingLeft: '44px',
  },
  submitBtn: {
    width: '100%',
    padding: '12px',
    marginTop: '10px',
  },
  hint: {
    marginTop: '24px',
    fontSize: '0.75rem',
    color: 'var(--color-text-muted)',
  }
};
