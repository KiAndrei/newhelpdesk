import { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import TicketForm from '../components/TicketForm.jsx';
import Alert from '../components/Alert.jsx';
import { getTicket, updateTicket } from '../api/tickets.js';
import { parseApiError } from '../utils/errors.js';

export default function EditTicket() {
  const { id } = useParams();
  const navigate = useNavigate();
  const timer = useRef(null);

  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => () => clearTimeout(timer.current), []);

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

  const handleSubmit = async (payload) => {
    const updated = await updateTicket(id, payload);
    timer.current = setTimeout(() => {
      navigate(`/tickets/${id}`, { state: { flash: `Ticket ${updated.ticket_number} was updated successfully.` } });
    }, 900);
    return `Ticket ${updated.ticket_number} updated successfully. Redirecting to details…`;
  };

  return (
    <>
      <div className="page-head">
        <div>
          <h1>Edit Ticket</h1>
          {ticket && <p className="muted">{ticket.ticket_number}</p>}
        </div>
      </div>

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
        <TicketForm
          showStatus
          initialValues={ticket}
          submitLabel="Save Changes"
          onSubmit={handleSubmit}
          onCancel={() => navigate(`/tickets/${id}`)}
        />
      )}

      {!loading && !ticket && (
        <button type="button" className="btn btn-secondary" onClick={() => navigate('/tickets')}>
          Back to tickets
        </button>
      )}
    </>
  );
}
