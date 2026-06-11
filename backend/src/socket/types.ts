export interface SocketData {
  sessionId?: string;
  playerId?: string;
  isHost?: boolean;
  timerInterval?: NodeJS.Timeout;
}

export interface Session {
  id: string;
  pin: string;
  status: 'WAITING' | 'LIVE' | 'ENDED';
  currentQIndex: number;
  quiz: {
    id: string;
    title: string;
    questions: Question[];
    totalQuestions: number;
  };
  players: Player[];
}

export interface Player {
  id: string;
  nickname: string;
  avatar: string;
  totalScore: number;
}

export interface Question {
  id: string;
  content: string;
  timeLimit: number;
  points: number;
  options: Option[];
}

export interface Option {
  id: string;
  content: string;
  color: string;
  isCorrect: boolean;
}

export interface Answer {
  id: string;
  playerId: string;
  questionId: string;
  optionId: string;
  sessionId: string;
  isCorrect: boolean;
  timeTaken: number;
  pointsEarned: number;
}

export interface GameEvent {
  type: 'game:started' | 'game:ended' | 'game:timeout' | 'question:new' | 'question:results' | 'question:time_up' | 'leaderboard:update' | 'timer:tick' | 'timer:ended' | 'timer:stopped' | 'timer:reset' | 'player:left' | 'host:player_left' | 'player:error' | 'host:error';
  data: any;
}