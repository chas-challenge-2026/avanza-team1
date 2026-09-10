import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Login.module.css';
import { useAuth } from '../auth/useAuth';

function Login(): JSX.Element {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const { login } = useAuth();
  const navigate = useNavigate();

  function handleSubmit(event: FormEvent): void {
    event.preventDefault();
    // anropa login(email, password) - samma funktion du redan byggt i AuthProvider
    const success = login(email, password);

    // om den lyckas
      if (success) {
        navigate('/');
      }

      // om den misslyckas
      else {
        setError('Fel e-post eller lösenord.');
      }
  }

  return (
    <div className={styles.page}>
      <form className={styles.form} onSubmit={handleSubmit}>
        <h1 className={styles.title}>Portföljhälsa</h1>
        {error && <p className={styles.error}>{error}</p>}
        <label className={styles.field}>
          E-post
          <input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />
        </label>
        <label className={styles.field}>
          Lösenord
          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
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
