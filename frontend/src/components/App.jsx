import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import Login from './Login';
import NotFound from './NotFound';
import Chat from './Chat';
import Registration from './Registration';
import { useSelector } from 'react-redux';
import { ToastContainer } from 'react-toastify';

// компонент, который проверяет авторизацию и либо отображает дочерние компоненты, либо перенаправляет на страницу входа
const ProtectedRoute = () => {
  const isAuth  = useSelector(state => state.auth.isAuth)
  return isAuth ? <Outlet /> : <Navigate to="/login" replace />;
};

function App() {
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
