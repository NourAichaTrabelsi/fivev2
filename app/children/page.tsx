import Link from 'next/link';
import { children } from '@/lib/data';

export default function ChildrenPage() {
  const available = children.filter((c) => c.status === 'available');
  return (
    <div>
      <nav className="nav-bar">
        <Link href="/">Adoption Haven</Link>
        <Link href="/register">I want to adopt</Link>
      </nav>
      <div className="page-title">
        <h1>Meet the children</h1>
        <p style={{ color: 'var(--text-muted)', marginTop: '0.5rem' }}>
          These children are waiting for a safe, loving family. Profiles are non-identifying to protect privacy.
        </p>
      </div>
      <div className="page-content">
        {available.length === 0 ? (
          <p>No children currently available.</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {available.map((child) => (
              <div key={child.id} className="list-card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.75rem' }}>
                  <div>
                    <h3>{child.displayName}</h3>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                      Age {child.age} · {child.shortDescription}
                    </p>
                    <div style={{ marginTop: '0.5rem', display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
                      {child.needs.map((n) => (
                        <span key={n} className="badge badge-pending">{n}</span>
                      ))}
                      {child.interests.slice(0, 3).map((i) => (
                        <span key={i} className="badge badge-approved">{i}</span>
                      ))}
                    </div>
                  </div>
                  <Link href={`/children/${child.id}`} className="btn btn-secondary">
                    View profile
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
