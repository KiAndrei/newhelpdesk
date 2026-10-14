import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { LogoutIcon, TicketIcon } from './Icons.jsx';

export default function Layout({ children }) {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  return (
    <div className="app-shell">
      <header className="app-header">
        <div className="app-header-inner">
          <div className="brand">
            <TicketIcon width={22} height={22} />
            <span>IT Helpdesk</span>
          </div>
          <nav className="nav">
            <NavLink to="/tickets" end>
              Tickets
            </NavLink>
            <NavLink to="/tickets/add">New Ticket</NavLink>
          </nav>
          <button type="button" className="btn btn-ghost" onClick={handleLogout}>
            <LogoutIcon /> <span className="hide-sm">Logout</span>
          </button>
        </div>
      </header>
      <main className="container">{children}</main>
    </div>
  );
}
