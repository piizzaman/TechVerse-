import { Link } from "react-router-dom";
import "../styles/hero.css";
function Hero() {
  return (
    <section className="hero">
      <div className="hero-content">
        <div className="hero-text">
          <p className="hero-eyebrow">THE NEXT GENERATION OF TECH</p>
          <h1>Build your<br /><span>better setup.</span></h1>
          <p className="hero-description">Thoughtful tech essentials for gaming, creating, and everything in between.</p>
          <div className="hero-buttons"><a className="shop-btn" href="#products">Explore products <span aria-hidden="true">→</span></a><Link className="browse-btn" to="/register">Create an account</Link></div>
          <div className="hero-proof"><span>● Curated gear</span><span>● Simple checkout demo</span><span>● Built for creators</span></div>
        </div>
        <div className="hero-art" aria-label="Featured gaming hardware" role="img"><div className="art-orbit orbit-one"/><div className="art-orbit orbit-two"/><div className="art-card"><span>TECHVERSE / 001</span><div className="gpu-shape"><i/><i/><i/></div><strong>PERFORMANCE<br/>MEETS DESIGN.</strong><small>UPGRADE YOUR WORKSPACE</small></div><div className="art-chip">EST. FOR WHAT'S NEXT</div></div>
      </div>
    </section>
  );
}
export default Hero;
