import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { BrowserRouter } from 'react-router-dom'
import { Toaster } from './components/ui/sonner.tsx'
import { Provider } from 'react-redux'
import { store } from './store/store.ts'
import AuthInitializer from './components/auth-initializer.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Provider store={store}>
        <Toaster />
        <AuthInitializer>
          <App />
        </AuthInitializer>
      </Provider>
    </BrowserRouter>
  </StrictMode>,
)
