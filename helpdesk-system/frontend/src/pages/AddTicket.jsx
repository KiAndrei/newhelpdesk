import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import TicketForm from '../components/TicketForm.jsx';
import { createTicket } from '../api/tickets.js';

export default function AddTicket() {
  const navigate = useNavigate();
  const timer = useRef(null);

  useEffect(() => () => clearTimeout(timer.current), []);

  const handleSubmit = async (payload) => {
    const ticket = await createTicket(payload);
    timer.current = setTimeout(() => {
      navigate('/tickets', { state: { flash: `Ticket ${ticket.ticket_number} was created successfully.` } });
    }, 900);
    return `Ticket ${ticket.ticket_number} created successfully. Redirecting to the ticket list…`;
  };

  return (
    <>
      <div className="page-head">
        <div>
          <h1>Add Ticket</h1>
          <p className="muted">Create a new helpdesk ticket.</p>
        </div>
      </div>
      <TicketForm submitLabel="Create Ticket" onSubmit={handleSubmit} onCancel={() => navigate('/tickets')} />
    </>
  );
}
