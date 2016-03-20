import User from './User';

export class OverlayDisplay {
  commentator: CommentatorDisplay;
  game: GameDisplay;
  idle: IdleDisplay;
}

export class CommentatorDisplay implements ITournamentData {
  leftCommentator: User;
  rightCommentator: User;

  // ITournamentData
  ITournamentData: boolean = true;
  currentGame: string;
  tournamentName: string;
  bracketInfo: string;
}

export class GameDisplay implements ITournamentData {
  leftPort: string;
  rightPort: string;
  leftCharacter: string;
  rightCharacter: string;
  leftStateKey: string;
  rightStateKey: string;
  leftPlayer: User;
  rightPlayer: User;

  // ITournamentData
  ITournamentData: boolean = true;
  currentGame: string;
  tournamentName: string;
  bracketInfo: string;
}

export class IdleDisplay implements ITournamentData {
  // ITournamentData
  ITournamentData: boolean = true;
  currentGame: string;
  tournamentName: string;
  bracketInfo: string;
}

export interface ITournamentData {
  ITournamentData: boolean;
  currentGame: string;
  tournamentName: string;
  bracketInfo: string;
}
