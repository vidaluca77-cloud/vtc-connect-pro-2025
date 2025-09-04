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
  Calendar,
  Button,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import {
  Add,
  Schedule,
  LocationOn,
  AttachMoney,
  Edit,
  Delete,
} from '@mui/icons-material';

const Planning = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [openDialog, setOpenDialog] = useState(false);
  const [rides, setRides] = useState([]);
  const [newRide, setNewRide] = useState({
    date: '',
    time: '',
    pickup: '',
    destination: '',
    customerName: '',
    price: '',
    status: 'scheduled'
  });

  useEffect(() => {
    // Mock data load
    setRides([
      {
        id: 1,
        date: new Date(),
        time: '09:00',
        pickup: 'Paris CDG',
        destination: '16e Arrondissement',
        customerName: 'M. Dupont',
        price: 85.50,
        status: 'scheduled'
      },
      {
        id: 2,
        date: new Date(Date.now() + 86400000),
        time: '14:30',
        pickup: 'Gare du Nord',
        destination: 'La Défense',
        customerName: 'Mme Martin',
        price: 45.00,
        status: 'scheduled'
      },
      {
        id: 3,
        date: new Date(Date.now() + 2 * 86400000),
        time: '11:15',
        pickup: 'Orly Airport',
        destination: 'Champs-Élysées',
        customerName: 'M. Bernard',
        price: 75.00,
        status: 'scheduled'
      }
    ]);
  }, []);

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  const handleAddRide = () => {
    setOpenDialog(true);
    setNewRide({
      date: selectedDate.toISOString().split('T')[0],
      time: '',
      pickup: '',
      destination: '',
      customerName: '',
      price: '',
      status: 'scheduled'
    });
  };

  const handleSaveRide = () => {
    const ride = {
      ...newRide,
      id: rides.length + 1,
      date: new Date(newRide.date),
      price: parseFloat(newRide.price)
    };
    setRides([...rides, ride]);
    setOpenDialog(false);
  };

  const handleDeleteRide = (rideId) => {
    setRides(rides.filter(ride => ride.id !== rideId));
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'scheduled':
        return 'primary';
      case 'in_progress':
        return 'warning';
      case 'completed':
        return 'success';
      case 'cancelled':
        return 'error';
      default:
        return 'default';
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'scheduled':
        return 'Programmé';
      case 'in_progress':
        return 'En cours';
      case 'completed':
        return 'Terminé';
      case 'cancelled':
        return 'Annulé';
      default:
        return status;
    }
  };

  const todayRides = rides.filter(ride => 
    ride.date.toDateString() === new Date().toDateString()
  );

  const upcomingRides = rides.filter(ride => 
    ride.date > new Date() && ride.date.toDateString() !== new Date().toDateString()
  );

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Toolbar />
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" gutterBottom>
          Planning
        </Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={handleAddRide}
        >
          Ajouter une course
        </Button>
      </Box>

      <Grid container spacing={3}>
        {/* Today's Rides */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Courses d'aujourd'hui
            </Typography>
            {todayRides.length > 0 ? (
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {todayRides.map((ride) => (
                  <Card key={ride.id} variant="outlined">
                    <CardContent>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <Box sx={{ flex: 1 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                            <Schedule sx={{ mr: 1, fontSize: 16 }} />
                            <Typography variant="body2" fontWeight="bold">
                              {ride.time}
                            </Typography>
                            <Chip
                              label={getStatusLabel(ride.status)}
                              color={getStatusColor(ride.status)}
                              size="small"
                              sx={{ ml: 2 }}
                            />
                          </Box>
                          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                            <LocationOn sx={{ mr: 1, fontSize: 16 }} />
                            <Typography variant="body2">
                              {ride.pickup} → {ride.destination}
                            </Typography>
                          </Box>
                          <Typography variant="body2" color="textSecondary">
                            Client: {ride.customerName}
                          </Typography>
                          <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                            <AttachMoney sx={{ mr: 1, fontSize: 16 }} />
                            <Typography variant="body2" fontWeight="bold" color="primary">
                              {ride.price}€
                            </Typography>
                          </Box>
                        </Box>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                          <Button size="small" startIcon={<Edit />}>
                            Modifier
                          </Button>
                          <Button 
                            size="small" 
                            color="error" 
                            startIcon={<Delete />}
                            onClick={() => handleDeleteRide(ride.id)}
                          >
                            Supprimer
                          </Button>
                        </Box>
                      </Box>
                    </CardContent>
                  </Card>
                ))}
              </Box>
            ) : (
              <Typography color="textSecondary">
                Aucune course programmée pour aujourd'hui
              </Typography>
            )}
          </Paper>
        </Grid>

        {/* Upcoming Rides */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Prochaines courses
            </Typography>
            {upcomingRides.length > 0 ? (
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {upcomingRides.slice(0, 5).map((ride) => (
                  <Card key={ride.id} variant="outlined">
                    <CardContent>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <Box sx={{ flex: 1 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                            <Schedule sx={{ mr: 1, fontSize: 16 }} />
                            <Typography variant="body2" fontWeight="bold">
                              {ride.date.toLocaleDateString('fr-FR')} à {ride.time}
                            </Typography>
                          </Box>
                          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                            <LocationOn sx={{ mr: 1, fontSize: 16 }} />
                            <Typography variant="body2">
                              {ride.pickup} → {ride.destination}
                            </Typography>
                          </Box>
                          <Typography variant="body2" color="textSecondary">
                            Client: {ride.customerName}
                          </Typography>
                          <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                            <AttachMoney sx={{ mr: 1, fontSize: 16 }} />
                            <Typography variant="body2" fontWeight="bold" color="primary">
                              {ride.price}€
                            </Typography>
                          </Box>
                        </Box>
                        <Chip
                          label={getStatusLabel(ride.status)}
                          color={getStatusColor(ride.status)}
                          size="small"
                        />
                      </Box>
                    </CardContent>
                  </Card>
                ))}
              </Box>
            ) : (
              <Typography color="textSecondary">
                Aucune course programmée
              </Typography>
            )}
          </Paper>
        </Grid>

        {/* Weekly Summary */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Résumé de la semaine
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} md={3}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h4" color="primary">
                    {rides.length}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Courses programmées
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} md={3}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h4" color="success.main">
                    {rides.reduce((sum, ride) => sum + ride.price, 0).toFixed(2)}€
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Revenus prévus
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} md={3}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h4" color="info.main">
                    {Math.round(rides.reduce((sum, ride) => sum + ride.price, 0) / rides.length) || 0}€
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Tarif moyen
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} md={3}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h4" color="warning.main">
                    {rides.filter(ride => ride.status === 'scheduled').length}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    En attente
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      </Grid>

      {/* Add Ride Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Ajouter une course</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Date"
                type="date"
                value={newRide.date}
                onChange={(e) => setNewRide({ ...newRide, date: e.target.value })}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Heure"
                type="time"
                value={newRide.time}
                onChange={(e) => setNewRide({ ...newRide, time: e.target.value })}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Lieu de prise en charge"
                value={newRide.pickup}
                onChange={(e) => setNewRide({ ...newRide, pickup: e.target.value })}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Destination"
                value={newRide.destination}
                onChange={(e) => setNewRide({ ...newRide, destination: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Nom du client"
                value={newRide.customerName}
                onChange={(e) => setNewRide({ ...newRide, customerName: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Prix (€)"
                type="number"
                value={newRide.price}
                onChange={(e) => setNewRide({ ...newRide, price: e.target.value })}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>
            Annuler
          </Button>
          <Button onClick={handleSaveRide} variant="contained">
            Ajouter
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Planning;