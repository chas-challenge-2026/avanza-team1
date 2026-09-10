import { useState, useRef, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Login.module.css';
import { useAuth } from '../auth/useAuth';

function Login(): JSX.Element {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const { login } = useAuth();
  const navigate = useNavigate();
  const passwordInputRef = useRef<HTMLInputElement>(null);

  function handleSubmit(event: FormEvent): void {
    event.preventDefault();
    const success = login(email, password);

    if (success) {
      navigate('/');
    }
    else {
      setError('Fel e-post eller lösenord.');
      // Tillgänglighet: flyttar fokus tillbaka så tangentbords-/skärmläsarens
      // användare direkt hamnar där de troligen behöver rätta sig.
      passwordInputRef.current?.focus();
    }
  }

  return (
    <div className={styles.page}>
      <form className={styles.form} onSubmit={handleSubmit}>
        <h1 className={styles.title}>Portföljhälsa</h1>
        {error && (
          // role="alert" gör att skärmläsare läser upp felet automatiskt
          // så fort det renderas, utan att användaren behöver leta efter det.
          <p id="login-error" role="alert" className={styles.error}>
            {error}
          </p>
        )}
        <label className={styles.field}>
          E-post
          <input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
            aria-describedby={error ? 'login-error' : undefined}
          />
        </label>
        <label className={styles.field}>
          Lösenord
          <input
            ref={passwordInputRef}
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
            aria-describedby={error ? 'login-error' : undefined}
          />
        </label>
        <button type="submit" className={styles.button}>
          Logga in
        </button>
      </form>
    </div>
  );
}

export default Login;
