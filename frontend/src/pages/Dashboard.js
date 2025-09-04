import React, { useState, useEffect } from 'react';
import {
  Box, Grid, Paper, Typography, Card, CardContent,
  LinearProgress, Chip, IconButton, Button
} from '@mui/material';
import {
  TrendingUp, AttachMoney, DirectionsCar, Schedule,
  Refresh, Notifications
} from '@mui/icons-material';

const Dashboard = () => {
  const [stats, setStats] = useState({
    monthlyRevenue: 4250,
    monthlyExpenses: 1680,
    monthlyProfit: 2570,
    monthlyTarget: 5000,
    totalCourses: 175,
    averageCourse: 24.30,
    workingHours: 182,
    satisfaction: 4.8
  });

  const [recentActivity, setRecentActivity] = useState([
    { id: 1, type: 'course', platform: 'Uber', amount: 28.50, time: '14:30' },
    { id: 2, type: 'course', platform: 'Bolt', amount: 15.80, time: '13:45' },
    { id: 3, type: 'expense', category: 'Carburant', amount: -45.00, time: '12:00' },
    { id: 4, type: 'course', platform: 'FreeNow', amount: 32.20, time: '11:15' }
  ]);

  const progressPercent = (stats.monthlyRevenue / stats.monthlyTarget) * 100;

  return (
    <Box sx={{ p: 3, mt: 8 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 600 }}>
          Dashboard
        </Typography>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <IconButton>
            <Notifications />
          </IconButton>
          <IconButton>
            <Refresh />
          </IconButton>
        </Box>
      </Box>

      {/* KPI Cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <Typography color="text.secondary" gutterBottom>
                    Revenus ce mois
                  </Typography>
                  <Typography variant="h5" sx={{ fontWeight: 600, color: 'primary.main' }}>
                    {stats.monthlyRevenue}€
                  </Typography>
                </div>
                <AttachMoney sx={{ fontSize: 40, color: 'primary.main' }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <Typography color="text.secondary" gutterBottom>
                    Bénéfice net
                  </Typography>
                  <Typography variant="h5" sx={{ fontWeight: 600, color: 'success.main' }}>
                    {stats.monthlyProfit}€
                  </Typography>
                </div>
                <TrendingUp sx={{ fontSize: 40, color: 'success.main' }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <Typography color="text.secondary" gutterBottom>
                    Courses totales
                  </Typography>
                  <Typography variant="h5" sx={{ fontWeight: 600 }}>
                    {stats.totalCourses}
                  </Typography>
                </div>
                <DirectionsCar sx={{ fontSize: 40, color: 'info.main' }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <Typography color="text.secondary" gutterBottom>
                    Heures travaillées
                  </Typography>
                  <Typography variant="h5" sx={{ fontWeight: 600 }}>
                    {stats.workingHours}h
                  </Typography>
                </div>
                <Schedule sx={{ fontSize: 40, color: 'warning.main' }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Progress towards goal */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Objectif mensuel
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Box sx={{ flexGrow: 1 }}>
            <LinearProgress 
              variant="determinate" 
              value={progressPercent} 
              sx={{ height: 10, borderRadius: 5 }}
            />
          </Box>
          <Typography variant="body2" color="text.secondary">
            {progressPercent.toFixed(1)}%
          </Typography>
        </Box>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          {stats.monthlyRevenue}€ / {stats.monthlyTarget}€
        </Typography>
      </Paper>

      {/* Recent Activity */}
      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          Activité récente
        </Typography>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {recentActivity.map((activity) => (
            <Box key={activity.id} sx={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              p: 2,
              border: '1px solid',
              borderColor: 'divider',
              borderRadius: 1
            }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Chip 
                  label={activity.platform || activity.category}
                  size="small"
                  color={activity.type === 'course' ? 'primary' : 'default'}
                />
                <Typography variant="body2">
                  {activity.type === 'course' ? 'Course' : 'Dépense'}
                </Typography>
              </Box>
              <Box sx={{ textAlign: 'right' }}>
                <Typography 
                  variant="body1" 
                  sx={{ 
                    fontWeight: 600,
                    color: activity.amount > 0 ? 'success.main' : 'error.main'
                  }}
                >
                  {activity.amount > 0 ? '+' : ''}{activity.amount}€
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {activity.time}
                </Typography>
              </Box>
            </Box>
          ))}
        </Box>
      </Paper>
    </Box>
  );
};

export default Dashboard;
