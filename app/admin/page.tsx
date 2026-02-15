'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import type { FamilyProfile, VerificationStatus } from '@/types';

function StatusBadge({ status }: { status: string }) {
  const c = `badge badge-${status}`;
  return <span className={c}>{status.replace('_', ' ')}</span>;
}

export default function AdminPage() {
  const [families, setFamilies] = useState<FamilyProfile[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/families')
      .then((r) => r.json())
      .then(setFamilies)
      .finally(() => setLoading(false));
  }, []);

  async function updateVerification(
    familyId: string,
    status: VerificationStatus,
    rejectionReason?: string,
    redFlags?: string[]
  ) {
    const res = await fetch('/api/verify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ familyId, status, rejectionReason, redFlags }),
    });
    if (res.ok) {
      const updated = await res.json();
      setFamilies((prev) => prev.map((f) => (f.id === familyId ? updated : f)));
    }
  }

  if (loading) return <div className="page-content">Loading…</div>;

  const pending = families.filter(
    (f) => f.verificationStatus === 'pending' || f.verificationStatus === 'in_review'
  );
  const approved = families.filter((f) => f.verificationStatus === 'approved');
  const rejectedOrBlocked = families.filter(
    (f) => f.verificationStatus === 'rejected' || f.verificationStatus === 'blocked'
  );

  return (
    <div>
      <nav className="nav-bar">
        <Link href="/">Adoption Haven</Link>
      </nav>
      <div className="page-title">
        <h1>Verify adopters</h1>
        <p style={{ color: 'var(--text-muted)', marginTop: '0.5rem' }}>
          Review applications and block dangerous individuals. Child safety depends on thorough verification.
        </p>
      </div>
      <div className="page-content">
        <h2 style={{ marginBottom: '1rem' }}>Pending review ({pending.length})</h2>
        {pending.length === 0 ? (
          <p style={{ color: 'var(--text-muted)' }}>No applications pending.</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2rem' }}>
            {pending.map((f) => (
              <div key={f.id} className="list-card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
                  <div>
                    <h3>{f.contactName}</h3>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                      {f.email} · {f.location} · {f.occupation}
                    </p>
                    <p style={{ fontSize: '0.9rem' }}>
                      Age pref: {f.preferredAgeRange[0]}–{f.preferredAgeRange[1]}. Special needs: {f.openToSpecialNeeds ? 'Yes' : 'No'}.
                    </p>
                    {f.applicationNotes && (
                      <p style={{ marginTop: '0.5rem', fontSize: '0.9rem' }}><em>{f.applicationNotes}</em></p>
                    )}
                    <StatusBadge status={f.verificationStatus} />
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                    <button
                      type="button"
                      className="btn btn-primary"
                      onClick={() => updateVerification(f.id, 'approved')}
                    >
                      Approve
                    </button>
                    <button
                      type="button"
                      className="btn btn-secondary"
                      onClick={() => {
                        const reason = prompt('Rejection reason (optional):');
                        updateVerification(f.id, 'rejected', reason || undefined);
                      }}
                    >
                      Reject
                    </button>
                    <button
                      type="button"
                      className="btn"
                      style={{ background: 'var(--danger)', color: 'white', border: 'none' }}
                      onClick={() => {
                        const flags = prompt('Red flags (comma-separated):');
                        updateVerification(
                          f.id,
                          'blocked',
                          'Blocked for safety.',
                          flags ? flags.split(',').map((s) => s.trim()) : undefined
                        );
                      }}
                    >
                      Block (safety)
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <h2 style={{ marginBottom: '1rem' }}>Approved ({approved.length})</h2>
        {approved.length > 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '2rem' }}>
            {approved.map((f) => (
              <div key={f.id} className="list-card" style={{ opacity: 0.9 }}>
                <strong>{f.contactName}</strong> · {f.email} · <StatusBadge status={f.verificationStatus} />
                <button
                  type="button"
                  className="btn btn-ghost"
                  style={{ marginLeft: '0.5rem' }}
                  onClick={() => updateVerification(f.id, 'blocked')}
                >
                  Block
                </button>
              </div>
            ))}
          </div>
        )}

        <h2 style={{ marginBottom: '1rem' }}>Rejected / Blocked ({rejectedOrBlocked.length})</h2>
        {rejectedOrBlocked.length > 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {rejectedOrBlocked.map((f) => (
              <div key={f.id} className="list-card">
                <strong>{f.contactName}</strong> · {f.email} · <StatusBadge status={f.verificationStatus} />
                {f.rejectionReason && <span style={{ color: 'var(--text-muted)' }}> — {f.rejectionReason}</span>}
                {f.backgroundCheck?.redFlags?.length ? (
                  <span className="red-flag"> Red flags: {f.backgroundCheck.redFlags.join(', ')}</span>
                ) : null}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
