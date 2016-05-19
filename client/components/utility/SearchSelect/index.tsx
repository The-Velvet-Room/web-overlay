import * as React from 'react';
import SearchSelectOptionList from '../SearchSelectOptionList';
import { KeyCodes } from '../../../../public/javascripts/constants';
import './style.scss';

interface Props extends React.Props<SearchSelect> {
  onSelect: (value: any) => void,
  defaultValue?: any,
  url: string,
  label: string,
  optionFormat: string,
}
interface State {
  value?: string,
  options?: any[],
  selectedOption?: any,
  highlightedIndex?: number,
}

export default class SearchSelect extends React.Component<Props, State> {
  constructor(state, props) {
    super(state, props);

    this.state = {
      options: [],
      highlightedIndex: 0,
      selectedOption: props.defaultValue,
    };
  }

  getNewOptions = (value) => {
    var req = new XMLHttpRequest();
    req.open('GET', this.props.url + value);
    req.onload = (() => {
      const options: any[] = JSON.parse(req.response);
      this.setState({options});
    }).bind(this);
    req.send();
  }

  handleOnBlur = () => {
    //this.setState({options: [], value: '', highlightedIndex: 0});
  }

  handleOnChange = (e: React.FormEvent) => {
    const value = (e.target as HTMLInputElement).value;
    const options = this.getNewOptions(value);
    this.setState({value});
    console.log(value);
  }

  handleOnSelect = () => {
    const selectedOption = this.state.options[this.state.highlightedIndex];
    if (selectedOption) {
      this.setState({selectedOption})
      this.props.onSelect(selectedOption);
    }
  }

  handleOnHover = (highlightedIndex: number) => {
    this.setState({highlightedIndex});
  }

  handleOnKeyDown = (e: React.KeyboardEvent) => {
    // Didn't realize this before, but when this and handleOnChange both respond to the same event,
    // the debugger will only hit one function: whichever has a breakpoint set, or this one if both have one.
    // Both functions still execute, but this would be the first thing to look at if there are problems.
    let highlightedIndex = this.state.highlightedIndex;
    switch (e.keyCode) {
      case KeyCodes.UP:
        if (highlightedIndex > 0) {
          highlightedIndex--;
        } else {
          highlightedIndex = this.state.options.length - 1;
        }

        this.setState({highlightedIndex});
        break;
      case KeyCodes.DOWN:
        if (highlightedIndex < this.state.options.length - 1) {
          highlightedIndex++;
        } else {
          highlightedIndex = 0;
        }

        this.setState({highlightedIndex});
        break;
      case KeyCodes.TAB:
      case KeyCodes.ENTER:
        this.handleOnSelect();
        break;
      case KeyCodes.ESCAPE:

        break;
      default:
    }
  }

  public render () {
    const trimmedLabel = this.props.label.trim();

    return (
      <div
        className="search-select"
        onBlur={this.handleOnBlur}
      >
        <div>
          <label htmlFor={trimmedLabel}>{this.props.label}</label>
        </div>
        <div
          className="search-select-container"
          onKeyDown={this.handleOnKeyDown}
        >
          <input
            name={trimmedLabel}
            value={this.state.value}
            onChange={this.handleOnChange}
          />
        </div>
        <SearchSelectOptionList
          options={this.state.options}
          formatString={this.props.optionFormat}
          hightlightedIndex={this.state.highlightedIndex}
          onHover={this.handleOnHover}
          onSelect={this.handleOnSelect}
        />
      </div>
    );
  }
}
