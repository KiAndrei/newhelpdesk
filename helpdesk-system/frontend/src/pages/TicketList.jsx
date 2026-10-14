import { useCallback, useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { deleteTicket, getTickets } from '../api/tickets.js';
import { parseApiError } from '../utils/errors.js';
import { formatDate } from '../utils/format.js';
import Alert from '../components/Alert.jsx';
import ConfirmModal from '../components/ConfirmModal.jsx';
import { PriorityBadge, StatusBadge } from '../components/Badge.jsx';
import { EditIcon, EyeIcon, PlusIcon, RefreshIcon, TrashIcon } from '../components/Icons.jsx';

export default function TicketList() {
  const navigate = useNavigate();
  const location = useLocation();

  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [flash, setFlash] = useState('');

  const [target, setTarget] = useState(null); // ticket pending deletion
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      setTickets(await getTickets());
    } catch (err) {
      setError(parseApiError(err).message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  // Show a one-time success message passed from Add/Edit pages.
  useEffect(() => {
    if (location.state?.flash) {
      setFlash(location.state.flash);
      navigate(location.pathname, { replace: true, state: null });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const confirmDelete = async () => {
    if (!target || deleting) return;
    setDeleting(true);
    setDeleteError('');
    try {
      await deleteTicket(target.id);
      setTickets((prev) => prev.filter((t) => t.id !== target.id));
      setFlash(`Ticket ${target.ticket_number} was deleted.`);
      setTarget(null);
    } catch (err) {
      setDeleteError(parseApiError(err).message);
    } finally {
      setDeleting(false);
    }
  };

  const closeModal = () => {
    setTarget(null);
    setDeleteError('');
  };

  return (
    <>
      <div className="page-head">
        <div>
          <h1>Helpdesk Tickets</h1>
          <p className="muted">{loading ? 'Loading…' : `${tickets.length} ticket${tickets.length === 1 ? '' : 's'}`}</p>
        </div>
        <button type="button" className="btn btn-secondary" onClick={load} disabled={loading}>
          <RefreshIcon /> Refresh
        </button>
      </div>

      <Alert type="success">{flash}</Alert>

      {loading && (
        <div className="card state-box" role="status">
          <div className="spinner" />
          <p>Loading tickets…</p>
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

      {!loading && !error && tickets.length === 0 && (
        <div className="card state-box">
          <h2>No tickets yet</h2>
          <p className="muted">Create your first helpdesk ticket using the + button.</p>
        </div>
      )}

      {!loading && !error && tickets.length > 0 && (
        <div className="card table-card">
          <table className="table responsive">
            <thead>
              <tr>
                <th>Ticket No.</th>
                <th>Requester</th>
                <th>Subject</th>
                <th>Priority</th>
                <th>Status</th>
                <th>Date Created</th>
                <th className="actions-col">Actions</th>
              </tr>
            </thead>
            <tbody>
              {tickets.map((t) => (
                <tr key={t.id}>
                  <td data-label="Ticket No.">
                    <Link to={`/tickets/${t.id}`} className="ticket-link">
                      {t.ticket_number}
                    </Link>
                  </td>
                  <td data-label="Requester">{t.requester_name}</td>
                  <td data-label="Subject" className="subject-cell">
                    {t.subject}
                  </td>
                  <td data-label="Priority">
                    <PriorityBadge value={t.priority} />
                  </td>
                  <td data-label="Status">
                    <StatusBadge value={t.status} />
                  </td>
                  <td data-label="Date Created">{formatDate(t.created_at)}</td>
                  <td data-label="Actions" className="actions-col">
                    <div className="row-actions">
                      <Link to={`/tickets/${t.id}`} className="icon-btn" title="View" aria-label={`View ${t.ticket_number}`}>
                        <EyeIcon />
                      </Link>
                      <Link to={`/tickets/${t.id}/edit`} className="icon-btn" title="Edit" aria-label={`Edit ${t.ticket_number}`}>
                        <EditIcon />
                      </Link>
                      <button
                        type="button"
                        className="icon-btn danger"
                        title="Delete"
                        aria-label={`Delete ${t.ticket_number}`}
                        onClick={() => setTarget(t)}
                      >
                        <TrashIcon />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Link to="/tickets/add" className="fab" title="Add ticket" aria-label="Add ticket">
        <PlusIcon width={26} height={26} />
      </Link>

      {target && (
        <ConfirmModal
          title="Delete ticket?"
          confirmLabel="Yes, delete ticket"
          cancelLabel="Keep ticket"
          busy={deleting}
          error={deleteError}
          onConfirm={confirmDelete}
          onCancel={closeModal}
        >
          <p>
            You are about to permanently delete <strong>{target.ticket_number}</strong> — “{target.subject}”. This
            cannot be undone.
          </p>
        </ConfirmModal>
      )}
    </>
  );
}
