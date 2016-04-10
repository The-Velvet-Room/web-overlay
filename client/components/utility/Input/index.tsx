import * as React from 'react';
import './style.scss';

interface Props extends React.Props<Input> {
  defaultValue: string,
  onChange: (value: string) => void,
  label: string,
}
interface State { }

export default class Input extends React.Component<Props, State> {
  constructor(state, props) {
    super(state, props);
  }

  handleOnChange = (e: React.SyntheticEvent) => {
    const target = (e.target as HTMLInputElement);
    this.props.onChange(target.value);
  }

  public render () {
    const trimmedLabel = this.props.label.trim();
    let defaultValue = this.props.defaultValue || '';

    return (
      <div className="input">
        <label htmlFor={trimmedLabel}>{this.props.label}</label>
        <input
          name={trimmedLabel}
          value={defaultValue}
          onChange={this.handleOnChange}
        />
      </div>
    );
  }
}
