import "./Testimonials.css";

const testimonials = [
  {
    id: 1,
    quote:
      '"EduSpline transformed how we structure and evaluate our programs. More student\'s got to the finish line, and Teachers saw exactly where each student is struggling and how best to support their learning"',
    role: "Director of Learning Innovation, GU",
    name: "Maria Yaa",
    avatar: "/images/testimage1.png", 
    stars: 5,
  },
  {
    id: 2,
    quote:
      '"The analytics alone justified the investment. We finally understood learner\'s progression at a granular level."',
    role: "Head of L&D, Enterprise Technology Firm",
    name: "Adaugo E.",
    avatar: "/images/testimage2.png", 
    stars: 5,
  },
  {
    id: 3,
    quote:
      '"I feel seen and supported all through my learning. The platform picks up patterns i did not even notice was the reason for my poor performance."',
    role: "Head of L&D, Our Platform Inc.",
    name: "Ayomide Dave",
    avatar: "/images/testimage3.png",
    stars: 5,
  },
];

function StarRating({ count }) {
  return (
    <div className="stars" aria-label={`${count} out of 5 stars`}>
      {Array.from({ length: count }).map((_, i) => (
        <img
          key={i}
          src="/icons/star.svg" 
          alt=""
          className="star-icon"
          aria-hidden="true"
        />
      ))}
    </div>
  );
}

function TestimonialCard({ testimonial }) {
  return (
    <div className="testimonial-card">
      <StarRating count={testimonial.stars} />
      <p className="testimonial-quote">{testimonial.quote}</p>
      <div className="testimonial-author">
        <img
          src={testimonial.avatar}
          alt={testimonial.name}
          className="author-avatar"
          onError={(e) => {
            // Fallback placeholder if image not yet available
            e.currentTarget.style.display = "none";
            e.currentTarget.nextSibling.style.display = "flex";
          }}
        />
        <span
          className="author-avatar-placeholder"
          style={{ display: "none" }}
          aria-hidden="true"
        >
          {testimonial.name.charAt(0)}
        </span>
        <div className="author-info">
          <span className="author-role">{testimonial.role}</span>
          <span className="author-name">{testimonial.name}</span>
        </div>
      </div>
    </div>
  );
}

export default function Testimonials() {
  return (
    <section className="testimonials-section">
      <div className="testimonials-container">
        <div className="testimonials-header">
          <h2 className="testimonials-title">Hear from our Clients</h2>
          <span className="testimonials-underline" aria-hidden="true" />
        </div>

        <div className="testimonials-grid">
          {testimonials.map((t) => (
            <TestimonialCard key={t.id} testimonial={t} />
          ))}
        </div>
      </div>
    </section>
  );
}