import React, { StrictMode } from 'react';
import ReactDOM from 'react-dom';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import { createTheme, CssBaseline, darkScrollbar, ThemeProvider, responsiveFontSizes } from '@mui/material';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import './App.css';
import App from './App';
import mainSlice from './redux/slices/main.slice';
import modManagerSlice from './redux/slices/modManager.slice';

let theme = createTheme({
    palette: {
        mode: 'dark',
    },
    components: {
        MuiCssBaseline: {
            styleOverrides: {
                body: darkScrollbar(),
            },
        },
    },
});

theme = responsiveFontSizes(theme, { factor: 4 });

const store = configureStore({
    reducer: {
        main: mainSlice,
        modManager: modManagerSlice,
    },
});

ReactDOM.render(
    <StrictMode>
        <Provider store={store}>
            <ThemeProvider theme={theme}>
                <CssBaseline />
                <App />
            </ThemeProvider>
        </Provider>
    </StrictMode>,
    document.getElementById('root'),
);
