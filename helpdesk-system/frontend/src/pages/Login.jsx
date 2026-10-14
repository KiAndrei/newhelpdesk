import { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import Alert from '../components/Alert.jsx';
import { TicketIcon } from '../components/Icons.jsx';

export default function Login() {
  const { isAuthenticated, login } = useAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState('');

  if (isAuthenticated) return <Navigate to="/tickets" replace />;

  const handleSubmit = (e) => {
    e.preventDefault();
    const next = {};
    if (!username) next.username = 'Username is required.';
    if (!password) next.password = 'Password is required.';
    if (Object.keys(next).length) {
      setErrors(next);
      setFormError('');
      return;
    }

    const result = login(username, password);
    if (result.ok) {
      navigate('/tickets', { replace: true });
      return;
    }
    setErrors({
      username: result.usernameError,
      password: result.passwordError,
    });
    setFormError('Login failed. Please check your credentials and try again.');
  };

  return (
    <div className="login-page">
      <form className="card login-card" onSubmit={handleSubmit} noValidate>
        <div className="login-brand">
          <TicketIcon width={30} height={30} />
          <h1>IT Helpdesk</h1>
          <p>Sign in to manage support tickets</p>
        </div>

        <Alert type="error">{formError}</Alert>

        <div className={`field ${errors.username ? 'has-error' : ''}`}>
          <label htmlFor="username">Username</label>
          <input
            id="username"
            type="text"
            autoComplete="username"
            value={username}
            onChange={(e) => {
              setUsername(e.target.value);
              setErrors((p) => ({ ...p, username: '' }));
            }}
          />
          {errors.username && <p className="field-error">{errors.username}</p>}
        </div>

        <div className={`field ${errors.password ? 'has-error' : ''}`}>
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setErrors((p) => ({ ...p, password: '' }));
            }}
          />
          {errors.password && <p className="field-error">{errors.password}</p>}
        </div>

        <button type="submit" className="btn btn-primary btn-block">
          Login
        </button>
      </form>
    </div>
  );
}
