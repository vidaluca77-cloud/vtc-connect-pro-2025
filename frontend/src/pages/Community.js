import React, { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  Toolbar,
  Paper,
  Avatar,
  Button,
  TextField,
  Tab,
  Tabs,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Chip,
  Rating,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import {
  Add,
  Forum,
  People,
  Star,
  Message,
  Share,
  ThumbUp,
  Comment,
  More,
} from '@mui/icons-material';

const Community = () => {
  const [tabValue, setTabValue] = useState(0);
  const [openPostDialog, setOpenPostDialog] = useState(false);
  const [newPost, setNewPost] = useState('');
  const [posts, setPosts] = useState([]);
  const [drivers, setDrivers] = useState([]);

  useEffect(() => {
    // Mock data load
    setPosts([
      {
        id: 1,
        author: 'Jean Martin',
        avatar: 'JM',
        time: '2 heures',
        content: 'Excellente journée aujourd\'hui ! 8 courses et de super clients. Les Champs-Élysées étaient fluides ce matin.',
        likes: 12,
        comments: 3,
        rating: 5
      },
      {
        id: 2,
        author: 'Marie Dubois',
        avatar: 'MD',
        time: '4 heures',
        content: 'Attention aux travaux Porte de Clichy, embouteillages monstres ! Prévoir 20min de plus.',
        likes: 8,
        comments: 5,
        rating: null
      },
      {
        id: 3,
        author: 'Pierre Durand',
        avatar: 'PD',
        time: '6 heures',
        content: 'Question : quelqu\'un connaît un bon garage pour l\'entretien près de Roissy ? Merci !',
        likes: 3,
        comments: 7,
        rating: null
      }
    ]);

    setDrivers([
      {
        id: 1,
        name: 'Jean Martin',
        avatar: 'JM',
        rating: 4.9,
        rides: 156,
        location: 'Paris 16e',
        status: 'online'
      },
      {
        id: 2,
        name: 'Marie Dubois',
        avatar: 'MD',
        rating: 4.7,
        rides: 89,
        location: 'Paris 8e',
        status: 'online'
      },
      {
        id: 3,
        name: 'Pierre Durand',
        avatar: 'PD',
        rating: 4.5,
        rides: 203,
        location: 'Levallois',
        status: 'offline'
      },
      {
        id: 4,
        name: 'Sophie Bernard',
        avatar: 'SB',
        rating: 4.8,
        rides: 134,
        location: 'Paris 17e',
        status: 'online'
      }
    ]);
  }, []);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleNewPost = () => {
    if (newPost.trim()) {
      const post = {
        id: posts.length + 1,
        author: 'Vous',
        avatar: 'V',
        time: 'À l\'instant',
        content: newPost,
        likes: 0,
        comments: 0,
        rating: null
      };
      setPosts([post, ...posts]);
      setNewPost('');
      setOpenPostDialog(false);
    }
  };

  const handleLike = (postId) => {
    setPosts(posts.map(post => 
      post.id === postId 
        ? { ...post, likes: post.likes + 1 }
        : post
    ));
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Toolbar />
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" gutterBottom>
          Communauté VTC
        </Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => setOpenPostDialog(true)}
        >
          Nouveau post
        </Button>
      </Box>

      {/* Tabs */}
      <Paper sx={{ mb: 3 }}>
        <Tabs value={tabValue} onChange={handleTabChange} indicatorColor="primary">
          <Tab icon={<Forum />} label="Discussions" />
          <Tab icon={<People />} label="Chauffeurs" />
          <Tab icon={<Star />} label="Conseils" />
        </Tabs>
      </Paper>

      {/* Discussions Tab */}
      {tabValue === 0 && (
        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Fil d'actualité
              </Typography>
              {posts.map((post) => (
                <Card key={post.id} sx={{ mb: 2 }}>
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
                      <Avatar sx={{ mr: 2, bgcolor: 'primary.main' }}>
                        {post.avatar}
                      </Avatar>
                      <Box sx={{ flex: 1 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                          <Typography variant="subtitle1" fontWeight="bold">
                            {post.author}
                          </Typography>
                          <Typography variant="body2" color="textSecondary" sx={{ ml: 1 }}>
                            • {post.time}
                          </Typography>
                          {post.rating && (
                            <Box sx={{ ml: 2 }}>
                              <Rating value={post.rating} size="small" readOnly />
                            </Box>
                          )}
                        </Box>
                        <Typography variant="body1" paragraph>
                          {post.content}
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                          <Button
                            size="small"
                            startIcon={<ThumbUp />}
                            onClick={() => handleLike(post.id)}
                            color={post.likes > 0 ? 'primary' : 'inherit'}
                          >
                            {post.likes} J'aime
                          </Button>
                          <Button size="small" startIcon={<Comment />}>
                            {post.comments} Commentaires
                          </Button>
                          <Button size="small" startIcon={<Share />}>
                            Partager
                          </Button>
                        </Box>
                      </Box>
                      <IconButton size="small">
                        <More />
                      </IconButton>
                    </Box>
                  </CardContent>
                </Card>
              ))}
            </Paper>
          </Grid>
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Chauffeurs en ligne
              </Typography>
              <List>
                {drivers.filter(driver => driver.status === 'online').map((driver) => (
                  <ListItem key={driver.id}>
                    <ListItemAvatar>
                      <Avatar sx={{ bgcolor: 'success.main' }}>
                        {driver.avatar}
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={driver.name}
                      secondary={`${driver.location} • ${driver.rides} courses`}
                    />
                    <ListItemSecondaryAction>
                      <IconButton edge="end">
                        <Message />
                      </IconButton>
                    </ListItemSecondaryAction>
                  </ListItem>
                ))}
              </List>
            </Paper>
          </Grid>
        </Grid>
      )}

      {/* Drivers Tab */}
      {tabValue === 1 && (
        <Grid container spacing={3}>
          {drivers.map((driver) => (
            <Grid item xs={12} sm={6} md={4} key={driver.id}>
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Avatar 
                      sx={{ 
                        mr: 2, 
                        bgcolor: driver.status === 'online' ? 'success.main' : 'grey.500',
                        width: 56,
                        height: 56
                      }}
                    >
                      {driver.avatar}
                    </Avatar>
                    <Box>
                      <Typography variant="h6">
                        {driver.name}
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        {driver.location}
                      </Typography>
                      <Chip
                        label={driver.status === 'online' ? 'En ligne' : 'Hors ligne'}
                        color={driver.status === 'online' ? 'success' : 'default'}
                        size="small"
                        sx={{ mt: 1 }}
                      />
                    </Box>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                    <Box>
                      <Typography variant="body2" color="textSecondary">
                        Note
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Star sx={{ color: 'gold', fontSize: 16, mr: 0.5 }} />
                        <Typography variant="body1" fontWeight="bold">
                          {driver.rating}
                        </Typography>
                      </Box>
                    </Box>
                    <Box>
                      <Typography variant="body2" color="textSecondary">
                        Courses
                      </Typography>
                      <Typography variant="body1" fontWeight="bold">
                        {driver.rides}
                      </Typography>
                    </Box>
                  </Box>
                  <Button variant="outlined" fullWidth startIcon={<Message />}>
                    Contacter
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Tips Tab */}
      {tabValue === 2 && (
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Conseils et bonnes pratiques
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <Card variant="outlined">
                    <CardContent>
                      <Typography variant="h6" gutterBottom color="primary">
                        Optimiser ses revenus
                      </Typography>
                      <List dense>
                        <ListItem>
                          <ListItemText primary="Travailler aux heures de pointe" />
                        </ListItem>
                        <ListItem>
                          <ListItemText primary="Cibler les zones d'affaires" />
                        </ListItem>
                        <ListItem>
                          <ListItemText primary="Surveiller les événements locaux" />
                        </ListItem>
                        <ListItem>
                          <ListItemText primary="Maintenir une note élevée" />
                        </ListItem>
                      </List>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Card variant="outlined">
                    <CardContent>
                      <Typography variant="h6" gutterBottom color="success.main">
                        Satisfaction client
                      </Typography>
                      <List dense>
                        <ListItem>
                          <ListItemText primary="Véhicule propre et confortable" />
                        </ListItem>
                        <ListItem>
                          <ListItemText primary="Ponctualité et professionnalisme" />
                        </ListItem>
                        <ListItem>
                          <ListItemText primary="Connaissance des itinéraires" />
                        </ListItem>
                        <ListItem>
                          <ListItemText primary="Communication courtoise" />
                        </ListItem>
                      </List>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Card variant="outlined">
                    <CardContent>
                      <Typography variant="h6" gutterBottom color="warning.main">
                        Sécurité
                      </Typography>
                      <List dense>
                        <ListItem>
                          <ListItemText primary="Respect du code de la route" />
                        </ListItem>
                        <ListItem>
                          <ListItemText primary="Pauses régulières" />
                        </ListItem>
                        <ListItem>
                          <ListItemText primary="Contrôle technique à jour" />
                        </ListItem>
                        <ListItem>
                          <ListItemText primary="Assurance professionnelle" />
                        </ListItem>
                      </List>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Card variant="outlined">
                    <CardContent>
                      <Typography variant="h6" gutterBottom color="info.main">
                        Gestion financière
                      </Typography>
                      <List dense>
                        <ListItem>
                          <ListItemText primary="Tenir un registre des dépenses" />
                        </ListItem>
                        <ListItem>
                          <ListItemText primary="Épargner pour les imprévus" />
                        </ListItem>
                        <ListItem>
                          <ListItemText primary="Optimiser les frais déductibles" />
                        </ListItem>
                        <ListItem>
                          <ListItemText primary="Planifier sa retraite" />
                        </ListItem>
                      </List>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            </Paper>
          </Grid>
        </Grid>
      )}

      {/* New Post Dialog */}
      <Dialog open={openPostDialog} onClose={() => setOpenPostDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Nouveau post</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            multiline
            rows={4}
            placeholder="Partagez vos expériences, conseils ou questions avec la communauté..."
            value={newPost}
            onChange={(e) => setNewPost(e.target.value)}
            sx={{ mt: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenPostDialog(false)}>
            Annuler
          </Button>
          <Button onClick={handleNewPost} variant="contained" disabled={!newPost.trim()}>
            Publier
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Community;