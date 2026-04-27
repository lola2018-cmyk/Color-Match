export interface User {
  id: string;
  email: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserStats {
  userId: string;
  totalGames: number;
  wins: number;
  losses: number;
  totalScore: number;
  averageScore: number;
  averageReactionTime: number;
  rating: number;
  createdAt: Date;
  updatedAt: Date;
}
