export interface CFProfile {
  handle: string;
  firstName?: string;
  lastName?: string;
  country?: string;
  organization?: string;
  avatar: string;
  rank?: string;
  rating?: number;
  maxRank?: string;
  maxRating?: number;
  contribution?: number;
  // (other fields like city, friendOfCount, registrationTime, etc. are optional)
}

export interface RatingChange {
  contestName: string;
  ratingUpdateTimeSeconds: number;
  oldRating: number;
  newRating: number;
}

export interface CFSubmission {
  id: number;
  creationTimeSeconds: number;
  verdict: string;
  problem: {
    contestId?: number;
    index: string;
    name: string;
    tags: string[];
  };
}

export interface CFData {
  profile: CFProfile;

  stats: {
    acceptedSubmissions: number;
    contestsParticipated: number;
    currentRating: number;
    highestRating: number;
    solvedProblems: number;
    totalSubmissions: number;
  };

  contestHistory: RatingChange[];

  recentSubmissions: CFSubmission[];
}