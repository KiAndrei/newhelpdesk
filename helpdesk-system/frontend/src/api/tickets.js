import client from './client.js';

export const getTickets = async () => (await client.get('/tickets')).data.data;
export const getTicket = async (id) => (await client.get(`/tickets/${id}`)).data.data;
export const createTicket = async (payload) => (await client.post('/tickets', payload)).data.data;
export const updateTicket = async (id, payload) => (await client.put(`/tickets/${id}`, payload)).data.data;
export const deleteTicket = async (id) => {
  await client.delete(`/tickets/${id}`);
};
