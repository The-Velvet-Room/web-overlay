export class AdminData {
  commentators: CommentatorData;
  match: MatchData;
  players: PlayerData;
  tournament: TournamentData;
  twitch: TwitchData
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

export class TwitchData {
  username: string;
  title: string;
  game: string;
  currentViewers: number;
  peakViewers: number;
  followers: number;
  latestFollower: string;
}