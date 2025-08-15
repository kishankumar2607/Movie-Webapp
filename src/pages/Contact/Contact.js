import React, { useState } from "react";
import "./styles.css";
import { Helmet } from "react-helmet-async";
import { Col, Container, Row } from "react-bootstrap";

const initial = { name: "", email: "", message: "" };

// Check validation
const validate = (values) => {
  const errs = {};

  if (!values.name.trim()) errs.name = "Name is required.";
  else if (values.name.trim().length < 2)
    errs.name = "Name must be at least 2 characters.";

  if (!values.email.trim()) errs.email = "Email is required.";
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email.trim()))
    errs.email = "Enter a valid email address.";

  if (!values.message.trim()) errs.message = "Message is required.";
  else if (values.message.trim().length < 10)
    errs.message = "Message must be at least 10 characters.";

  return errs;
};

const Contact = () => {
  const [form, setForm] = useState(initial);
  const [touched, setTouched] = useState({});
  const [ok, setOk] = useState(false);

  const errors = validate(form);
  const isInvalid = (field) => touched[field] && !!errors[field];

  // Handle onchnage event
  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((s) => ({ ...s, [name]: value }));
  };

  // Handle onblur event
  const onBlur = (e) => {
    const { name } = e.target;
    setTouched((s) => ({ ...s, [name]: true }));
  };

  // Handle submit event
  const onSubmit = (e) => {
    e.preventDefault();
    // mark all touched to show errors if any
    setTouched({ name: true, email: true, message: true });
    if (Object.keys(errors).length === 0) {
      setOk(true);
    }
  };

  return (
    <>
      <Helmet>
        <title>Contact - MovieFinder</title>
        <meta
          name="description"
          content="Questions, feature requests, or feedback? Send us a message."
        />
      </Helmet>

      <section className="contact">
        <div className="hero_bg" aria-hidden="true" />
        <Container>
          <div className="contact_header">
            <h1>Contact</h1>
            <p>
              Do you have any questions, any suggestions, or just want to say
              hi? We'd love to hear from you. Send us a message and we'll get
              back to you as soon as possible.
            </p>
          </div>

          {ok ? (
            <div className="success">
              <div className="success-panel" role="status" aria-live="polite">
                <h2>Thanks! 🎉</h2>
                <p>
                  We have received your message and will get back to you as soon
                  as possible on <strong>{form.email}</strong>. Thank you for
                  reaching out!
                </p>
              </div>
            </div>
          ) : (
            <Row className="contact-grid">
              <Col className="panel">
                <form className="form" onSubmit={onSubmit} noValidate>
                  {/* Name */}
                  <div
                    className={`field ${isInvalid("name") ? "has-error" : ""}`}
                  >
                    <label htmlFor="name">Full Name</label>
                    <input
                      id="name"
                      name="name"
                      className={`input ${
                        isInvalid("name") ? "is-invalid" : ""
                      }`}
                      value={form.name}
                      onChange={onChange}
                      onBlur={onBlur}
                      aria-invalid={isInvalid("name")}
                      aria-describedby={
                        isInvalid("name") ? "name-error" : undefined
                      }
                      required
                    />
                    {isInvalid("name") && (
                      <p id="name-error" className="error-text" role="alert">
                        {errors.name}
                      </p>
                    )}
                  </div>

                  {/* Email */}
                  <div
                    className={`field ${isInvalid("email") ? "has-error" : ""}`}
                  >
                    <label htmlFor="email">Email</label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      className={`input ${
                        isInvalid("email") ? "is-invalid" : ""
                      }`}
                      value={form.email}
                      onChange={onChange}
                      onBlur={onBlur}
                      aria-invalid={isInvalid("email")}
                      aria-describedby={
                        isInvalid("email") ? "email-error" : undefined
                      }
                      required
                    />
                    {isInvalid("email") && (
                      <p id="email-error" className="error-text" role="alert">
                        {errors.email}
                      </p>
                    )}
                  </div>

                  {/* Message */}
                  <div
                    className={`field ${
                      isInvalid("message") ? "has-error" : ""
                    }`}
                  >
                    <label htmlFor="message">Message</label>
                    <textarea
                      id="message"
                      name="message"
                      rows="6"
                      className={`textarea ${
                        isInvalid("message") ? "is-invalid" : ""
                      }`}
                      value={form.message}
                      onChange={onChange}
                      onBlur={onBlur}
                      aria-invalid={isInvalid("message")}
                      aria-describedby={
                        isInvalid("message") ? "message-error" : undefined
                      }
                      required
                    />
                    {isInvalid("message") && (
                      <p id="message-error" className="error-text" role="alert">
                        {errors.message}
                      </p>
                    )}
                  </div>

                  <button className="btn btn-accent btn-lg mt-2" type="submit">
                    Send Message
                  </button>
                </form>
              </Col>

              <Col className="panel contact-image-div">
                <img
                  src="/assets/images/contact-us.png"
                  alt="Contact us"
                  className="contact-image"
                />
              </Col>
            </Row>
          )}
        </Container>
      </section>
    </>
  );
};

export default Contact;
