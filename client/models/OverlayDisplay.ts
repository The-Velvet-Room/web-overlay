import User from './User';

export class OverlayDisplay {
  commentator: CommentatorDisplay;
  game: GameDisplay;
  idle: IdleDisplay;
}

export class CommentatorDisplay implements TournamentData {
  leftCommentator: User;
  rightCommentator: User;
  tournamentName: string;
}

export class GameDisplay implements TournamentData {
  leftPort: string;
  rightPort: string;
  leftCharacter: string;
  rightCharacter: string;
  leftStateKey: string;
  rightStateKey: string;
  leftPlayer: User;
  rightPlayer: User;
}

export class IdleDisplay implements TournamentData { }

interface TournamentData {
  currentGame?: string;
  tournamentName?: string;
  bracketInfo?: string;
}