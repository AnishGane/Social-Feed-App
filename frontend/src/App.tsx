import { Routes, Route } from 'react-router-dom';
import AuthPage from './pages/auth';

const App = () => {
  return (
    <Routes>
      <Route index element={<h1>Home</h1>} />
      <Route path='/auth' element={<AuthPage />} />
      <Route path='/dashboard' element={<h1>Dashboard</h1>} />
    </Routes>
  )
}

export default App