import { Navigate, Route, Routes } from 'react-router-dom';
import { useAuth } from './context/AuthContext.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import Login from './pages/Login.jsx';
import TicketList from './pages/TicketList.jsx';
import AddTicket from './pages/AddTicket.jsx';
import TicketDetails from './pages/TicketDetails.jsx';
import EditTicket from './pages/EditTicket.jsx';
import NotFound from './pages/NotFound.jsx';

function RootRedirect() {
  const { isAuthenticated } = useAuth();
  return <Navigate to={isAuthenticated ? '/tickets' : '/login'} replace />;
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<RootRedirect />} />
      <Route path="/login" element={<Login />} />

      <Route element={<ProtectedRoute />}>
        <Route path="/tickets" element={<TicketList />} />
        <Route path="/tickets/add" element={<AddTicket />} />
        <Route path="/tickets/:id" element={<TicketDetails />} />
        <Route path="/tickets/:id/edit" element={<EditTicket />} />
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
