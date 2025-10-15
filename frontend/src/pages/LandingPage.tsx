import '../styles/LandingPage.css';
//import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { FaTwitter, FaInstagram, FaFacebook } from 'react-icons/fa';

/*function getStoredUser() {
  const userJson = localStorage.getItem('user');
  return userJson ? JSON.parse(userJson) : null;
}*/

// The correct way to declare a functional component with destructured props
const LandingPage = () => {
  
  return (
    <div className="landing-container">
      <main className="landing-main">
        
        {/* --- HERO SECTION --- */}
        <section className="hero-section">
          <div className="hero-content">
            <h2>Simplify Your Event Planning</h2>
            <p>Create, manage, and track gift lists for all your special occasions.</p>
          </div>
        </section>

        {/* --- INTRO CARDS SECTION --- */}
        <section className="intro-section">
          <h2>Gifting made easy for everyone</h2>
          <div className="intro-cards">
            <div className="intro-card">
              <img src="../src/assets/gift.png" alt="Gift" />
              <p>Make it easy for your friends and family to get you the perfect gifts</p>
            </div>
            <div className="intro-card">
              <img src="../src/assets/giftlist.png" alt="Gift List" />
              <p>Create a gift list to get the gifts you really really want</p>
            </div>
          </div>
          <h3 className="intro-subtext">
            The ultimate gifting solution for you and your friends and family
          </h3>
          <button className="cta-btn">
            <Link to="/login" className="cta-link">Get Started Now</Link>
          </button>
        </section>

        {/* --- STORES SECTION --- */}
        <section className="stores-section">
          <h2>One perfect list with all your favorite gifts</h2>
          <div className='stores-overall'>  
              <div className="stores-content">
                <p>
                  Staying organized is easy with one shareable and shoppable list. You can add gifts 
                  from your favorite retailers using our browser extension, and sync your store registries 
                  to your account—all while enjoying the store perks. Make gift-giving easy for friends and family!
                </p>
              </div>
              <div className="stores-grid">
                {["Amazon", "ikea", "firstcry", "homecentre", "nicobar", 
                  "mothercare", "hauskinder", "hm", "flipkart"].map((store) => (
                  <div key={store} className="store-card">
                    <img src={`../src/assets/${store}.png`} alt={store} />
                  </div>
                ))}
              </div>
          </div>
        </section>

        {/* --- TESTIMONIALS SECTION --- */}
        <section className="testimonials-section">
          <h2>Testimonials</h2>
          <p>See what members have to say about us</p>
          <div className="testimonials-grid">
            <div className="testimonial">
              <p>"I love the app. It’s very easy to use and share my gift list. My family uses it for holidays and birthdays!"</p>
              <span>- Cece</span>
            </div>
            <div className="testimonial">
              <p>"I love being able to pull all my items into one place for my baby registry. The interface is clean and easy!"</p>
              <span>- Kim</span>
            </div>
            <div className="testimonial">
              <p>"I have a wedding registry, housewarming wish list, and personal gift lists here. I’d 100% recommend it!"</p>
              <span>- Lindsey</span>
            </div>
            <div className="testimonial">
              <p>"All my registries are now connected! Guests shop in one place, and I get notifications when gifts are bought."</p>
              <span>- Joanna</span>
            </div>
          </div>
        </section>

      </main>

      <footer className="landing-footer">
        <div className="footer-main">
          <p>&copy; 2025 Gift Planner</p>
          <nav className="footer-links">
            <Link to="/about">About Us</Link>
            <Link to="/contact">Contact</Link>
            <Link to="/privacy">Privacy Policy</Link>
            <Link to="/terms">Terms of Use</Link>
          </nav>
        </div>
        <div className="footer-community">
          <p>
            Made with <span style={{color: "#f44336"}}>♥</span> in India by the Gift Planner Team.
            &nbsp; | &nbsp; 
            <a href="mailto:support@giftplanner.com" style={{ color: "#fff", textDecoration: "underline" }}>support@giftplanner.com</a>
          </p>
          <div className="footer-social">
            <a href="https://twitter.com/" target="_blank" rel="noopener noreferrer" aria-label="Twitter">
              <FaTwitter />
            </a>
            <a href="https://instagram.com/" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
              <FaInstagram />
            </a>
            <a href="https://facebook.com/" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
              <FaFacebook />
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
