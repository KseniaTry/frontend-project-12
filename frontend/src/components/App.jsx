import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './Login';
import NotFound from './NotFound';
import Chat from './Chat';
import { useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';

// создаем компонент, который проверяет авторизацию и либо отображает дочерние компоненты, либо перенаправляет на страницу входа
const ProtectedRoute = () => {
  const isAuth  = useSelector(state => state.auth)

  // Если авторизован, отображает дочерние компоненты (Outlet), иначе перенаправляет
  return isAuth ? <Outlet /> : <Navigate to="/login" replace />;
};


function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />

        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<Chat />} />
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
