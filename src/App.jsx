import React, { useState, useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { ThemeProvider, createTheme, CssBaseline, Container, AppBar, Toolbar, Typography, Tabs, Tab, Box } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import BarChartIcon from '@mui/icons-material/BarChart';
import SettingsIcon from '@mui/icons-material/Settings';
import HomePage from './pages/HomePage/HomePage';
import StatisticsPage from './pages/StatisticsPage/StatisticsPage';
import SettingsPage from './pages/SettingsPage/SettingsPage';
import Notification from './components/Notification/Notification';
import ThemeToggle from './components/ThemeToggle/ThemeToggle';

function App() {
    const [themeMode, setThemeMode] = useState('light');
    const [notifications, setNotifications] = useState([]);
    const location = useLocation();

    // Определение активного таба на основе текущего пути
    const getActiveTab = () => {
        switch (location.pathname) {
            case '/statistics': return 1;
            case '/settings': return 2;
            default: return 0;
        }
    };

    // Загрузка темы из localStorage
    useEffect(() => {
        const savedTheme = localStorage.getItem('themeMode') || 'light';
        setThemeMode(savedTheme);
    }, []);

    const theme = createTheme({
        palette: {
            mode: themeMode,
            primary: {
                main: '#6019d2ff',
            },
            secondary: {
                main: '#dc004e',
            },
            background: {
                default: themeMode === 'dark' ? '#121212' : '#f5f5f5',
                paper: themeMode === 'dark' ? '#1e1e1e' : '#ffffff',
            },
        },
        shape: {
            borderRadius: 12,
        },
        typography: {
            fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
            h4: {
                fontWeight: 600,
            },
            h6: {
                fontWeight: 500,
            },
        },
        components: {
            MuiCard: {
                styleOverrides: {
                    root: {
                        borderRadius: 12,
                        boxShadow: themeMode === 'dark'
                            ? '0 4px 20px rgba(0,0,0,0.3)'
                            : '0 4px 20px rgba(0,0,0,0.08)',
                    },
                },
            },
            MuiButton: {
                styleOverrides: {
                    root: {
                        borderRadius: 8,
                        textTransform: 'none',
                        fontWeight: 500,
                    },
                },
            },
        },
    });

    const addNotification = (message, type = 'info') => {
        const id = Date.now();
        setNotifications(prev => [...prev, { id, message, type }]);
    };

    const removeNotification = (id) => {
        setNotifications(prev => prev.filter(notification => notification.id !== id));
    };

    const handleThemeChange = (newTheme) => {
        setThemeMode(newTheme);
        localStorage.setItem('themeMode', newTheme);
    };

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />

            <AppBar
                position="sticky"
                elevation={0}
                sx={{
                    background: themeMode === 'dark'
                        ? 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)'
                        : 'linear-gradient(135deg, #6019d2 0%, #6f1ef0 100%)',
                    borderBottom: `1px solid ${themeMode === 'dark' ? '#333' : '#e0e0e0'}`,
                }}
            >
                <Container maxWidth="xl">
                    <Toolbar disableGutters sx={{ py: 1 }}>
                        <Typography
                            variant="h6"
                            noWrap
                            component="div"
                            sx={{
                                mr: 4,
                                display: 'flex',
                                alignItems: 'center',
                                fontWeight: 700,
                                color: '#fff',
                                textShadow: '0 2px 4px rgba(0,0,0,0.2)',
                            }}
                        >
                            Дорожная карта 🛣️🗺️  🚗💨
                        </Typography>

                        <Tabs
                            value={getActiveTab()}
                            sx={{
                                flexGrow: 1,
                                '& .MuiTabs-indicator': {
                                    height: 3,
                                    borderRadius: '3px 3px 0 0',
                                },
                                '& .MuiTab-root': {
                                    color: 'rgba(255, 255, 255, 0.9)',
                                    textTransform: 'none',
                                    fontWeight: 500,
                                    fontSize: '0.95rem',
                                    minHeight: 60,
                                    '&:hover': {
                                        color: '#fff',
                                        backgroundColor: 'rgba(255, 255, 255, 0.1)',
                                    },
                                    '&.Mui-selected': {
                                        color: '#fff',
                                        fontWeight: 600,
                                    },
                                },
                            }}
                        >
                            <Tab
                                icon={<HomeIcon />}
                                iconPosition="start"
                                label="Главная"
                                href="/"
                                sx={{ minWidth: 100 }}
                            />
                            <Tab
                                icon={<BarChartIcon />}
                                iconPosition="start"
                                label="Статистика"
                                href="/statistics"
                                sx={{ minWidth: 100 }}
                            />
                            <Tab
                                icon={<SettingsIcon />}
                                iconPosition="start"
                                label="Настройки"
                                href="/settings"
                                sx={{ minWidth: 100 }}
                            />
                        </Tabs>

                        <Box sx={{ ml: 2 }}>
                            <ThemeToggle themeMode={themeMode} onThemeChange={handleThemeChange} />
                        </Box>
                    </Toolbar>
                </Container>
            </AppBar>

            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    py: 3,
                    minHeight: 'calc(100vh - 64px)',
                    background: themeMode === 'dark'
                        ? 'radial-gradient(circle at 50% 50%, #1a1a2e 0%, #121212 100%)'
                        : 'radial-gradient(circle at 50% 50%, #e3f2fd 0%, #f5f5f5 100%)',
                }}
            >
                <Container maxWidth="xl">
                    <Routes>
                        <Route path="/" element={
                            <HomePage
                                addNotification={addNotification}
                            />
                        } />
                        <Route path="/statistics" element={<StatisticsPage />} />
                        <Route path="/settings" element={<SettingsPage />} />
                    </Routes>
                </Container>
            </Box>

            {notifications.map(notification => (
                <Notification
                    key={notification.id}
                    message={notification.message}
                    type={notification.type}
                    onClose={() => removeNotification(notification.id)}
                />
            ))}
        </ThemeProvider>
    );
}

export default App;