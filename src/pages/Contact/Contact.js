
import React, { useState } from 'react';
import './styles.css';

const Contact = () => {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [ok, setOk] = useState(false);

  const onChange = e => setForm({ ...form, [e.target.name]: e.target.value });
  const onSubmit = e => {
    e.preventDefault();
    if (!form.name || !form.email.includes('@') || form.message.trim().length < 10) return alert('Please fill all fields');
    setOk(true);
  };

  if (ok) return <section><h1>Thanks!</h1><p>We received your message.</p></section>;

  return (
    <section>
      <h1>Contact</h1>
      <form className="form" onSubmit={onSubmit} noValidate>
        <label htmlFor="name">Name</label>
        <input id="name" name="name" value={form.name} onChange={onChange} required />
        <label htmlFor="email">Email</label>
        <input id="email" name="email" type="email" value={form.email} onChange={onChange} required />
        <label htmlFor="message">Message</label>
        <textarea id="message" name="message" rows="5" value={form.message} onChange={onChange} required />
        <button className="btn">Send</button>
      </form>
    </section>
  );
};

export default Contact;
