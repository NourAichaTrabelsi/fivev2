import type { FamilyProfile, ChildProfile, MatchResult } from '@/types';

export function computeMatchScore(family: FamilyProfile, child: ChildProfile): MatchResult {
  let score = 0;
  const reasons: string[] = [];

  // Age in preferred range
  const [min, max] = family.preferredAgeRange;
  if (child.age >= min && child.age <= max) {
    score += 30;
    reasons.push('Age fits your preferred range');
  } else {
    reasons.push('Age outside preferred range');
  }

  // Special needs
  const hasSpecialNeeds = child.needs.some(
    (n) => n !== 'stability' && n !== 'emotional support'
  );
  if (hasSpecialNeeds && family.openToSpecialNeeds) {
    score += 20;
    reasons.push('Open to this child\'s needs');
  } else if (hasSpecialNeeds && !family.openToSpecialNeeds) {
    reasons.push('Child has needs you are not open to');
  }

  // Sibling group
  if (child.siblingGroupId && family.preferredSiblingGroup) {
    score += 15;
    reasons.push('You are open to sibling groups');
  }

  // Income stability
  if (child.requiresStableIncome && family.incomeStability === 'stable') {
    score += 15;
    reasons.push('Stable income matches child\'s needs');
  }

  // Pets
  if (child.prefersNoPets && family.pets.length > 0) {
    score -= 20;
    reasons.push('Child prefers no pets');
  } else if (!child.prefersNoPets && family.pets.length > 0) {
    score += 5;
    reasons.push('Child is fine with pets');
  }

  // Capacity
  if (family.otherChildren + 1 <= family.maxChildren) {
    score += 10;
  }

  // Preference overlap (interests / preferences)
  const familyEnv = [
    family.hasYard ? 'outdoor' : '',
    family.pets.length ? 'animals' : '',
  ].filter(Boolean);
  const childPrefs = [...child.preferences, ...child.interests];
  const overlap = childPrefs.some((p) =>
    familyEnv.some((e) => p.toLowerCase().includes(e) || e.includes(p.toLowerCase()))
  );
  if (overlap) {
    score += 10;
    reasons.push('Environment matches child\'s preferences');
  }

  const finalScore = Math.max(0, Math.min(100, score));
  return { child, family, score: finalScore, reasons };
}

export function getMatchesForFamily(
  familyId: string,
  families: FamilyProfile[],
  children: ChildProfile[]
): MatchResult[] {
  const family = families.find((f) => f.id === familyId);
  if (!family || family.verificationStatus !== 'approved') return [];

  const available = children.filter((c) => c.status === 'available');
  const results = available.map((c) => computeMatchScore(family, c));
  return results.sort((a, b) => b.score - a.score);
}

export function getMatchesForChild(
  childId: string,
  families: FamilyProfile[],
  children: ChildProfile[]
): MatchResult[] {
  const child = children.find((c) => c.id === childId);
  if (!child || child.status !== 'available') return [];

  const approved = families.filter((f) => f.verificationStatus === 'approved');
  const results = approved.map((f) => computeMatchScore(f, child));
  return results.sort((a, b) => b.score - a.score);
}
