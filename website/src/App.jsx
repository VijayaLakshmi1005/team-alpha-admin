import React, { useEffect } from 'react';
import './App.css';
import { Instagram, Mail, MapPin } from 'lucide-react';

function App() {
  // Fade-in effect on scroll
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    }, { threshold: 0.1 });

    document.querySelectorAll('.fade-on-scroll').forEach((el) => {
      observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <div className="layout">
      {/* Navigation */}
      <nav className="nav">
        <div className="container nav-container flex items-center justify-between">
          <div className="nav-logo">Team Alpha</div>
          <div className="nav-links flex gap-md">
            <a href="#portfolio">Portfolio</a>
            <a href="#approach">Approach</a>
            <a href="#contact">Contact</a>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="hero section">
        <div className="container flex flex-col items-center justify-center text-center">
          <h1 className="display-1 mb-md animate-fade-in">Capturing Honest <br /> & Elegant Moments</h1>
          <p className="text-lg text-warmgrey mb-lg animate-fade-in hero-subtitle">Authentic wedding photography for modern lovers.</p>
          <div className="hero-images flex gap-md justify-center w-full animate-fade-in">
            <div className="hero-img-box img-tall parallax">
              <img src="https://images.unsplash.com/photo-1511285560982-1351cdeb9821?q=80&w=800" alt="Bride and Groom" loading="lazy" />
            </div>
            <div className="hero-img-box img-wide parallax">
              <img src="https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=800" alt="Wedding Vows" loading="lazy" />
            </div>
          </div>
        </div>
      </header>

      {/* Approach / Philosophy Section */}
      <section id="approach" className="section bg-softbeige">
        <div className="container flex flex-col items-center">
          <div className="approach-content text-center fade-on-scroll">
            <h2 className="text-sm text-warmgrey mb-md">Our Philosophy</h2>
            <h3 className="heading-2 mb-md">We believe in timeless storytelling, <br /> leaving space for genuine emotion to unfold naturally.</h3>
            <p className="text-lg text-charcoal mb-lg approach-text">Our approach is quiet and intentional, letting your day breathe while we capture the fleeting beauty in between the planned moments.</p>
            <a href="#contact" className="btn btn-primary">Inquire Now</a>
          </div>
        </div>
      </section>

      {/* Selected Works - Large Blocks */}
      <section id="portfolio" className="section bg-ivory">
        <div className="container">
          <h2 className="text-sm text-warmgrey mb-lg text-center fade-on-scroll">Selected Works</h2>

          <div className="portfolio-grid grid">
            <div className="portfolio-item fade-on-scroll">
              <img src="https://images.unsplash.com/photo-1621621667797-e06afc217fb0?q=80&w=1200" alt="Haldi Moment" loading="lazy" />
              <div className="portfolio-meta">
                <span className="text-sm">Haldi / Mumbai</span>
                <h4 className="heading-3">The Joy of Yellow</h4>
              </div>
            </div>

            <div className="portfolio-item reverse fade-on-scroll">
              <img src="https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?q=80&w=1200" alt="Pre-wedding" loading="lazy" />
              <div className="portfolio-meta">
                <span className="text-sm">Pre-wedding / Udaipur</span>
                <h4 className="heading-3">A Quiet Lake</h4>
              </div>
            </div>

            <div className="portfolio-item fade-on-scroll">
              <img src="https://images.unsplash.com/photo-1606800052052-a08af7148866?q=80&w=1200" alt="Details" loading="lazy" />
              <div className="portfolio-meta">
                <span className="text-sm">Wedding / Jaipur</span>
                <h4 className="heading-3">Floral Details</h4>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action Footer */}
      <footer id="contact" className="section bg-charcoal text-ivory text-center">
        <div className="container flex flex-col items-center fade-on-scroll">
          <h2 className="heading-1 mb-md">Let's tell your story.</h2>
          <p className="text-lg text-warmgrey mb-lg max-w-2xl">We take on a limited number of weddings each year to ensure we give our couples our full creative attention. We would love to hear about your plans.</p>

          <a href="mailto:hello@teamalpha.com" className="btn btn-secondary mb-xl">Contact Us</a>

          <div className="footer-bottom flex justify-between w-full mt-xl text-warmgrey text-xs uppercase tracking-wide">
            <div className="flex gap-md">
              <span className="flex items-center gap-xs"><MapPin size={14} /> Bangalore, India</span>
              <span className="flex items-center gap-xs"><Mail size={14} /> info@teamalpha.com</span>
            </div>
            <div className="flex gap-md">
              <a href="#" className="flex items-center gap-xs hover-white"><Instagram size={14} /> Instagram</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
