
import { useState } from 'react';
import axiosInstance from '../apiConfig/api'; 


export default function LoginForm({ onLogin }) {
  const [username, setUser] = useState('');
  const [password, setPass] = useState('');
  const [error, setError] = useState('');

  const login = async () => {
    setError('');
    if (!username || !password) {
      setError('Username and password are required.');
      return;
    }

    try {
      const res = await axiosInstance.post('/login', { username, password });
      onLogin(res.data.token);
    } catch (err) {
      setError('Login failed. Please check your credentials.');
    }
  };

  return (
    <div className="login-container">
      <h2>Login</h2>
      {error && <p className="error">{error}</p>}

      <input
        value={username}
        onChange={(e) => setUser(e.target.value)}
        placeholder="Username"
        className="input"
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPass(e.target.value)}
        placeholder="Password"
        className="input"
      />
      <button className="login-btn" onClick={login}>
        Login
      </button>
    </div>
  );
}
