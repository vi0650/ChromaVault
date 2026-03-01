import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// ─── Force dark mode as the default theme ────────────────────────────────────
// Read saved preference; if none exists, apply 'dark' immediately
const savedTheme = localStorage.getItem('theme');
if (savedTheme === 'light') {
    document.documentElement.classList.remove('dark');
} else {
    // Default to dark (covers first visit AND explicit 'dark' preference)
    document.documentElement.classList.add('dark');
    localStorage.setItem('theme', 'dark');
}

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <App />
    </React.StrictMode>,
);
