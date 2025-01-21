import React, { useState } from 'react';
import { 
  TextField,
  Button,
  Card,
  CardContent,
  Typography,
  Alert,
  InputAdornment,
  Box,
  Container
} from '@mui/material';
import { Person, Lock } from '@mui/icons-material';
import App from './App';

const Login = () => {
  // Stored credentials (in real applications, this would be handled by a backend)
  const storedCredentials = {
    username: "aiagent",
    password: "agenticAI123"
  };

  // State for form fields and authentication status
  const [credentials, setCredentials] = useState({
    username: "",
    password: ""
  });
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [error, setError] = useState("");

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials(prev => ({
      ...prev,
      [name]: value
    }));
    setError("");
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (credentials.username === storedCredentials.username && 
        credentials.password === storedCredentials.password) {
      setIsAuthenticated(true);
      setError("");
    } else {
      setError("Invalid username or password");
    }
  };

  // If authenticated, show the protected content
  if (isAuthenticated) {
    return (
      <App/>
    );
  }

  // Login form
  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: 'background.default',
        py: 3
      }}
    >
      <Container maxWidth="sm">
        <Card elevation={3}>
          <CardContent sx={{ p: 4 }}>
            <Typography variant="h4" component="h1" gutterBottom align="center">
              Login
            </Typography>
            
            <form onSubmit={handleSubmit}>
              <Box sx={{ mb: 3 }}>
                <TextField
                  fullWidth
                  required
                  name="username"
                  label="Username"
                  variant="outlined"
                  value={credentials.username}
                  onChange={handleChange}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Person />
                      </InputAdornment>
                    ),
                  }}
                />
              </Box>

              <Box sx={{ mb: 3 }}>
                <TextField
                  fullWidth
                  required
                  name="password"
                  label="Password"
                  type="password"
                  variant="outlined"
                  value={credentials.password}
                  onChange={handleChange}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Lock />
                      </InputAdornment>
                    ),
                  }}
                />
              </Box>

              {error && (
                <Box sx={{ mb: 3 }}>
                  <Alert severity="error">{error}</Alert>
                </Box>
              )}

              <Button
                type="submit"
                variant="contained"
                fullWidth
                size="large"
                sx={{ mt: 2 }}
              >
                Sign In
              </Button>
            </form>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
};

export default Login;