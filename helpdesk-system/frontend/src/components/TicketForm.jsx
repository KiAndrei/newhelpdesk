import { useState } from 'react';
import Alert from './Alert.jsx';
import { parseApiError } from '../utils/errors.js';
import { CATEGORIES, PRIORITIES, STATUSES } from '../utils/format.js';

const EMPTY = {
  requester_name: '',
  requester_email: '',
  issue_category: '',
  priority: '',
  subject: '',
  description: '',
  status: 'Open',
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validate(values, showStatus) {
  const e = {};
  if (!values.requester_name.trim()) e.requester_name = 'Requester name is required.';
  if (!values.requester_email.trim()) e.requester_email = 'Requester email is required.';
  else if (!EMAIL_RE.test(values.requester_email.trim())) e.requester_email = 'Enter a valid email address.';
  if (!values.issue_category) e.issue_category = 'Please select an issue category.';
  if (!values.priority) e.priority = 'Please select a priority.';
  if (!values.subject.trim()) e.subject = 'Subject is required.';
  if (!values.description.trim()) e.description = 'Description is required.';
  if (showStatus && !values.status) e.status = 'Please select a status.';
  return e;
}

function Field({ id, label, error, children }) {
  return (
    <div className={`field ${error ? 'has-error' : ''}`}>
      <label htmlFor={id}>
        {label} <span className="required" aria-hidden="true">*</span>
      </label>
      {children}
      {error && (
        <p className="field-error" id={`${id}-error`}>
          {error}
        </p>
      )}
    </div>
  );
}

/**
 * onSubmit(values) must return a Promise resolving to a success message string
 * (and may throw an Axios error, which is displayed inline).
 */
export default function TicketForm({ initialValues, showStatus = false, submitLabel, onSubmit, onCancel }) {
  const [values, setValues] = useState({ ...EMPTY, ...initialValues });
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState('');
  const [success, setSuccess] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const locked = submitting || Boolean(success);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues((v) => ({ ...v, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (locked) return;

    setFormError('');
    const clientErrors = validate(values, showStatus);
    setErrors(clientErrors);
    if (Object.keys(clientErrors).length > 0) {
      setFormError('Please fix the errors below and try again.');
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        requester_name: values.requester_name.trim(),
        requester_email: values.requester_email.trim(),
        issue_category: values.issue_category,
        priority: values.priority,
        subject: values.subject.trim(),
        description: values.description.trim(),
      };
      if (showStatus) payload.status = values.status;

      const message = await onSubmit(payload);
      setSuccess(message);
    } catch (err) {
      const parsed = parseApiError(err);
      setErrors(parsed.fieldErrors);
      setFormError(parsed.message);
    } finally {
      setSubmitting(false);
    }
  };

  const ariaFor = (name) => ({
    'aria-invalid': errors[name] ? 'true' : 'false',
    'aria-describedby': errors[name] ? `${name}-error` : undefined,
  });

  return (
    <form className="card form" onSubmit={handleSubmit} noValidate>
      <p className="hint">
        Fields marked <span className="required">*</span> are required.
      </p>

      <Alert type="success">{success}</Alert>
      <Alert type="error">{formError}</Alert>

      <div className="form-grid">
        <Field id="requester_name" label="Requester Name" error={errors.requester_name}>
          <input
            id="requester_name"
            name="requester_name"
            type="text"
            value={values.requester_name}
            onChange={handleChange}
            disabled={locked}
            {...ariaFor('requester_name')}
          />
        </Field>

        <Field id="requester_email" label="Requester Email" error={errors.requester_email}>
          <input
            id="requester_email"
            name="requester_email"
            type="email"
            value={values.requester_email}
            onChange={handleChange}
            disabled={locked}
            {...ariaFor('requester_email')}
          />
        </Field>

        <Field id="issue_category" label="Issue Category" error={errors.issue_category}>
          <select
            id="issue_category"
            name="issue_category"
            value={values.issue_category}
            onChange={handleChange}
            disabled={locked}
            {...ariaFor('issue_category')}
          >
            <option value="">Select category…</option>
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </Field>

        <Field id="priority" label="Priority" error={errors.priority}>
          <select
            id="priority"
            name="priority"
            value={values.priority}
            onChange={handleChange}
            disabled={locked}
            {...ariaFor('priority')}
          >
            <option value="">Select priority…</option>
            {PRIORITIES.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>
        </Field>

        {showStatus && (
          <Field id="status" label="Status" error={errors.status}>
            <select
              id="status"
              name="status"
              value={values.status}
              onChange={handleChange}
              disabled={locked}
              {...ariaFor('status')}
            >
              {STATUSES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </Field>
        )}

        <div className="span-2">
          <Field id="subject" label="Subject" error={errors.subject}>
            <input
              id="subject"
              name="subject"
              type="text"
              value={values.subject}
              onChange={handleChange}
              disabled={locked}
              {...ariaFor('subject')}
            />
          </Field>
        </div>

        <div className="span-2">
          <Field id="description" label="Description" error={errors.description}>
            <textarea
              id="description"
              name="description"
              rows={6}
              value={values.description}
              onChange={handleChange}
              disabled={locked}
              {...ariaFor('description')}
            />
          </Field>
        </div>
      </div>

      <div className="form-actions">
        <button type="button" className="btn btn-secondary" onClick={onCancel} disabled={submitting}>
          Cancel
        </button>
        <button type="submit" className="btn btn-primary" disabled={locked}>
          {submitting ? 'Saving…' : submitLabel}
        </button>
      </div>
    </form>
  );
}
