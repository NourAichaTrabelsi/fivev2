'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function RegisterPage() {
  const [submitted, setSubmitted] = useState(false);
  const [id, setId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const form = e.currentTarget;
    const data = {
      contactName: (form.contactName as HTMLInputElement).value,
      email: (form.email as HTMLInputElement).value,
      phone: (form.phone as HTMLInputElement).value,
      location: (form.location as HTMLInputElement).value,
      householdSize: parseInt((form.householdSize as HTMLInputElement).value, 10) || 1,
      otherChildren: parseInt((form.otherChildren as HTMLInputElement).value, 10) || 0,
      otherAdults: parseInt((form.otherAdults as HTMLInputElement).value, 10) || 0,
      housingType: (form.housingType as HTMLSelectElement).value as 'house' | 'apartment' | 'other',
      hasYard: (form.hasYard as HTMLInputElement).checked,
      pets: ((form.pets as HTMLInputElement).value || '').split(',').map((s) => s.trim()).filter(Boolean),
      preferredAgeRange: [
        parseInt((form.ageMin as HTMLInputElement).value, 10) || 0,
        parseInt((form.ageMax as HTMLInputElement).value, 10) || 18,
      ] as [number, number],
      preferredSiblingGroup: (form.siblingGroup as HTMLInputElement).checked,
      openToSpecialNeeds: (form.specialNeeds as HTMLInputElement).checked,
      maxChildren: parseInt((form.maxChildren as HTMLInputElement).value, 10) || 1,
      languages: ((form.languages as HTMLInputElement).value || '').split(',').map((s) => s.trim()).filter(Boolean),
      occupation: (form.occupation as HTMLInputElement).value,
      incomeStability: (form.incomeStability as HTMLSelectElement).value as 'stable' | 'variable' | 'other',
      applicationNotes: (form.notes as HTMLTextAreaElement).value || undefined,
    };

    const res = await fetch('/api/families', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    const json = await res.json();
    setLoading(false);
    if (res.ok) {
      setId(json.id);
      setSubmitted(true);
    }
  }

  if (submitted && id) {
    return (
      <div className="form-page">
        <nav className="nav-bar">
          <Link href="/">Adoption Haven</Link>
        </nav>
        <div className="page-content">
          <h1>Application received</h1>
          <p style={{ marginBottom: '1rem' }}>
            Thank you for your interest. Your profile is under review. We will verify your information and get back to you.
          </p>
          <p style={{ marginBottom: '1rem', color: 'var(--text-muted)' }}>
            Reference ID: <strong>{id}</strong>
          </p>
          <Link href={`/family/${id}`} className="btn btn-primary">
            View my profile &amp; matches
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="form-page">
      <nav className="nav-bar">
        <Link href="/">Adoption Haven</Link>
      </nav>
      <div className="page-content">
        <h1>Create your family profile</h1>
        <p style={{ marginBottom: '1.5rem', color: 'var(--text-muted)' }}>
          All adopters are verified to keep children safe. Please provide accurate information.
        </p>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="contactName">Full name *</label>
            <input id="contactName" name="contactName" required />
          </div>
          <div className="form-group">
            <label htmlFor="email">Email *</label>
            <input id="email" name="email" type="email" required />
          </div>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="phone">Phone *</label>
              <input id="phone" name="phone" type="tel" required />
            </div>
            <div className="form-group">
              <label htmlFor="location">City / region *</label>
              <input id="location" name="location" required />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="householdSize">Household size</label>
              <input id="householdSize" name="householdSize" type="number" min={1} defaultValue={2} />
            </div>
            <div className="form-group">
              <label htmlFor="otherChildren">Other children in home</label>
              <input id="otherChildren" name="otherChildren" type="number" min={0} defaultValue={0} />
            </div>
            <div className="form-group">
              <label htmlFor="otherAdults">Other adults in home</label>
              <input id="otherAdults" name="otherAdults" type="number" min={0} defaultValue={0} />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="housingType">Housing type</label>
              <select id="housingType" name="housingType">
                <option value="house">House</option>
                <option value="apartment">Apartment</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div className="form-group" style={{ display: 'flex', alignItems: 'center', paddingTop: '1.6rem' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <input type="checkbox" name="hasYard" />
                Has yard / outdoor space
              </label>
            </div>
          </div>
          <div className="form-group">
            <label htmlFor="pets">Pets (comma-separated, or leave blank)</label>
            <input id="pets" name="pets" placeholder="e.g. dog, cat" />
          </div>
          <h3 style={{ marginTop: '1.5rem', marginBottom: '0.75rem' }}>Preferences</h3>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="ageMin">Preferred age range (min)</label>
              <input id="ageMin" name="ageMin" type="number" min={0} max={18} defaultValue={0} />
            </div>
            <div className="form-group">
              <label htmlFor="ageMax">Preferred age range (max)</label>
              <input id="ageMax" name="ageMax" type="number" min={0} max={18} defaultValue={18} />
            </div>
          </div>
          <div className="form-group">
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <input type="checkbox" name="siblingGroup" />
              Open to sibling groups
            </label>
          </div>
          <div className="form-group">
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <input type="checkbox" name="specialNeeds" />
              Open to children with special needs
            </label>
          </div>
          <div className="form-group">
            <label htmlFor="maxChildren">Maximum number of children you can adopt</label>
            <input id="maxChildren" name="maxChildren" type="number" min={1} defaultValue={1} />
          </div>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="languages">Languages spoken (comma-separated)</label>
              <input id="languages" name="languages" placeholder="e.g. English, Spanish" />
            </div>
            <div className="form-group">
              <label htmlFor="occupation">Occupation</label>
              <input id="occupation" name="occupation" />
            </div>
          </div>
          <div className="form-group">
            <label htmlFor="incomeStability">Income stability</label>
            <select id="incomeStability" name="incomeStability">
              <option value="stable">Stable</option>
              <option value="variable">Variable</option>
              <option value="other">Other</option>
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="notes">Anything else you’d like us to know</label>
            <textarea id="notes" name="notes" />
          </div>
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Submitting…' : 'Submit application'}
          </button>
        </form>
      </div>
    </div>
  );
}
