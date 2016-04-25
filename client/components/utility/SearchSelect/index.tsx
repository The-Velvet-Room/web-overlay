import * as React from 'react';
import SearchSelectOptionList from '../SearchSelectOptionList';
import './style.scss';

interface Props extends React.Props<SearchSelect> {
  onSelect: (value: Object) => void,
  url: string,
  label: string,
  optionFormat: string,
}
interface State {
  value?: string,
  options?: Object[],
  selectedOption?: Object,
}

export default class SearchSelect extends React.Component<Props, State> {
  constructor(state, props) {
    super(state, props);
    
    this.state = {
      options: [],
    };
  }
  
  getFakeOptions = () => {
    const num = Math.ceil(Math.random() * 10);
    const arr = [];
    for (let i=1; i <= num; i++) {
      const id = Math.floor(Math.random() * Math.random() * i * 100000);
      arr.push({
        id: id,
        index: i,
        firstName: id.toString(),
        lastName: i.toString(),
        nickName: id.toString() + i.toString() + id.toString(),
      });
    }
    
    return arr;
  }
  
  getNewOptions = () => {
    const req = new XMLHttpRequest();
    
  }
  
  handleOnBlur = () => {
    this.setState({options: []});
  }

  handleOnChange = (e: React.SyntheticEvent) => {
    const value = (e.target as HTMLInputElement).value;
    const options = this.getFakeOptions();
    this.setState({value, options});
    const type = e.type;
  }
  
  handleOnSelect = (selectedOption) => {
    this.setState({selectedOption});
    this.props.onSelect({selectedOption});
  }

  public render () {
    const trimmedLabel = this.props.label.trim();
    let formatString = this.props.optionFormat;
    if (this.state.selectedOption) {
      Object.getOwnPropertyNames(this.state.selectedOption).forEach(key => {
        formatString = formatString.replace(`{${key}}`, this.state.selectedOption[key]);
      });
    }

    return (
      <div 
        className="search-select"
        onBlur={this.handleOnBlur}
        onKeyDown= {() => {console.log('some key pressed');}}
      >
        <label htmlFor={trimmedLabel}>{this.props.label}</label>
        <input
          name={trimmedLabel}
          value={this.state.value}
          onChange={this.handleOnChange}
        />
        <SearchSelectOptionList
          onSelect={this.handleOnSelect}
          options={this.state.options}
          formatString={this.props.optionFormat}
        />
      </div>
    );
  }
}
