export default class User {
  id: string;
  firstName: string;
  lastName: string;
  gamerTag: string;
  clanPrefix: string;
  twitterHandle: string;
  city: string;
  state: string;
  facts: Array<string>;
  characters: Object;
  
  constructor() {
    this.id = '';
    this.firstName = '';
    this.lastName = '';
    this.gamerTag = '';
    this.clanPrefix = '';
    this.twitterHandle = '';
    this.city = '';
    this.state = '';
    this.facts = [];
    this.characters = {};
  }
}