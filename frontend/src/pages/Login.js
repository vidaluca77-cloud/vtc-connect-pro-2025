import React, { useState } from 'react';
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  Alert,
  Link,
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { loginStart, loginSuccess, loginFailure } from '../store/authSlice';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector(state => state.auth);

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(loginStart());

    try {
      // Mock login for now - replace with real API call
      const mockUser = {
        id: '1',
        email: email,
        firstName: 'Jean',
        lastName: 'Martin'
      };
      const mockToken = 'mock-jwt-token-' + Date.now();

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      if (email === 'test@test.com' && password === 'password') {
        dispatch(loginSuccess({ user: mockUser, token: mockToken }));
        navigate('/dashboard');
      } else {
        dispatch(loginFailure('Email ou mot de passe incorrect'));
      }
    } catch (error) {
      dispatch(loginFailure('Erreur de connexion'));
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Paper elevation={3} sx={{ padding: 4, width: '100%' }}>
          <Typography component="h1" variant="h4" align="center" gutterBottom>
            VTC Connect Pro
          </Typography>
          <Typography variant="h6" align="center" color="textSecondary" gutterBottom>
            Connexion
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email"
              name="email"
              autoComplete="email"
              autoFocus
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Mot de passe"
              type="password"
              id="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              disabled={loading}
            >
              {loading ? 'Connexion...' : 'Se connecter'}
            </Button>
            <Box textAlign="center">
              <Link component={RouterLink} to="/register" variant="body2">
                Pas encore de compte ? S'inscrire
              </Link>
            </Box>
          </Box>

          <Box sx={{ mt: 3, p: 2, bgcolor: 'grey.100', borderRadius: 1 }}>
            <Typography variant="body2" color="textSecondary" align="center">
              <strong>Compte de test :</strong><br />
              Email: test@test.com<br />
              Mot de passe: password
            </Typography>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default Login;