import * as React from 'react';
import SelectOption from '../../../models/SelectOption';
import './style.scss';

interface Props extends React.Props<Select> {
  options: SelectOption[],
  defaultValue: string,
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
    let defaultValue = this.props.defaultValue;
    if (!defaultValue) {
      defaultValue = this.props.options[0] ? this.props.options[0].value : 'No Users';
    }

    return (
      <div className="select">
        <label htmlFor={trimmedLabel}>{this.props.label}</label>
        <select
          name={trimmedLabel}
          value={defaultValue}
          onChange={this.handleOnChange}
        >
        {
          this.props.options.map(option => {
            return <option key={option.key} value={option.value}>{option.text}</option>;
          })
        }
        </select>
      </div>
    );
  }
}
