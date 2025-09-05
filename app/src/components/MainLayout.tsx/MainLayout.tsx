import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import {
  AppBar,
  Box,
  CssBaseline,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
  Avatar,
  Menu,
  MenuItem,
  useTheme,
  useMediaQuery,
  Container,
  Divider,
  Badge
} from '@mui/material';
import {
  Menu as MenuIcon,
  Dashboard as DashboardIcon,
  DirectionsCar as CarsIcon,
  People as DriversIcon,
  Assignment as BookingsIcon,
  AccountCircle as AccountIcon,
  Notifications as NotificationsIcon,
  Settings as SettingsIcon,
  ExitToApp as LogoutIcon,
  LocalTaxi as VTCIcon
} from '@mui/icons-material';

interface MainLayoutProps {
  children: React.ReactNode;
}

interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: 'admin' | 'driver' | 'client';
}

interface NavigationItem {
  text: string;
  icon: React.ReactNode;
  path: string;
  roles?: ('admin' | 'driver' | 'client')[];
}

const drawerWidth = 280;

const navigationItems: NavigationItem[] = [
  {
    text: 'Tableau de bord',
    icon: <DashboardIcon />,
    path: '/dashboard',
    roles: ['admin', 'driver', 'client']
  },
  {
    text: 'Réservations',
    icon: <BookingsIcon />,
    path: '/bookings',
    roles: ['admin', 'driver', 'client']
  },
  {
    text: 'Véhicules',
    icon: <CarsIcon />,
    path: '/vehicles',
    roles: ['admin', 'driver']
  },
  {
    text: 'Chauffeurs',
    icon: <DriversIcon />,
    path: '/drivers',
    roles: ['admin']
  },
  {
    text: 'Paramètres',
    icon: <SettingsIcon />,
    path: '/settings',
    roles: ['admin', 'driver', 'client']
  }
];

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const theme = useTheme();
  const router = useRouter();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  // État pour la navigation mobile
  const [mobileOpen, setMobileOpen] = useState(false);
  
  // État pour le menu utilisateur
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  
  // État pour l'utilisateur (simulé - à remplacer par votre système d'auth)
  const [user, setUser] = useState<User | null>({
    id: '1',
    name: 'Jean Dupont',
    email: 'jean.dupont@vtc.com',
    role: 'admin'
  });
  
  // État pour les notifications
  const [notificationCount, setNotificationCount] = useState(3);

  // Gestion de l'ouverture/fermeture du drawer mobile
  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  // Gestion du menu utilisateur
  const handleUserMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleUserMenuClose = () => {
    setAnchorEl(null);
  };

  // Gestion de la déconnexion
  const handleLogout = () => {
    // Logique de déconnexion
    setUser(null);
    handleUserMenuClose();
    router.push('/login');
  };

  // Navigation vers une page
  const handleNavigation = (path: string) => {
    router.push(path);
    if (isMobile) {
      setMobileOpen(false);
    }
  };

  // Filtrer les éléments de navigation selon le rôle utilisateur
  const filteredNavigationItems = navigationItems.filter(item => 
    !item.roles || (user && item.roles.includes(user.role))
  );

  // Vérification de l'authentification
  useEffect(() => {
    // Logique pour vérifier l'état d'authentification
    // Rediriger vers login si non authentifié
    if (!user && router.pathname !== '/login') {
      router.push('/login');
    }
  }, [user, router]);

  // Contenu du drawer
  const drawer = (
    <Box>
      <Toolbar>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <VTCIcon color="primary" sx={{ fontSize: 32 }} />
          <Typography variant="h6" noWrap component="div">
            VTC Connect Pro
          </Typography>
        </Box>
      </Toolbar>
      <Divider />
      <List>
        {filteredNavigationItems.map((item) => (
          <ListItem key={item.text} disablePadding>
            <ListItemButton
              selected={router.pathname === item.path}
              onClick={() => handleNavigation(item.path)}
              sx={{
                '&.Mui-selected': {
                  backgroundColor: theme.palette.primary.main + '20',
                  '&:hover': {
                    backgroundColor: theme.palette.primary.main + '30',
                  },
                },
              }}
            >
              <ListItemIcon
                sx={{
                  color: router.pathname === item.path 
                    ? theme.palette.primary.main 
                    : 'inherit'
                }}
              >
                {item.icon}
              </ListItemIcon>
              <ListItemText 
                primary={item.text}
                sx={{
                  '& .MuiListItemText-primary': {
                    fontWeight: router.pathname === item.path ? 600 : 400
                  }
                }}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  // Si l'utilisateur n'est pas authentifié, ne pas afficher le layout
  if (!user) {
    return <>{children}</>;
  }

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      
      {/* AppBar */}
      <AppBar
        position="fixed"
        sx={{
          width: { md: `calc(100% - ${drawerWidth}px)` },
          ml: { md: `${drawerWidth}px` },
          zIndex: theme.zIndex.drawer + 1,
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { md: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          
          <Typography 
            variant="h6" 
            noWrap 
            component="div" 
            sx={{ 
              flexGrow: 1,
              display: { xs: 'none', sm: 'block' }
            }}
          >
            {/* Titre basé sur la route actuelle */}
            {filteredNavigationItems.find(item => item.path === router.pathname)?.text || 'VTC Connect Pro'}
          </Typography>

          {/* Actions de la barre d'outils */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {/* Notifications */}
            <IconButton 
              color="inherit"
              onClick={() => router.push('/notifications')}
            >
              <Badge badgeContent={notificationCount} color="error">
                <NotificationsIcon />
              </Badge>
            </IconButton>
            
            {/* Menu utilisateur */}
            <IconButton
              onClick={handleUserMenuOpen}
              sx={{ p: 0, ml: 2 }}
            >
              <Avatar 
                alt={user.name}
                src={user.avatar}
                sx={{ width: 40, height: 40 }}
              >
                {user.name.charAt(0).toUpperCase()}
              </Avatar>
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Menu utilisateur */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleUserMenuClose}
        sx={{ mt: '45px' }}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        <Box sx={{ px: 2, py: 1 }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
            {user.name}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {user.email}
          </Typography>
        </Box>
        <Divider />
        <MenuItem onClick={() => {
          handleUserMenuClose();
          router.push('/profile');
        }}>
          <ListItemIcon>
            <AccountIcon fontSize="small" />
          </ListItemIcon>
          Mon profil
        </MenuItem>
        <MenuItem onClick={() => {
          handleUserMenuClose();
          router.push('/settings');
        }}>
          <ListItemIcon>
            <SettingsIcon fontSize="small" />
          </ListItemIcon>
          Paramètres
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleLogout}>
          <ListItemIcon>
            <LogoutIcon fontSize="small" />
          </ListItemIcon>
          Se déconnecter
        </MenuItem>
      </Menu>

      {/* Navigation Drawer */}
      <Box
        component="nav"
        sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}
      >
        {/* Drawer mobile */}
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Meilleures performances sur mobile
          }}
          sx={{
            display: { xs: 'block', md: 'none' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: drawerWidth,
            },
          }}
        >
          {drawer}
        </Drawer>
        
        {/* Drawer desktop */}
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', md: 'block' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: drawerWidth,
            },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>

      {/* Contenu principal */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { md: `calc(100% - ${drawerWidth}px)` },
          minHeight: '100vh',
          backgroundColor: theme.palette.grey[50],
        }}
      >
        <Toolbar /> {/* Espaceur pour l'AppBar */}
        <Container maxWidth="xl" sx={{ py: 2 }}>
          {children}
        </Container>
      </Box>
    </Box>
  );
};

export default MainLayout;
