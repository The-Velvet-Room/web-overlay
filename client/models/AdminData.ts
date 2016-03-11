export class AdminData {
  commentators: CommentatorData;
  match: MatchData;
  players: PlayerData;
  tournament: TournamentData;
}

export class CommentatorData {
  leftCommentatorId: string;
  rightCommentatorId: string;
}

export class MatchData {
  leftPort: string;
  rightPort: string;
  leftCharacter: string;
  rightCharacter: string;
  leftStateKey: string;
  rightStateKey: string;
}

export class PlayerData {
  leftPlayerId: string;
  rightPlayerId: string;
}

export class TournamentData {
  currentGame: string;
  tournamentName: string;
  bracketInfo: string;
}