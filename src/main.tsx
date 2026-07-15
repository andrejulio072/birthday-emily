import React from 'react'
import ReactDOM from 'react-dom/client'
import AppMobileOptimized from './AppMobileOptimized'
import './styles.css'
import './experience.css'
import './mobile-fixes.css'
import './performance.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AppMobileOptimized />
  </React.StrictMode>,
)
