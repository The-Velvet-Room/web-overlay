import * as React from 'react';
import * as actions from '../../../redux/actions/match';
import { connect } from 'react-redux';
import { MatchData } from '../../../models/AdminData';
import { ports, characters, usStates, usStateKeys } from '../../../../public/javascripts/constants';
import StoreData from '../../../models/StoreData';
import SelectOption from '../../../models/SelectOption';
import Select from '../../utility/Select';

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
  public render() {
    const portOptions = ports.map(port => {
      return new SelectOption(port);
    });

    const charOptions = characters.map(character => {
      return new SelectOption(character);
    });

    const stateOptions = usStates.map((state, index) => {
      return new SelectOption(state, usStateKeys[index], state);
    });

    return (
      <div>
        <Select
          options={portOptions}
          defaultValue={this.props.data.leftPort}
          onChange={this.props.updateLeftPort}
          label="Left Port"
        />

        <Select
          options={portOptions}
          defaultValue={this.props.data.rightPort}
          onChange={this.props.updateRightPort}
          label="Right Port"
        />

        <Select
          options={charOptions}
          defaultValue={this.props.data.leftCharacter}
          onChange={this.props.updateLeftCharacter}
          label="Left Character"
        />

        <Select
          options={charOptions}
          defaultValue={this.props.data.rightCharacter}
          onChange={this.props.updateRightCharacter}
          label="Right Character"
        />

        <Select
          options={stateOptions}
          defaultValue={this.props.data.leftStateKey}
          onChange={this.props.updateLeftStateKey}
          label="Left State"
        />

        <Select
          options={stateOptions}
          defaultValue={this.props.data.rightStateKey}
          onChange={this.props.updateRightStateKey}
          label="Right State"
        />
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(MatchContainer);
