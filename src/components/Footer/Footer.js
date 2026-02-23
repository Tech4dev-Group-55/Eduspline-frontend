
function Footer() {
  return (
    <footer className="footer">

      <div className="section-inner footer-grid">

        <div>
          <h4>Data Driven Support</h4>
          <p>We are a remote company</p>
          <p>eduspline@gmail.com</p>
          <p>(239) 555-0108</p>
        </div>

        <div>
          <h4>Contact Us</h4>
          <p>Request a Demo</p>
          <p>Send a message</p>
        </div>

        <div>
          <h4>Pricing</h4>
          <p>Solutions</p>
          <p>Blog</p>
        </div>

        <div>
          <h4>Subscribe to our newsletter</h4>
          <div className="newsletter">
            <input type="email" placeholder="enter your email here" />
            <button>← Subscribe</button>

          </div>

        </div>

      </div>

      <div className="footer-bottom">
        © All Rights Reserved 2026
      </div>
      
    </footer>
  );
}

export default Footer;