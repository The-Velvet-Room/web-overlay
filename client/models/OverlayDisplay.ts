import User from './User';

export class OverlayDisplay {
  commentators: CommentatorDisplay;
  match: MatchDisplay;
  players: PlayerDisplay;
  tournament: TournamentDisplay;
}

export class CommentatorDisplay {
  leftCommentator: User;
  rightCommentator: User;
}

export class MatchDisplay {
  leftPort: number;
  rightPort: number;
  leftCharacter: string;
  rightCharacter: string;
  leftStateKey: string;
  rightStateKey: string;
}

export class PlayerDisplay {
  leftPlayer: User;
  rightPlayer: User;
}

export class TournamentDisplay {
  currentGame: string;
  tournamentName: string;
  bracketInfo: string;
}