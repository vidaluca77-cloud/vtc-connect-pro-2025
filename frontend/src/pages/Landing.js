import React from 'react';
import {
  Container,
  Typography,
  Box,
  Button,
  Grid,
  Card,
  CardContent,
  CardActions,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import {
  DirectionsCar as CarIcon,
  AttachMoney as MoneyIcon,
  Schedule as ScheduleIcon,
  People as PeopleIcon,
  Star as StarIcon,
  TrendingUp as TrendingIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const Landing = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: <CarIcon color="primary" />,
      title: 'Gestion des courses',
      description: 'Organisez et suivez toutes vos courses VTC en temps réel'
    },
    {
      icon: <MoneyIcon color="primary" />,
      title: 'Gestion financière',
      description: 'Suivez vos revenus, commissions et paiements en un coup d\'œil'
    },
    {
      icon: <ScheduleIcon color="primary" />,
      title: 'Planning intelligent',
      description: 'Optimisez votre planning avec l\'IA pour maximiser vos revenus'
    },
    {
      icon: <PeopleIcon color="primary" />,
      title: 'Communauté VTC',
      description: 'Échangez avec d\'autres chauffeurs et partagez vos expériences'
    },
    {
      icon: <StarIcon color="primary" />,
      title: 'Système de notation',
      description: 'Améliorez votre service grâce aux retours clients'
    },
    {
      icon: <TrendingIcon color="primary" />,
      title: 'Analyses avancées',
      description: 'Analysez vos performances avec des statistiques détaillées'
    }
  ];

  const benefits = [
    'Interface intuitive et moderne',
    'Synchronisation en temps réel',
    'Notifications push intelligentes',
    'Support client 24/7',
    'Mises à jour régulières',
    'Sécurité des données garantie'
  ];

  return (
    <Box>
      {/* Hero Section */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%)',
          color: 'white',
          py: 8,
          textAlign: 'center'
        }}
      >
        <Container maxWidth="lg">
          <Typography variant="h2" component="h1" gutterBottom fontWeight="bold">
            VTC Connect Pro
          </Typography>
          <Typography variant="h5" sx={{ mb: 4, opacity: 0.9 }}>
            La plateforme tout-en-un pour les chauffeurs VTC
          </Typography>
          <Typography variant="body1" sx={{ mb: 4, fontSize: '1.2rem' }}>
            Gérez vos courses, optimisez vos revenus et développez votre activité 
            avec la solution VTC la plus complète du marché.
          </Typography>
          <Box sx={{ mt: 4 }}>
            <Button
              variant="contained"
              size="large"
              onClick={() => navigate('/register')}
              sx={{
                mr: 2,
                py: 1.5,
                px: 4,
                fontSize: '1.1rem',
                bgcolor: 'secondary.main',
                '&:hover': {
                  bgcolor: 'secondary.dark'
                }
              }}
            >
              Commencer gratuitement
            </Button>
            <Button
              variant="outlined"
              size="large"
              onClick={() => navigate('/login')}
              sx={{
                py: 1.5,
                px: 4,
                fontSize: '1.1rem',
                borderColor: 'white',
                color: 'white',
                '&:hover': {
                  borderColor: 'white',
                  bgcolor: 'rgba(255,255,255,0.1)'
                }
              }}
            >
              Se connecter
            </Button>
          </Box>
        </Container>
      </Box>

      {/* Features Section */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Typography variant="h3" component="h2" align="center" gutterBottom>
          Fonctionnalités
        </Typography>
        <Typography variant="body1" align="center" color="textSecondary" sx={{ mb: 6 }}>
          Découvrez tous les outils dont vous avez besoin pour réussir en tant que chauffeur VTC
        </Typography>
        
        <Grid container spacing={4}>
          {features.map((feature, index) => (
            <Grid item xs={12} md={6} lg={4} key={index}>
              <Card sx={{ height: '100%', textAlign: 'center', p: 2 }}>
                <CardContent>
                  <Box sx={{ mb: 2 }}>
                    {feature.icon}
                  </Box>
                  <Typography variant="h6" component="h3" gutterBottom>
                    {feature.title}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    {feature.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Benefits Section */}
      <Box sx={{ bgcolor: 'grey.50', py: 8 }}>
        <Container maxWidth="lg">
          <Grid container spacing={6} alignItems="center">
            <Grid item xs={12} md={6}>
              <Typography variant="h3" component="h2" gutterBottom>
                Pourquoi choisir VTC Connect Pro ?
              </Typography>
              <Typography variant="body1" color="textSecondary" sx={{ mb: 3 }}>
                Notre plateforme a été conçue par des chauffeurs VTC pour des chauffeurs VTC. 
                Nous comprenons vos besoins et défis quotidiens.
              </Typography>
              <List>
                {benefits.map((benefit, index) => (
                  <ListItem key={index} sx={{ pl: 0 }}>
                    <ListItemIcon>
                      <StarIcon color="primary" />
                    </ListItemIcon>
                    <ListItemText primary={benefit} />
                  </ListItem>
                ))}
              </List>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box
                sx={{
                  bgcolor: 'primary.main',
                  color: 'white',
                  p: 4,
                  borderRadius: 2,
                  textAlign: 'center'
                }}
              >
                <Typography variant="h4" gutterBottom>
                  Rejoignez plus de 5 000 chauffeurs
                </Typography>
                <Typography variant="body1" sx={{ mb: 3 }}>
                  Qui font déjà confiance à VTC Connect Pro pour gérer leur activité
                </Typography>
                <Button
                  variant="contained"
                  size="large"
                  onClick={() => navigate('/register')}
                  sx={{
                    bgcolor: 'secondary.main',
                    '&:hover': {
                      bgcolor: 'secondary.dark'
                    }
                  }}
                >
                  Inscription gratuite
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Footer */}
      <Box sx={{ bgcolor: 'grey.900', color: 'white', py: 4 }}>
        <Container maxWidth="lg">
          <Typography variant="body2" align="center">
            © 2025 VTC Connect Pro. Tous droits réservés.
          </Typography>
        </Container>
      </Box>
    </Box>
  );
};

export default Landing;