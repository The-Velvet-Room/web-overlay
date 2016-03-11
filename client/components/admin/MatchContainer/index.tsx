import * as React from 'react';
import * as actions from '../../../redux/actions/match';
import { connect } from 'react-redux';
import { MatchData } from '../../../models/AdminData';
import StateData from '../../../models/StateData';

interface Props extends React.Props<MatchContainer> {
  data?: MatchData,
  updateLeftPort?: (port: number) => void,
  updateRightPort?: (port: number) => void,
  updateLeftCharacter?: (character: string) => void,
  updateRightCharacter?: (character: string) => void,
}
interface State { }

const mapStateToProps = (state: StateData) => {
  return {
    data: state.admin.match,
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    updateLeftPort: (port: number) => {
      dispatch(actions.updateLeftPort(port));
    },
    updateRightPort: (port: number) => {
      dispatch(actions.updateRightPort(port));
    },
    updateLeftCharacter: (character: string) => {
      dispatch(actions.updateLeftCharacter(character));
    },
    updateRightCharacter: (character: string) => {
      dispatch(actions.updateRightCharacter(character));
    }
  }
}

class MatchContainer extends React.Component<Props, State> {
  handleSelectorChange (e: React.FormEvent) {
    const target = (e.target as HTMLSelectElement);
    const callback = target.dataset['callback'];
    this.props[callback](target.options[target.selectedIndex].value)
  }

  public render() {
    const ports = [1,2,3,4];
    const characters = [];
    const optionsLeft = [];
    const optionsRight = [];
    const users = this.props.users;
    for (const prop in users) {
      if (users.hasOwnProperty(prop)) {
        const user = users[prop];
        const name = `${user.firstName} "${user.gamerTag}" ${user.lastName}`;
        if (user.id === this.props.leftPlayerId) {
          optionsLeft.push(<option key={user.id} value={user.id} selected>{name}</option>);
        } else {
          optionsLeft.push(<option key={user.id} value={user.id}>{name}</option>);
        }
        
        if (user.id === this.props.rightPlayerId) {
          optionsRight.push(<option key={user.id} value={user.id} selected>{name}</option>);
        } else {
          optionsRight.push(<option key={user.id} value={user.id}>{name}</option>);
        }
      }
    }
    
    return (
      <div>
        <label htmlFor="leftPort">L Port</label>
        <select 
          name="leftPort"
          data-callback="updateLeftPort"
          onChange={this.handleSelectorChange}
        >
        {
          ports.map(port => {
            if (port === this.props.data.leftPort) {
              return <option key={port} value={port.toString()} selected>{port}</option>;
            }
            
            return <option key={port} value={port.toString()}>{port}</option>
          })
        }
        </select>
        <label htmlFor="rightPort">R Port</label>
        <select 
          name="rightPort"
          data-callback="updateRightPort"
          onChange={this.handleSelectorChange}
        >
        {
          ports.map(port => {
            if (port === this.props.data.rightPort) {
              return <option key={port} value={port.toString()} selected>{port}</option>;
            }
            
            return <option key={port} value={port.toString()}>{port}</option>
          })
        }
        </select>
        <label htmlFor="leftCharacter">L Character</label>
        <select 
          name="leftCharacter"
          data-callback="updateLeftCharacter"
          onChange={this.handleSelectorChange}
        >
          {optionsLeft}
        </select>
        <label htmlFor="rightCharacter">R Character</label>
        <select 
          name="rightCharacter"
          data-callback="updateRightCharacter"
          onChange={this.handleSelectorChange}
        >
          {optionsRight}
        </select>
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(MatchContainer);
