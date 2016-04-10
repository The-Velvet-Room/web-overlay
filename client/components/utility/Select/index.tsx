import * as React from 'react';
import './style.scss';

interface Props extends React.Props<Select> {
  options: HTMLOptionElement[],
  onChange: (value: string) => void,
  label: string,
}
interface State { }

export default class Select extends React.Component<Props, State> {
  constructor(state, props) {
    super(state, props);
  }

  handleOnChange = (e: React.SyntheticEvent) => {
    const target = (e.target as HTMLSelectElement);
    const value = (target.options[target.selectedIndex] as HTMLOptionElement).value;
    this.props.onChange(value);
  }

  public render () {
    const trimmedLabel = this.props.label.trim();
    return (
      <div className="select">
        <label htmlFor={trimmedLabel}>{this.props.label}</label>
        <select
          name={trimmedLabel}
          ref={trimmedLabel}
          defaultValue={this.props.options[0].value}
          onChange={this.handleOnChange}
        >
          {this.props.options}
        </select>
      </div>
    );
  }
}
