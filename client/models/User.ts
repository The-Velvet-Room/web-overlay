export class User {
  id: string;
  firstName: string;
  lastName: string;
  nickname: string;
  tag: string;
  twitter: string;
  twitch: string;
  city: string;
  state: string;
  aliases: string[];
  facts: string[];
  characters: string[];

  constructor (dbUser:DbUser = new DbUser()) {
    this.id = dbUser.ID;
    this.firstName = dbUser.FirstName;
    this.lastName = dbUser.LastName;
    this.nickname = dbUser.Nickname;
    this.tag = dbUser.Tag;
    this.twitter = dbUser.Twitter;
    this.twitch = dbUser.Twitch;
    this.city = dbUser.City;
    this.state = dbUser.State;
    this.aliases = dbUser.Aliases;
    this.facts = dbUser.Facts;
    this.characters = dbUser.Characters;
  }
}

export class DbUser {
  ID: string;
  FirstName: string;
  LastName: string;
  Nickname: string;
  Tag: string;
  Twitter: string;
  Twitch: string;
  City: string;
  State: string;
  Aliases: string[];
  Facts: string[];
  Characters: string[];

  constructor (data:any = {}) {
    this.ID = data.ID;
    this.FirstName = data.FirstName;
    this.LastName = data.LastName;
    this.Nickname = data.Nickname;
    this.Tag = data.Tag;
    this.Twitter = data.Twitter;
    this.Twitch = data.Twitch;
    this.City = data.City;
    this.State = data.State;
    this.Aliases = data.Aliases;
    this.Facts = data.Facts;
    this.Characters = data.Characters;
  }
}
