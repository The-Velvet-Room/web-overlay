import { User } from './User';

export class AdminData {
  commentators: CommentatorData;
  match: MatchData;
  players: PlayerData;
  tournament: TournamentData;
  twitch: TwitchData;
  bracket: BracketData;
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
  leftPlayer: User;
  rightPlayer: User;
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

export class BracketData {
  url: string;
}
