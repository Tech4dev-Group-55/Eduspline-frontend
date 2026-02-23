
import { useState } from "react";
import classroom from "../assets/classroom.jpg";

function ContactSection() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Message sent (demo)");
    setFormData({ name: "", email: "", message: "" });
  };

  return (
    <section className="contact-section">
      <div className="section-inner contact-flex">
        <div className="image-box">
          <img src={classroom} alt="Classroom" />
        </div>

        <div className="form-area">
          <h3>Ready to elevate your learning ecosystem?</h3>
          <p>
            Contact us for a personalized walkthrough and see how EduSpline
            can support your institution’s next phase of growth.
          </p>

          <form onSubmit={handleSubmit}>
            <input
              type="text"
              id="name"
              placeholder="Enter your name here"
              value={formData.name}
              onChange={handleChange}
            />
            <input
              type="email"
              id="email"
              placeholder="Enter your email here"
              value={formData.email}
              onChange={handleChange}
            />
            <textarea
              id="message"
              placeholder="Type your message here"
              value={formData.message}
              onChange={handleChange}
            />
            <button className="send-btn">← Send</button>
          </form>
        </div>
      </div>
    </section>
  );
}

export default ContactSection;