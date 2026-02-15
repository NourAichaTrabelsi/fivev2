// Verification status for adopters – critical for child safety
export type VerificationStatus = 'pending' | 'in_review' | 'approved' | 'rejected' | 'blocked';

export type VerificationMethod = 'automatic' | 'manual';

export interface BackgroundCheck {
  id: string;
  adopterId: string;
  status: 'pending' | 'passed' | 'failed';
  method: VerificationMethod;
  checkedAt?: string;
  notes?: string;
  redFlags: string[]; // e.g. criminal record, false documents
}

export interface FamilyProfile {
  id: string;
  createdAt: string;
  // Contact & identity (for verification)
  contactName: string;
  email: string;
  phone: string;
  location: string;
  // Household
  householdSize: number;
  otherChildren: number;
  otherAdults: number;
  housingType: 'house' | 'apartment' | 'other';
  hasYard: boolean;
  pets: string[];
  // Preferences
  preferredAgeRange: [number, number];
  preferredSiblingGroup: boolean;
  openToSpecialNeeds: boolean;
  maxChildren: number;
  // Background for matching
  languages: string[];
  religion?: string;
  occupation: string;
  incomeStability: 'stable' | 'variable' | 'other';
  // Verification & safety
  verificationStatus: VerificationStatus;
  backgroundCheck?: BackgroundCheck;
  applicationNotes?: string;
  rejectionReason?: string;
}

export interface ChildProfile {
  id: string;
  createdAt: string;
  // Non-identifying for public listing (privacy)
  displayName: string;
  age: number;
  needs: string[]; // e.g. "medical", "emotional support", "sibling group"
  preferences: string[]; // e.g. "quiet home", "animals", "outdoor activities"
  interests: string[];
  siblingGroupId?: string; // if placed with siblings
  shortDescription: string;
  // For matching only (not public)
  requiresStableIncome: boolean;
  prefersNoPets?: boolean;
  preferredLanguage?: string;
  status: 'available' | 'matched' | 'placed';
}

export interface MatchResult {
  child: ChildProfile;
  family: FamilyProfile;
  score: number;
  reasons: string[];
}
