
function TestimonialCard({ quote, title, name }) {
  return (
    <div className="testimonial-card">

      <div className="stars">★★★★★</div>

      <p className="quote">“{quote}”</p>

      <div className="client-info">

        <strong>{title}</strong>

        <span>{name}</span>

      </div>

    </div>
  );
}

export default TestimonialCard;