import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import AdminApp, { ADMIN_PATH } from './admin/AdminApp.jsx'
import RatesPage from './admin/RatesPage.jsx'
import './style.css'

function Router() {
  const path = window.location.pathname;

  if (path.startsWith(ADMIN_PATH)) {
    return <AdminApp />;
  }

  if (path.startsWith('/rates/')) {
    const token = path.split('/rates/')[1] || '';
    return <RatesPage token={token} />;
  }

  return <App />;
}

ReactDOM.createRoot(document.getElementById('app')).render(
  <React.StrictMode>
    <Router />
  </React.StrictMode>,
)
