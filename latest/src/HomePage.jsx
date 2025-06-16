import { useState } from 'react';
import './HomePage.css';

export default function HomePage() {
  const [currentSlide, setCurrentSlide] = useState(0);
  
  const slides = [
    {
      title: "Modern Living Spaces",
      subtitle: "Transform your home with our contemporary furniture collection",
      image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"
    },
    {
      title: "Elegant Bedroom Sets",
      subtitle: "Create your perfect sanctuary with our luxury bedroom furniture",
      image: "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"
    },
    {
      title: "Designer Dining Rooms",
      subtitle: "Bring family together with our stunning dining room collections",
      image: "https://images.unsplash.com/photo-1449247709967-d4461a6a6103?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"
    }
  ];

  const featuredProducts = [
    {
      name: "Modern Sofa Set",
      price: "$1,299",
      image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"
    },
    {
      name: "Oak Dining Table",
      price: "$899",
      image: "https://images.unsplash.com/photo-1449247709967-d4461a6a6103?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"
    },
    {
      name: "Luxury Bed Frame",
      price: "$1,599",
      image: "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"
    },
    {
      name: "Office Chair",
      price: "$399",
      image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"
    }
  ];

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  return (
    <div className="homepage">
      {/* Navigation */}
      <nav className="navbar">
        <div className="nav-container">
          <div className="logo">
            <h2>Shades Design Furniture</h2>
          </div>
          <div className="nav-menu">
            <a href="#home" className="nav-link">Home</a>
            <a href="#products" className="nav-link">Products</a>
            <a href="#about" className="nav-link">About</a>
            <a href="#contact" className="nav-link">Contact</a>
            <div className="nav-buttons">
              <button className="nav-btn login-btn">Login</button>
              <button className="nav-btn register-btn">Register</button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section with Slider */}
      <section className="hero-slider">
        <div className="slide-container">
          {slides.map((slide, index) => (
            <div 
              key={index}
              className={`slide ${index === currentSlide ? 'active' : ''}`}
              style={{backgroundImage: `url(${slide.image})`}}
            >
              <div className="slide-content">
                <h1 className="slide-title">{slide.title}</h1>
                <p className="slide-subtitle">{slide.subtitle}</p>
                <button className="cta-button">Shop Now</button>
              </div>
            </div>
          ))}
        </div>
        <button className="slider-btn prev-btn" onClick={prevSlide}>‹</button>
        <button className="slider-btn next-btn" onClick={nextSlide}>›</button>
        <div className="slider-dots">
          {slides.map((_, index) => (
            <button 
              key={index}
              className={`dot ${index === currentSlide ? 'active' : ''}`}
              onClick={() => setCurrentSlide(index)}
            />
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section className="featured-products">
        <div className="container">
          <h2 className="section-title">Featured Products</h2>
          <div className="products-grid">
            {featuredProducts.map((product, index) => (
              <div key={index} className="product-card">
                <div className="product-image">
                  <img src={product.image} alt={product.name} />
                  <div className="product-overlay">
                    <button className="product-btn">View Details</button>
                  </div>
                </div>
                <div className="product-info">
                  <h3 className="product-name">{product.name}</h3>
                  <p className="product-price">{product.price}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="about-section">
        <div className="container">
          <div className="about-content">
            <div className="about-text">
              <h2>About Shades Design Furniture</h2>
              <p>
                For over 20 years, Shades Design Furniture has been crafting exceptional 
                furniture pieces that transform houses into homes. Our commitment to quality, 
                style, and customer satisfaction has made us a trusted name in home furnishing.
              </p>
              <p>
                From modern minimalist designs to classic traditional pieces, we offer a 
                comprehensive range of furniture to suit every taste and budget.
              </p>
              <button className="about-btn">Learn More</button>
            </div>
            <div className="about-image">
              <img src="https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80" alt="About Us" />
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <div className="footer-content">
            <div className="footer-section">
              <h3>Shades Design Furniture</h3>
              <p>Creating beautiful spaces with quality furniture since 2004.</p>
            </div>
            <div className="footer-section">
              <h4>Quick Links</h4>
              <ul>
                <li><a href="#home">Home</a></li>
                <li><a href="#products">Products</a></li>
                <li><a href="#about">About</a></li>
                <li><a href="#contact">Contact</a></li>
              </ul>
            </div>
            <div className="footer-section">
              <h4>Contact Info</h4>
              <p>📞 (977) 9800000000</p>
              <p>📧 info@shadesdesign.com</p>
              <p>📍 sirutar chowk, Bhaktapur</p>
            </div>
          </div>
          <div className="footer-bottom">
            <p>&copy; 2024 Shades Design Furniture. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}