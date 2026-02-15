'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import type { FamilyProfile, MatchResult } from '@/types';

function StatusBadge({ status }: { status: string }) {
  const c = `badge badge-${status}`;
  return <span className={c}>{status.replace('_', ' ')}</span>;
}

export default function FamilyDashboardPage({ params }: { params: { id: string } }) {
  const [family, setFamily] = useState<FamilyProfile | null>(null);
  const [matches, setMatches] = useState<MatchResult[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const [fRes, mRes] = await Promise.all([
        fetch('/api/families'),
        fetch(`/api/match?familyId=${params.id}`),
      ]);
      const fams: FamilyProfile[] = await fRes.json();
      setFamily(fams.find((f) => f.id === params.id) ?? null);
      if (mRes.ok) setMatches(await mRes.json());
      setLoading(false);
    })();
  }, [params.id]);

  if (loading) return <div className="page-content">Loading…</div>;
  if (!family) {
    return (
      <div className="page-content">
        <p>Profile not found.</p>
        <Link href="/">Go home</Link>
      </div>
    );
  }

  const approved = family.verificationStatus === 'approved';

  return (
    <div>
      <nav className="nav-bar">
        <Link href="/">Adoption Haven</Link>
        <Link href="/children">Meet the children</Link>
      </nav>
      <div className="page-title">
        <h1>Your family profile</h1>
        <p style={{ color: 'var(--text-muted)', marginTop: '0.5rem' }}>
          Status: <StatusBadge status={family.verificationStatus} />
        </p>
      </div>
      <div className="page-content">
        {family.verificationStatus === 'rejected' && family.rejectionReason && (
          <div className="list-card" style={{ borderColor: 'var(--danger-soft)', background: 'var(--danger-soft)' }}>
            <strong>Application note:</strong> {family.rejectionReason}
          </div>
        )}
        {family.verificationStatus === 'blocked' && (
          <div className="list-card" style={{ borderColor: 'var(--danger)', background: 'var(--danger-soft)' }}>
            <strong>Your account has been blocked</strong> for safety reasons. Contact support if you believe this is an error.
          </div>
        )}
        <div className="card" style={{ marginBottom: '1.5rem' }}>
          <h3>Contact</h3>
          <p>{family.contactName} · {family.email} · {family.phone}</p>
          <p style={{ color: 'var(--text-muted)' }}>{family.location}</p>
        </div>
        <div className="card" style={{ marginBottom: '1.5rem' }}>
          <h3>Home & preferences</h3>
          <p>
            {family.housingType}, {family.hasYard ? 'with yard' : 'no yard'}.
            {family.pets.length ? ` Pets: ${family.pets.join(', ')}.` : ' No pets.'}
          </p>
          <p>
            Preferred age: {family.preferredAgeRange[0]}–{family.preferredAgeRange[1]}.
            Open to sibling groups: {family.preferredSiblingGroup ? 'Yes' : 'No'}.
            Open to special needs: {family.openToSpecialNeeds ? 'Yes' : 'No'}.
          </p>
        </div>

        <h2 style={{ marginBottom: '1rem' }}>Your matches</h2>
        {!approved ? (
          <p style={{ color: 'var(--text-muted)' }}>
            After your profile is verified, you’ll see suggested matches here.
          </p>
        ) : matches.length === 0 ? (
          <p style={{ color: 'var(--text-muted)' }}>No matches yet. Check back later.</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {matches.map((m) => (
              <div key={m.child.id} className="list-card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.75rem' }}>
                  <div>
                    <h3>{m.child.displayName}</h3>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>{m.child.shortDescription}</p>
                    <div style={{ marginTop: '0.5rem' }}>
                      <span
                        className={
                          m.score >= 60 ? 'match-score match-score-high' :
                          m.score >= 40 ? 'match-score match-score-mid' : 'match-score match-score-low'
                        }
                      >
                        {m.score}% match
                      </span>
                    </div>
                    <ul style={{ marginTop: '0.5rem', paddingLeft: '1.25rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                      {m.reasons.slice(0, 3).map((r) => (
                        <li key={r}>{r}</li>
                      ))}
                    </ul>
                  </div>
                  <Link href={`/children/${m.child.id}`} className="btn btn-secondary">
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
