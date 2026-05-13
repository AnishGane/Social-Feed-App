import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { Toaster } from './components/ui/sonner.tsx'
import { Provider } from 'react-redux'
import { store } from './store/store.ts'
import AuthInitializer from './components/auth-initializer.tsx'
import { TooltipProvider } from "@/components/ui/tooltip"

createRoot(document.getElementById('root')!).render(
  // <StrictMode>
  <Provider store={store}>
    <TooltipProvider>
      <Toaster richColors />
      <AuthInitializer>
        <App />
      </AuthInitializer>
    </TooltipProvider>
  </Provider>
  // </StrictMode>,
)
