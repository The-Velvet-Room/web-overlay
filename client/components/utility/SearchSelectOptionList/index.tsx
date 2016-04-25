import * as React from 'react';
import './style.scss';

class thing extends Object{
  id: number;
  index: number;
  displayString: string;
}

interface Props extends React.Props<SearchSelectOptionList> {
  onSelect: (value: Object, display: string) => void,
  options: thing[],
  formatString: string,
}
interface State { 
  selectedIndex: number,
}

export default class SearchSelectOptionList extends React.Component<Props, State> {
  constructor(state, props) {
    super(state, props);
    
    if (this.props.options) {
      this.props.options.forEach(option => {
        let displayString = this.props.formatString;
        Object.getOwnPropertyNames(option).forEach(key => {
          displayString = displayString.replace(`{${key}}`, option[key])
        });
        
        option.displayString = displayString;
      });
    }
    
    this.state = {
      selectedIndex: -1,
    };
  }

  handleOnSelect = (e: React.SyntheticEvent) => {
    console.log(e.type);
    //this.props.onSelect(this.props.data, this.state.displayString);
  }

  public render () {
    const optionsClass = this.props.options.length ? 'search-option-list' : 'search-option-list hidden';

    return (
      <div
        className={optionsClass}
        onClick={this.handleOnSelect}
        onKeyPress={this.handleOnSelect}
      >
      {
        this.props.options.map((option, index) => {
          const optionClass = index === this.state.selectedIndex ? 'search-option highlighted' : 'search-option';
          let displayString = this.props.formatString;
          Object.getOwnPropertyNames(option).forEach(key => {
            displayString = displayString.replace(`{${key}}`, option[key])
          });
        
          return (
            <div
              className={optionClass}
              key={option.id}
            >
            {displayString}
            </div>
          );
        })
      }
      </div>
    );
  }
}
