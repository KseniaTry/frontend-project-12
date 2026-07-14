import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import Login from './pages/Login';
import NotFound from './pages/NotFound';
import Chat from './pages/Chat'
import Registration from './pages/Registration';
import { useSelector } from 'react-redux';
import { ToastContainer } from 'react-toastify';

// компонент, который проверяет авторизацию и либо отображает дочерние компоненты, либо перенаправляет на страницу входа
const ProtectedRoute = () => {
  const isAuth  = useSelector(state => state.auth.isAuth)
  return isAuth ? <Outlet /> : <Navigate to="/login" replace />;
};

function App() {
  console.log('Проверка токена:', import.meta.env.VITE_ROLLBAR_TOKEN);
  return (
    <>
      <BrowserRouter>
        <ToastContainer autoClose={5000} />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Registration />} />

          <Route element={<ProtectedRoute />}>
            <Route path="/" element={<Chat />} />
          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
