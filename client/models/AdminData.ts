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
  leftPort: number;
  rightPort: number;
  leftCharacter: string;
  rightCharacter: string;
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