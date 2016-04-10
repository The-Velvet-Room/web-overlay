export default class SelectOption {
  text: string;
  value: string;
  key: string;

  constructor(text: string, value: string = text, key: string = text) {
    this.text = text;
    this.value = value;
    this.key = key;
  }
}
