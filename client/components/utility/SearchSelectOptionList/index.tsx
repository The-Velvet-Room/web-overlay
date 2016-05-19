import * as React from 'react';
import './style.scss';

interface Props extends React.Props<SearchSelectOptionList> {
  onSelect: () => void,
  onHover: (highlightedIndex: number) => void,
  options: any[],
  formatString: string,
  hightlightedIndex: number,
}
interface State { }

export default class SearchSelectOptionList extends React.Component<Props, State> {
  handleOnSelect = (e: React.SyntheticEvent) => {
    this.props.onSelect();
  }

  handleOnHover = (e: React.SyntheticEvent) => {
    const target = (e.target as HTMLElement);
    const index = parseInt(target.dataset['index'], 10);

    if (!isNaN(index)) {
      this.props.onHover(index);
    }
  }

  public render () {
    const optionsClass = this.props.options.length ? 'search-select-option-list' : 'search-option-list hidden';

    return (
      <div
        className={optionsClass}
        onClick={this.handleOnSelect}
      >
      {
        this.props.options.map((option, index) => {
          const key = option.ID || option.Id || option.id;
          const optionClass = index === this.props.hightlightedIndex ? 'search-select-option highlighted' : 'search-option';
          let displayString = this.props.formatString;
          Object.getOwnPropertyNames(option).forEach(key => {
            displayString = displayString.replace(`{${key}}`, option[key]);
          });

          return (
            <div
              className={optionClass}
              key={key}
              data-index={index}
              onMouseEnter={this.handleOnHover}
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
