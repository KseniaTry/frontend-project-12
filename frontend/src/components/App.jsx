import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import Login from './Login';
import NotFound from './NotFound';
import Chat from './Chat';
import { useSelector } from 'react-redux';

// создаем компонент, который проверяет авторизацию и либо отображает дочерние компоненты, либо перенаправляет на страницу входа
const ProtectedRoute = () => {
  const isAuth  = useSelector(state => state.auth.isAuth)

  // Если авторизован, отображает дочерние компоненты (Outlet), иначе перенаправляет
  return isAuth ? <Outlet /> : <Navigate to="/login" replace />;
};

function App() {
//  const { t } = useTranslation();

  //   return <h2>{t('Welcome to React')}</h2>;
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
