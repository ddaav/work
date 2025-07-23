import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import './HomePage.css';

export default function HomePage() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [featuredProducts, setFeaturedProducts] = useState([]);
  
  const slides = [
    {
      title: "Welcome to Our Platform",
      subtitle: "Discover amazing features and services",
      image: "https://images.unsplash.com/photo-1557804506-669a67965ba0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2074&q=80"
    },
    {
      title: "Premium Quality",
      subtitle: "Experience the best in class service",
      image: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2126&q=80"
    },
    {
      title: "24/7 Support",
      subtitle: "We're here to help you anytime",
      image: "https://images.unsplash.com/photo-1551434678-e076c223a692?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
    }
  ];

  const stats = [
    { number: "500+", label: "Happy Customers" },
    { number: "50+", label: "Products" },
    { number: "24/7", label: "Support" },
    { number: "5+", label: "Years Experience" }
  ];

  useEffect(() => {
    const fetchFurniture = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/furniture');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setFeaturedProducts(data);
      } catch (error) {
        console.error("Could not fetch furniture:", error);
      }
    };

    fetchFurniture();
  }, []);

  useEffect(() => {
    setIsLoaded(true);
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [slides.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className={`homepage ${isLoaded ? 'loaded' : ''}`}>
      {/* Navigation */}
      <nav className="navbar">
        <div className="nav-container">
          <div className="logo">
            <h2>Shades Design</h2>
          </div>
          
          <ul className="nav-menu">
            <li><Link to="/" className="nav-link">Home</Link></li>
            <li><a href="#products" className="nav-link">Products</a></li>
            <li><a href="#about" className="nav-link">About</a></li>
            <li><a href="#contact" className="nav-link">Contact</a></li>
          </ul>

          <div className="nav-buttons">
            {user ? (
              <>
                <span className="user-welcome">Welcome, {user.firstName}!</span>
                <button onClick={handleLogout} className="nav-btn login-btn">
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="nav-btn login-btn">Login</Link>
                <Link to="/register" className="nav-btn register-btn">Sign Up</Link>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Slider */}
      <section className="hero-slider">
        <div className="slide-container">
          {slides.map((slide, index) => (
            <div
              key={index}
              className={`slide ${index === currentSlide ? 'active' : ''}`}
              style={{ backgroundImage: `url(${slide.image})` }}
            >
              <div className="slide-content">
                <h1 className="slide-title">{slide.title}</h1>
                <p className="slide-subtitle">{slide.subtitle}</p>
                <button className="cta-button">Get Started</button>
              </div>
            </div>
          ))}
        </div>

        <button className="slider-btn prev-btn" onClick={prevSlide}>
          ‹
        </button>
        <button className="slider-btn next-btn" onClick={nextSlide}>
          ›
        </button>

        <div className="slider-dots">
          {slides.map((_, index) => (
            <button
              key={index}
              className={`dot ${index === currentSlide ? 'active' : ''}`}
              onClick={() => goToSlide(index)}
            />
          ))}
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats-section">
        <div className="container">
          <div className="stats-grid">
            {stats.map((stat, index) => (
              <div key={index} className="stat-item">
                <div className="stat-number">{stat.number}</div>
                <div className="stat-label">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section id="products" className="products-section">
        <div className="container">
          <h2>Featured Products</h2>
          <div className="products-grid">
            {featuredProducts.length > 0 ? (
              featuredProducts.map((product, index) => (
                <div key={index} className="product-card">
                  <div className="product-image">
                    <img src={product.image} alt={product.name} />
                    <div className="product-overlay">
                      <Link to={`/product/${product.id}`} className="product-btn">View Details</Link>
                    </div>
                    <div className="product-category">{product.category}</div>
                  </div>
                  <div className="product-info">
                    <h3 className="product-name">{product.name}</h3>
                    <p className="product-price">Npr {product.price}</p>
                  </div>
                </div>
              ))
            ) : (
              <p>No products available at the moment.</p>
            )}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="about-section">
        <div className="container">
          <div className="about-content">
            <div className="about-text">
              <h2>About Our Company</h2>
              <p>
                We are dedicated to providing the best service and products to our customers. 
                With years of experience and a passionate team, we strive to exceed expectations 
                and deliver exceptional value.
              </p>
              <div className="about-features">
                <div className="feature">
                  <div className="feature-icon">✨</div>
                  <div className="feature-text">
                    <h4>Premium Quality</h4>
                    <p>Handcrafted with the finest materials</p>
                  </div>
                </div>
                <div className="feature">
                  <div className="feature-icon">🚚</div>
                  <div className="feature-text">
                    <h4>Fast Delivery</h4>
                    <p>Free shipping on all orders</p>
                  </div>
                </div>
                <div className="feature">
                  <div className="feature-icon">🛡️</div>
                  <div className="feature-text">
                    <h4>Warranty</h4>
                    <p>5-year warranty on all products</p>
                  </div>
                </div>
              </div>
              <button className="about-btn">Learn More</button>
            </div>
            <div className="about-image">
              <img
                src="https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80"
                alt="About Us"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer id="contact" className="footer">
        <div className="container">
          <div className="footer-content">
            <div className="footer-section">
              <h3>Contact Us</h3>
              <p>Email: info@shadesdesign.com</p>
              <p>Phone: (+977) 9800000000 </p>
              <p>Address: Sirutar, Bhaktapur City, Nepal</p>
            </div>
            <div className="footer-section">
              <h3>Quick Links</h3>
              <ul>
                <li><a href="#products">Products</a></li>
                <li><a href="#about">About</a></li>
                <li><a href="#contact">Contact</a></li>
              </ul>
            </div>
            <div className="footer-section">
              <h3>Follow Us</h3>
              <ul>
                <li><a href="#">Facebook</a></li>
                <li><a href="#">Twitter</a></li>
                <li><a href="#">Instagram</a></li>
              </ul>
            </div>
          </div>
          <div className="footer-bottom">
            <p>&copy; 2024 Shades Design. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}