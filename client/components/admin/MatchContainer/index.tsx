import * as React from 'react';
import * as actions from '../../../redux/actions/match';
import { connect } from 'react-redux';
import { MatchData } from '../../../models/AdminData';
import { ports, characters, usStates, usStateKeys } from '../../../../public/javascripts/constants/constants';
import StoreData from '../../../models/StoreData';

interface Props extends React.Props<MatchContainer> {
  data?: MatchData,
  updateLeftPort?: (port: string) => void,
  updateRightPort?: (port: string) => void,
  updateLeftCharacter?: (character: string) => void,
  updateRightCharacter?: (character: string) => void,
  updateLeftStateKey?: (state: string) => void,
  updateRightStateKey?: (state: string) => void,
}
interface State { }

const mapStateToProps = (state: StoreData) => {
  return {
    data: state.admin.match,
  };
}

const mapDispatchToProps = (dispatch) => {
  return {
    updateLeftPort: (port: string) => {
      dispatch(actions.updateLeftPort(port));
    },
    updateRightPort: (port: string) => {
      dispatch(actions.updateRightPort(port));
    },
    updateLeftCharacter: (character: string) => {
      dispatch(actions.updateLeftCharacter(character));
    },
    updateRightCharacter: (character: string) => {
      dispatch(actions.updateRightCharacter(character));
    },
    updateLeftStateKey: (stateKey: string) => {
      dispatch(actions.updateLeftStateKey(stateKey));
    },
    updateRightStateKey: (stateKey: string) => {
      dispatch(actions.updateRightStateKey(stateKey));
    },
  };
}

class MatchContainer extends React.Component<Props, State> {
  handleSelectorChange = (e: React.FormEvent) => {
    // callback is from the 'callback' data attribute of the select element and matches a prop on the component
    const target = (e.target as HTMLSelectElement);
    const callback = target.dataset['callback'];
    const value = (target.options[target.selectedIndex] as HTMLOptionElement).value;
    this.props[callback](value);
  }

  public render() {
    const portOptions = ports.map(port => {
      return <option key={port} value={port.toString()}>{port}</option>;
    });
    
    const charOptions = characters.map(character => {
      return <option key={character} value={character} selected>{character}</option>;
    });
    
    const stateOptions = usStates.map((state, index) => {
      return <option key={state} value={usStateKeys[index]}>{state}</option>;
    });
    
    return (
      <div>
        <label htmlFor="leftPort">L Port</label>
        <select 
          name="leftPort"
          data-callback="updateLeftPort"
          value={this.props.data.leftPort}
          onChange={this.handleSelectorChange}
        >
        {portOptions}
        </select>
        
        <label htmlFor="rightPort">R Port</label>
        <select 
          name="rightPort"
          data-callback="updateRightPort"
          value={this.props.data.rightPort}
          onChange={this.handleSelectorChange}
        >
        {portOptions}
        </select>
        
        <label htmlFor="leftCharacter">L Character</label>
        <select 
          name="leftCharacter"
          data-callback="updateLeftCharacter"
          value={this.props.data.leftCharacter}
          onChange={this.handleSelectorChange}
        >
        {charOptions}
        </select>
        
        <label htmlFor="rightCharacter">R Character</label>
        <select 
          name="rightCharacter"
          data-callback="updateRightCharacter"
          value={this.props.data.rightCharacter}
          onChange={this.handleSelectorChange}
        >
        {charOptions}
        </select>
        
        <label htmlFor="leftState">L State</label>
        <select 
          name="leftState"
          data-callback="updateLeftStateKey"
          value={this.props.data.leftStateKey}
          onChange={this.handleSelectorChange}
        >
        {stateOptions}
        </select>
        
        <label htmlFor="rightState">R State</label>
        <select 
          name="rightState"
          data-callback="updateRightStateKey"
          value={this.props.data.rightStateKey}
          onChange={this.handleSelectorChange}
        >
        {stateOptions}
        </select>
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(MatchContainer);
