import Link from 'next/link';
import { children } from '@/lib/data';
import { notFound } from 'next/navigation';

export default function ChildProfilePage({ params }: { params: { id: string } }) {
  const child = children.find((c) => c.id === params.id);
  if (!child) notFound();
  return (
    <div>
      <nav className="nav-bar">
        <Link href="/">Adoption Haven</Link>
        <Link href="/children">Meet the children</Link>
      </nav>
      <div className="page-content" style={{ maxWidth: '640px', margin: '0 auto' }}>
        <h1>{child.displayName}</h1>
        <p style={{ color: 'var(--text-muted)', marginBottom: '1rem' }}>Age {child.age}</p>
        <p style={{ marginBottom: '1rem' }}>{child.shortDescription}</p>
        <div className="card" style={{ marginBottom: '1rem' }}>
          <h3 style={{ marginBottom: '0.5rem' }}>Needs</h3>
          <ul style={{ paddingLeft: '1.25rem', color: 'var(--text-muted)' }}>
            {child.needs.map((n) => (
              <li key={n}>{n}</li>
            ))}
          </ul>
        </div>
        <div className="card" style={{ marginBottom: '1rem' }}>
          <h3 style={{ marginBottom: '0.5rem' }}>Preferences & interests</h3>
          <p style={{ color: 'var(--text-muted)' }}>
            {child.preferences.join(', ')}. Interests: {child.interests.join(', ')}.
          </p>
        </div>
        {child.siblingGroupId && (
          <p style={{ marginBottom: '1rem', color: 'var(--text-muted)' }}>
            This child is part of a sibling group.
          </p>
        )}
        <Link href="/register" className="btn btn-primary">
          I want to adopt
        </Link>
      </div>
    </div>
  );
}
