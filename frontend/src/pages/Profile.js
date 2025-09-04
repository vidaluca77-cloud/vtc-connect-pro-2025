import React, { useState } from 'react';
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
  Switch,
  FormControlLabel,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
} from '@mui/material';
import {
  Person,
  Security,
  Notifications,
  Payment,
  Edit,
  Save,
  DirectionsCar,
  Star,
  Phone,
  Email,
  Badge,
  Settings,
} from '@mui/icons-material';
import { useSelector } from 'react-redux';

const Profile = () => {
  const [tabValue, setTabValue] = useState(0);
  const [editing, setEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    firstName: 'Jean',
    lastName: 'Martin',
    email: 'jean.martin@email.com',
    phone: '+33 1 23 45 67 89',
    vtcLicense: 'VTC001234',
    address: '123 Avenue des Champs-Élysées, 75008 Paris',
    vehicleModel: 'Mercedes Classe E',
    vehicleYear: '2021',
    vehiclePlate: 'AB-123-CD'
  });

  const [settings, setSettings] = useState({
    notifications: {
      email: true,
      push: true,
      sms: false,
      rideRequests: true,
      paymentAlerts: true,
      communityUpdates: false
    },
    privacy: {
      profileVisible: true,
      ratingVisible: true,
      statsVisible: false
    }
  });

  const user = useSelector(state => state.auth.user);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleEditToggle = () => {
    setEditing(!editing);
  };

  const handleSave = () => {
    // Save profile data
    console.log('Saving profile data:', profileData);
    setEditing(false);
  };

  const handleProfileChange = (field, value) => {
    setProfileData({
      ...profileData,
      [field]: value
    });
  };

  const handleSettingChange = (category, setting, value) => {
    setSettings({
      ...settings,
      [category]: {
        ...settings[category],
        [setting]: value
      }
    });
  };

  const stats = {
    totalRides: 156,
    rating: 4.8,
    totalEarnings: 12850.50,
    memberSince: 'Janvier 2023'
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Toolbar />
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" gutterBottom>
          Profil
        </Typography>
        <Button
          variant={editing ? "contained" : "outlined"}
          startIcon={editing ? <Save /> : <Edit />}
          onClick={editing ? handleSave : handleEditToggle}
        >
          {editing ? 'Sauvegarder' : 'Modifier'}
        </Button>
      </Box>

      <Grid container spacing={3}>
        {/* Profile Header */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Avatar 
                sx={{ 
                  width: 80, 
                  height: 80, 
                  bgcolor: 'primary.main',
                  fontSize: '2rem',
                  mr: 3
                }}
              >
                {profileData.firstName.charAt(0)}{profileData.lastName.charAt(0)}
              </Avatar>
              <Box sx={{ flex: 1 }}>
                <Typography variant="h5" gutterBottom>
                  {profileData.firstName} {profileData.lastName}
                </Typography>
                <Typography variant="body1" color="textSecondary" gutterBottom>
                  Chauffeur VTC • Licence {profileData.vtcLicense}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, mt: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <DirectionsCar sx={{ mr: 1, color: 'primary.main' }} />
                    <Typography variant="body2">
                      {stats.totalRides} courses
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Star sx={{ mr: 1, color: 'gold' }} />
                    <Typography variant="body2">
                      {stats.rating}/5
                    </Typography>
                  </Box>
                  <Typography variant="body2" color="textSecondary">
                    Membre depuis {stats.memberSince}
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Paper>
        </Grid>

        {/* Tabs */}
        <Grid item xs={12}>
          <Paper>
            <Tabs value={tabValue} onChange={handleTabChange} indicatorColor="primary">
              <Tab icon={<Person />} label="Informations personnelles" />
              <Tab icon={<Notifications />} label="Notifications" />
              <Tab icon={<Security />} label="Sécurité" />
              <Tab icon={<Payment />} label="Paiements" />
            </Tabs>
          </Paper>
        </Grid>

        {/* Personal Information Tab */}
        {tabValue === 0 && (
          <Grid item xs={12}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Informations personnelles
              </Typography>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Prénom"
                    value={profileData.firstName}
                    onChange={(e) => handleProfileChange('firstName', e.target.value)}
                    disabled={!editing}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Nom"
                    value={profileData.lastName}
                    onChange={(e) => handleProfileChange('lastName', e.target.value)}
                    disabled={!editing}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Email"
                    type="email"
                    value={profileData.email}
                    onChange={(e) => handleProfileChange('email', e.target.value)}
                    disabled={!editing}
                    InputProps={{
                      startAdornment: <Email sx={{ mr: 1, color: 'action.active' }} />
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Téléphone"
                    value={profileData.phone}
                    onChange={(e) => handleProfileChange('phone', e.target.value)}
                    disabled={!editing}
                    InputProps={{
                      startAdornment: <Phone sx={{ mr: 1, color: 'action.active' }} />
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Licence VTC"
                    value={profileData.vtcLicense}
                    onChange={(e) => handleProfileChange('vtcLicense', e.target.value)}
                    disabled={!editing}
                    InputProps={{
                      startAdornment: <Badge sx={{ mr: 1, color: 'action.active' }} />
                    }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Adresse"
                    value={profileData.address}
                    onChange={(e) => handleProfileChange('address', e.target.value)}
                    disabled={!editing}
                  />
                </Grid>
              </Grid>

              <Divider sx={{ my: 3 }} />

              <Typography variant="h6" gutterBottom>
                Véhicule
              </Typography>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={4}>
                  <TextField
                    fullWidth
                    label="Modèle"
                    value={profileData.vehicleModel}
                    onChange={(e) => handleProfileChange('vehicleModel', e.target.value)}
                    disabled={!editing}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField
                    fullWidth
                    label="Année"
                    value={profileData.vehicleYear}
                    onChange={(e) => handleProfileChange('vehicleYear', e.target.value)}
                    disabled={!editing}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField
                    fullWidth
                    label="Plaque d'immatriculation"
                    value={profileData.vehiclePlate}
                    onChange={(e) => handleProfileChange('vehiclePlate', e.target.value)}
                    disabled={!editing}
                  />
                </Grid>
              </Grid>
            </Paper>
          </Grid>
        )}

        {/* Notifications Tab */}
        {tabValue === 1 && (
          <Grid item xs={12}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Préférences de notification
              </Typography>
              <List>
                <ListItem>
                  <ListItemIcon>
                    <Email />
                  </ListItemIcon>
                  <ListItemText
                    primary="Notifications par email"
                    secondary="Recevoir les notifications importantes par email"
                  />
                  <ListItemSecondaryAction>
                    <Switch
                      checked={settings.notifications.email}
                      onChange={(e) => handleSettingChange('notifications', 'email', e.target.checked)}
                    />
                  </ListItemSecondaryAction>
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <Notifications />
                  </ListItemIcon>
                  <ListItemText
                    primary="Notifications push"
                    secondary="Recevoir les notifications push sur votre appareil"
                  />
                  <ListItemSecondaryAction>
                    <Switch
                      checked={settings.notifications.push}
                      onChange={(e) => handleSettingChange('notifications', 'push', e.target.checked)}
                    />
                  </ListItemSecondaryAction>
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <Phone />
                  </ListItemIcon>
                  <ListItemText
                    primary="Notifications SMS"
                    secondary="Recevoir les notifications urgentes par SMS"
                  />
                  <ListItemSecondaryAction>
                    <Switch
                      checked={settings.notifications.sms}
                      onChange={(e) => handleSettingChange('notifications', 'sms', e.target.checked)}
                    />
                  </ListItemSecondaryAction>
                </ListItem>

                <Divider sx={{ my: 2 }} />

                <ListItem>
                  <ListItemIcon>
                    <DirectionsCar />
                  </ListItemIcon>
                  <ListItemText
                    primary="Demandes de course"
                    secondary="Notifications pour les nouvelles demandes de course"
                  />
                  <ListItemSecondaryAction>
                    <Switch
                      checked={settings.notifications.rideRequests}
                      onChange={(e) => handleSettingChange('notifications', 'rideRequests', e.target.checked)}
                    />
                  </ListItemSecondaryAction>
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <Payment />
                  </ListItemIcon>
                  <ListItemText
                    primary="Alertes de paiement"
                    secondary="Notifications pour les paiements reçus et les problèmes"
                  />
                  <ListItemSecondaryAction>
                    <Switch
                      checked={settings.notifications.paymentAlerts}
                      onChange={(e) => handleSettingChange('notifications', 'paymentAlerts', e.target.checked)}
                    />
                  </ListItemSecondaryAction>
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <Person />
                  </ListItemIcon>
                  <ListItemText
                    primary="Mises à jour communauté"
                    secondary="Notifications sur l'activité de la communauté"
                  />
                  <ListItemSecondaryAction>
                    <Switch
                      checked={settings.notifications.communityUpdates}
                      onChange={(e) => handleSettingChange('notifications', 'communityUpdates', e.target.checked)}
                    />
                  </ListItemSecondaryAction>
                </ListItem>
              </List>
            </Paper>
          </Grid>
        )}

        {/* Security Tab */}
        {tabValue === 2 && (
          <Grid item xs={12}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Sécurité et confidentialité
              </Typography>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <Card variant="outlined">
                    <CardContent>
                      <Typography variant="subtitle1" gutterBottom>
                        Changer le mot de passe
                      </Typography>
                      <Grid container spacing={2}>
                        <Grid item xs={12}>
                          <TextField
                            fullWidth
                            type="password"
                            label="Mot de passe actuel"
                            margin="normal"
                          />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <TextField
                            fullWidth
                            type="password"
                            label="Nouveau mot de passe"
                            margin="normal"
                          />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <TextField
                            fullWidth
                            type="password"
                            label="Confirmer le mot de passe"
                            margin="normal"
                          />
                        </Grid>
                        <Grid item xs={12}>
                          <Button variant="contained" sx={{ mt: 1 }}>
                            Mettre à jour le mot de passe
                          </Button>
                        </Grid>
                      </Grid>
                    </CardContent>
                  </Card>
                </Grid>

                <Grid item xs={12}>
                  <Card variant="outlined">
                    <CardContent>
                      <Typography variant="subtitle1" gutterBottom>
                        Confidentialité
                      </Typography>
                      <List>
                        <ListItem>
                          <ListItemText
                            primary="Profil visible dans la communauté"
                            secondary="Permettre aux autres chauffeurs de voir votre profil"
                          />
                          <ListItemSecondaryAction>
                            <Switch
                              checked={settings.privacy.profileVisible}
                              onChange={(e) => handleSettingChange('privacy', 'profileVisible', e.target.checked)}
                            />
                          </ListItemSecondaryAction>
                        </ListItem>
                        <ListItem>
                          <ListItemText
                            primary="Note visible"
                            secondary="Afficher votre note moyenne publiquement"
                          />
                          <ListItemSecondaryAction>
                            <Switch
                              checked={settings.privacy.ratingVisible}
                              onChange={(e) => handleSettingChange('privacy', 'ratingVisible', e.target.checked)}
                            />
                          </ListItemSecondaryAction>
                        </ListItem>
                        <ListItem>
                          <ListItemText
                            primary="Statistiques visibles"
                            secondary="Partager vos statistiques de course avec la communauté"
                          />
                          <ListItemSecondaryAction>
                            <Switch
                              checked={settings.privacy.statsVisible}
                              onChange={(e) => handleSettingChange('privacy', 'statsVisible', e.target.checked)}
                            />
                          </ListItemSecondaryAction>
                        </ListItem>
                      </List>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            </Paper>
          </Grid>
        )}

        {/* Payments Tab */}
        {tabValue === 3 && (
          <Grid item xs={12}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Méthodes de paiement
              </Typography>
              <Typography variant="body2" color="textSecondary" paragraph>
                Gérez vos méthodes de paiement pour recevoir vos revenus
              </Typography>
              
              <Card variant="outlined" sx={{ mb: 2 }}>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box>
                      <Typography variant="subtitle1">
                        Compte bancaire principal
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        IBAN: FR76 **** **** **** **** **34
                      </Typography>
                    </Box>
                    <Button variant="outlined" size="small">
                      Modifier
                    </Button>
                  </Box>
                </CardContent>
              </Card>

              <Button variant="contained" startIcon={<Add />} sx={{ mb: 3 }}>
                Ajouter un compte bancaire
              </Button>

              <Divider sx={{ mb: 3 }} />

              <Typography variant="h6" gutterBottom>
                Historique des paiements
              </Typography>
              <Box sx={{ textAlign: 'center', py: 4 }}>
                <Typography variant="body1" color="textSecondary">
                  Vos paiements récents apparaîtront ici
                </Typography>
              </Box>
            </Paper>
          </Grid>
        )}
      </Grid>
    </Container>
  );
};

export default Profile;