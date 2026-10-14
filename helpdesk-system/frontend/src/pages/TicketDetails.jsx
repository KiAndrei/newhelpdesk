import { useCallback, useEffect, useState } from 'react';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import { getTicket } from '../api/tickets.js';
import { parseApiError } from '../utils/errors.js';
import { formatDate } from '../utils/format.js';
import Alert from '../components/Alert.jsx';
import { PriorityBadge, StatusBadge } from '../components/Badge.jsx';
import { ArrowLeftIcon, EditIcon } from '../components/Icons.jsx';

function Item({ label, children, wide }) {
  return (
    <div className={`detail-item ${wide ? 'span-2' : ''}`}>
      <dt>{label}</dt>
      <dd>{children}</dd>
    </div>
  );
}

export default function TicketDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [flash, setFlash] = useState(location.state?.flash || '');

  const load = useCallback(async () => {
    if (!/^\d+$/.test(id)) {
      setError('Invalid ticket ID.');
      setLoading(false);
      return;
    }
    setLoading(true);
    setError('');
    try {
      setTicket(await getTicket(id));
    } catch (err) {
      setTicket(null);
      setError(parseApiError(err).message);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    if (location.state?.flash) navigate(location.pathname, { replace: true, state: null });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <div className="page-head">
        <div>
          <h1>Ticket Details</h1>
          {ticket && <p className="muted">{ticket.ticket_number}</p>}
        </div>
        <div className="head-actions">
          <Link to="/tickets" className="btn btn-secondary">
            <ArrowLeftIcon /> Back
          </Link>
          {ticket && (
            <Link to={`/tickets/${ticket.id}/edit`} className="btn btn-primary">
              <EditIcon /> Edit
            </Link>
          )}
        </div>
      </div>

      <Alert type="success">{flash}</Alert>

      {loading && (
        <div className="card state-box" role="status">
          <div className="spinner" />
          <p>Loading ticket…</p>
        </div>
      )}

      {!loading && error && (
        <Alert
          type="error"
          action={
            <button type="button" className="btn btn-small btn-secondary" onClick={load}>
              Retry
            </button>
          }
        >
          {error}
        </Alert>
      )}

      {!loading && ticket && (
        <div className="card">
          <dl className="details-grid">
            <Item label="Ticket Number">{ticket.ticket_number}</Item>
            <Item label="Status">
              <StatusBadge value={ticket.status} />
            </Item>
            <Item label="Requester Name">{ticket.requester_name}</Item>
            <Item label="Requester Email">{ticket.requester_email}</Item>
            <Item label="Issue Category">{ticket.issue_category}</Item>
            <Item label="Priority">
              <PriorityBadge value={ticket.priority} />
            </Item>
            <Item label="Subject" wide>
              {ticket.subject}
            </Item>
            <Item label="Description" wide>
              <p className="description">{ticket.description}</p>
            </Item>
            <Item label="Date Created">{formatDate(ticket.created_at)}</Item>
            <Item label="Last Updated">{formatDate(ticket.updated_at)}</Item>
          </dl>
        </div>
      )}
    </>
  );
}
