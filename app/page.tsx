import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="home">
      <header className="hero">
        <div className="hero-inner">
          <h1>Adoption Haven</h1>
          <p className="tagline">Safe families for every child. Every child deserves a good life.</p>
          <nav className="ctas">
            <Link href="/register" className="btn btn-primary">
              I want to adopt
            </Link>
            <Link href="/children" className="btn btn-secondary">
              Meet the children
            </Link>
            <Link href="/admin" className="btn btn-ghost">
              Staff / Verify families
            </Link>
          </nav>
        </div>
      </header>

      <section className="section how">
        <h2>How it works</h2>
        <div className="cards">
          <div className="card">
            <span className="card-num">1</span>
            <h3>Create your profile</h3>
            <p>Families share their background, home, and preferences. We use this to match and to verify.</p>
          </div>
          <div className="card">
            <span className="card-num">2</span>
            <h3>Verification</h3>
            <p>Every adopter is verified. We block dangerous individuals and only approve safe, capable families.</p>
          </div>
          <div className="card">
            <span className="card-num">3</span>
            <h3>Matching</h3>
            <p>We match children with families based on needs, preferences, and compatibility.</p>
          </div>
        </div>
      </section>

      <section className="section safety">
        <h2>Child safety first</h2>
        <p className="safety-text">
          We screen every family. Background checks, references, and manual review help us keep children safe from harm.
        </p>
      </section>

      <footer className="footer">
        <p>Adoption Haven – Giving every child an equal chance at a good life.</p>
      </footer>
    </div>
  );
}
