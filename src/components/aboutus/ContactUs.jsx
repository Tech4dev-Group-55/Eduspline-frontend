import React, { useState } from 'react';
import './ContactUs.css';

const ContactUs = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form Submitted:', formData);
    alert('Thank you for contacting EduSpline!');
  };

  return (
    <section className="contact-section">
      <div className="contact-container">
        <h2 className="contact-title">Contact Us</h2>
        <div className="contact-underline"></div>

        <div className="contact-content">
          {/* Left Side: Image Placeholder */}
          <div className="contact-image-container">
            <img 
              src="https://unsplash.com/photos/a-group-of-people-sitting-at-desks-in-front-of-a-whiteboard-F60486ko0r0" 
              alt="Classroom" 
              className="contact-image"
            />
          </div>

          {/* Right Side: Form */}
          <div className="contact-form-container">
            <h3 className="form-heading">Ready to elevate your learning ecosystem?</h3>
            <p className="form-subtext">
              Contact us for a personalized walkthrough and see how EduSpline can support your institution's next phase of growth.
            </p>

            <form className="contact-form" onSubmit={handleSubmit}>
              <div className="input-group">
                <label>Name</label>
                <input 
                  type="text" 
                  name="name" 
                  placeholder="Enter your name here" 
                  value={formData.name}
                  onChange={handleChange}
                  required 
                />
              </div>

              <div className="input-group">
                <label>Email</label>
                <input 
                  type="email" 
                  name="email" 
                  placeholder="Enter your email here" 
                  value={formData.email}
                  onChange={handleChange}
                  required 
                />
              </div>

              <div className="input-group">
                <label>Message</label>
                <textarea 
                  name="message" 
                  placeholder="Type your message here" 
                  rows="4"
                  value={formData.message}
                  onChange={handleChange}
                  required
                ></textarea>
              </div>

              <button type="submit" className="send-button">Send</button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactUs;