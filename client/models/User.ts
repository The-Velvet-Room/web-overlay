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

//{"ID":"c6d88545-c980-4659-b78f-64af18fcd605","Nickname":"APOC","Tag":"","Aliases":[],"Image":"","URLPath":"apoc","FirstName":"","LastName":"","Facts":[],"Characters":[],"Twitter":"","Twitch":"","City":"","State":"","Location":{"Lon":0,"Lat":0}}