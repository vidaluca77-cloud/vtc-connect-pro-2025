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
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Button,
  Tab,
  Tabs,
  LinearProgress,
} from '@mui/material';
import {
  AttachMoney,
  TrendingUp,
  TrendingDown,
  Download,
  AccountBalance,
} from '@mui/icons-material';
import { Line, Doughnut } from 'react-chartjs-2';

const Finances = () => {
  const [tabValue, setTabValue] = useState(0);
  const [loading, setLoading] = useState(true);
  const [financialData, setFinancialData] = useState({
    summary: {
      totalRevenue: 0,
      totalExpenses: 0,
      netProfit: 0,
      pendingPayments: 0
    },
    transactions: [],
    monthlyData: []
  });

  useEffect(() => {
    // Mock data load
    setTimeout(() => {
      setFinancialData({
        summary: {
          totalRevenue: 8450.75,
          totalExpenses: 2340.50,
          netProfit: 6110.25,
          pendingPayments: 450.00
        },
        transactions: [
          {
            id: 'TXN001',
            date: new Date(),
            type: 'revenue',
            description: 'Course Paris CDG - 16e Arrondissement',
            amount: 85.50,
            status: 'completed'
          },
          {
            id: 'TXN002',
            date: new Date(Date.now() - 86400000),
            type: 'expense',
            description: 'Carburant Shell',
            amount: -45.00,
            status: 'completed'
          },
          {
            id: 'TXN003',
            date: new Date(Date.now() - 2 * 86400000),
            type: 'revenue',
            description: 'Course Gare du Nord - La Défense',
            amount: 45.00,
            status: 'completed'
          }
        ],
        monthlyData: [4200, 4800, 3900, 5200, 4700, 5800]
      });
      setLoading(false);
    }, 1000);
  }, []);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const revenueChartData = {
    labels: ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin'],
    datasets: [
      {
        label: 'Revenus (€)',
        data: financialData.monthlyData,
        borderColor: 'rgb(37, 99, 235)',
        backgroundColor: 'rgba(37, 99, 235, 0.1)',
        tension: 0.4,
      },
    ],
  };

  const expenseChartData = {
    labels: ['Carburant', 'Assurance', 'Maintenance', 'Licences', 'Autres'],
    datasets: [
      {
        data: [45, 25, 15, 10, 5],
        backgroundColor: [
          '#FF6384',
          '#36A2EB',
          '#FFCE56',
          '#4BC0C0',
          '#9966FF',
        ],
      },
    ],
  };

  const StatCard = ({ title, value, icon, trend, color = 'primary' }) => (
    <Card>
      <CardContent>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Box>
            <Typography color="textSecondary" gutterBottom variant="body2">
              {title}
            </Typography>
            <Typography variant="h4">
              {value}€
            </Typography>
            {trend && (
              <Box display="flex" alignItems="center" mt={1}>
                {trend > 0 ? (
                  <TrendingUp color="success" />
                ) : (
                  <TrendingDown color="error" />
                )}
                <Typography 
                  variant="body2" 
                  color={trend > 0 ? 'success.main' : 'error.main'}
                  sx={{ ml: 0.5 }}
                >
                  {Math.abs(trend)}%
                </Typography>
              </Box>
            )}
          </Box>
          <Box color={`${color}.main`}>
            {icon}
          </Box>
        </Box>
      </CardContent>
    </Card>
  );

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Toolbar />
        <LinearProgress />
        <Typography variant="h4" sx={{ mt: 2 }}>
          Chargement des données financières...
        </Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Toolbar />
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" gutterBottom>
          Finances
        </Typography>
        <Button
          variant="outlined"
          startIcon={<Download />}
          onClick={() => console.log('Export financial data')}
        >
          Exporter
        </Button>
      </Box>

      {/* Summary Cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Revenus totaux"
            value={financialData.summary.totalRevenue.toLocaleString('fr-FR')}
            icon={<AttachMoney fontSize="large" />}
            trend={12.5}
            color="success"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Dépenses totales"
            value={financialData.summary.totalExpenses.toLocaleString('fr-FR')}
            icon={<TrendingDown fontSize="large" />}
            trend={-5.2}
            color="error"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Bénéfice net"
            value={financialData.summary.netProfit.toLocaleString('fr-FR')}
            icon={<TrendingUp fontSize="large" />}
            trend={18.3}
            color="primary"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Paiements en attente"
            value={financialData.summary.pendingPayments.toLocaleString('fr-FR')}
            icon={<AccountBalance fontSize="large" />}
            color="warning"
          />
        </Grid>
      </Grid>

      {/* Tabs */}
      <Paper sx={{ mb: 3 }}>
        <Tabs value={tabValue} onChange={handleTabChange} indicatorColor="primary">
          <Tab label="Aperçu" />
          <Tab label="Transactions" />
          <Tab label="Analyses" />
        </Tabs>
      </Paper>

      {/* Tab Content */}
      {tabValue === 0 && (
        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <Paper sx={{ p: 2, height: 400 }}>
              <Typography variant="h6" gutterBottom>
                Évolution des revenus
              </Typography>
              <Line data={revenueChartData} options={{ responsive: true, maintainAspectRatio: false }} />
            </Paper>
          </Grid>
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 2, height: 400 }}>
              <Typography variant="h6" gutterBottom>
                Répartition des dépenses
              </Typography>
              <Doughnut data={expenseChartData} options={{ responsive: true, maintainAspectRatio: false }} />
            </Paper>
          </Grid>
        </Grid>
      )}

      {tabValue === 1 && (
        <Paper>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>Date</TableCell>
                  <TableCell>Description</TableCell>
                  <TableCell>Type</TableCell>
                  <TableCell align="right">Montant</TableCell>
                  <TableCell>Statut</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {financialData.transactions.map((transaction) => (
                  <TableRow key={transaction.id}>
                    <TableCell>{transaction.id}</TableCell>
                    <TableCell>
                      {transaction.date.toLocaleDateString('fr-FR')}
                    </TableCell>
                    <TableCell>{transaction.description}</TableCell>
                    <TableCell>
                      <Chip
                        label={transaction.type === 'revenue' ? 'Revenu' : 'Dépense'}
                        color={transaction.type === 'revenue' ? 'success' : 'error'}
                        size="small"
                      />
                    </TableCell>
                    <TableCell align="right">
                      <Typography
                        color={transaction.amount > 0 ? 'success.main' : 'error.main'}
                        fontWeight="bold"
                      >
                        {transaction.amount > 0 ? '+' : ''}{transaction.amount}€
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={transaction.status === 'completed' ? 'Terminé' : 'En attente'}
                        color={transaction.status === 'completed' ? 'success' : 'warning'}
                        size="small"
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      )}

      {tabValue === 2 && (
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Analyses financières
              </Typography>
              <Typography variant="body1" color="textSecondary" sx={{ mb: 2 }}>
                Analyses détaillées de vos performances financières
              </Typography>
              
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <Box sx={{ p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 1 }}>
                    <Typography variant="subtitle1" gutterBottom>
                      Moyenne journalière
                    </Typography>
                    <Typography variant="h4" color="primary">
                      {(financialData.summary.totalRevenue / 30).toFixed(2)}€
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      Revenus par jour ce mois
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Box sx={{ p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 1 }}>
                    <Typography variant="subtitle1" gutterBottom>
                      Marge bénéficiaire
                    </Typography>
                    <Typography variant="h4" color="success.main">
                      {((financialData.summary.netProfit / financialData.summary.totalRevenue) * 100).toFixed(1)}%
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      Rentabilité de votre activité
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </Paper>
          </Grid>
        </Grid>
      )}
    </Container>
  );
};

export default Finances;