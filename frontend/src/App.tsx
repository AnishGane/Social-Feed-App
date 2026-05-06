import { Routes, Route } from 'react-router-dom';
import AuthPage from './pages/auth';
import PublicRoute from './routes/public-route';
import ProtectedRoutes from './routes/protected-route';
import DashboardPage from './pages/dashboard';

const App = () => {
  return (
    <Routes>

      <Route index element={<h1>Home</h1>} />

      <Route element={<PublicRoute />}>
        <Route path='/auth' element={<AuthPage />} />
      </Route>

      <Route element={<ProtectedRoutes />}>
        <Route path='/dashboard' element={<DashboardPage />} />
      </Route>
    </Routes>
  )
}

export default App