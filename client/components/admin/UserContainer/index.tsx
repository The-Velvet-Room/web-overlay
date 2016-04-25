import * as React from 'react';
import * as actions from '../../../redux/actions/user';
import { connect } from 'react-redux';
import { usStates, usStateKeys } from '../../../../public/javascripts/constants/constants';
import StoreData from '../../../models/StoreData';
import SelectOption from '../../../models/SelectOption';
import Select from '../../utility/Select';
import User from '../../../models/User';

interface Props extends React.Props<UserContainer> {
  users?: Object,
  addOrUpdateUser?: (user: User) => void,
}
interface State {
  selectedUserId?: string,
  editing?: boolean,
}

const mapStateToProps = (state: StoreData) => {
  return {
    users: state.users,
  };
}

const mapDispatchToProps = (dispatch) => {
  return {
    addOrUpdateUser: (user: User) => {
      dispatch(actions.addOrUpdateUser(user));
    },
  };
}

class UserContainer extends React.Component<Props, State> {
  constructor(state: State, props: Props) {
    super(state, props);
    
    let selectedUserId = '';
    const keys = Object.getOwnPropertyNames(props.users);
    if (keys.length) {
      selectedUserId = (props.users[keys[0]] as User).id;
    }
    
    this.state = {
      selectedUserId,
      editing: true,
    };
  }

  handleSelectUser = (selectedUserId) => {
    this.setState({selectedUserId});
  }
  
  toggleEditing = () => {
    const editing = !this.state.editing;
    this.setState({editing});
  }

  handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const user = new User();
    Object.getOwnPropertyNames(user).forEach(key => {
      // Not sure that it matters if this cast is not techincally correct
      // (e.g. this.refs[key] is an HTMLSelectElement)
      const ref = (this.refs[key] as HTMLInputElement);
      if (!ref) {
        return;
      }

      if (user[key] instanceof Array) {
        user[key] = ref.value.split(',');
      } else {
        user[key] = ref.value;
      }

      ref.value = '';
    });

    this.props.addOrUpdateUser(user);
  }

  public render() {
    let selectedUser: User;
    let title = 'Create New User';
    const userOptions = [];
    
    if (this.state.editing) {
      selectedUser = this.props.users[this.state.selectedUserId];
      title = 'Update User';
      
      Object.getOwnPropertyNames(this.props.users).forEach(key => {
        const user: User = this.props.users[key];
        const name = `${user.firstName} "${user.gamerTag}" ${user.lastName}`;
        userOptions.push(new SelectOption(name, user.id));
      });
    }

    return (
      <div className="user-container">
        <div>{title}</div>
        
        <div style={{float: 'right', display: this.state.editing ? 'inline' : 'none'}}>
          
        </div>
        <Select
          options={userOptions}
          defaultValue={this.state.selectedUserId}
          onChange={this.handleSelectUser}
          label="User"
        />

        <form onSubmit={this.handleSubmit}>
          <label htmlFor="firstName">First Name</label>
          <input
            name="firstName"
            ref="firstName"
            defaultValue={selectedUser ? selectedUser.firstName : ''}
          />

          <label htmlFor="lastName">Last Name</label>
          <input
            name="lastName"
            ref="lastName"
            defaultValue={selectedUser ? selectedUser.lastName : ''}
          />

          <label htmlFor="gamerTag">Gamer Tag</label>
          <input
            name="gamerTag"
            ref="gamerTag"
            defaultValue={selectedUser ? selectedUser.gamerTag : ''}
          />

          <label htmlFor="clanPrefix">Clan Prefix</label>
          <input
            name="clanPrefix"
            ref="clanPrefix"
            defaultValue={selectedUser ? selectedUser.clanPrefix : ''}
          />

          <label htmlFor="twitterHandle">Twitter Handle</label>
          <input
            name="twitterHandle"
            ref="twitterHandle"
            defaultValue={selectedUser ? selectedUser.twitterHandle : ''}
          />

          <label htmlFor="city">City</label>
          <input
            name="city"
            ref="city"
            defaultValue={selectedUser ? selectedUser.city : ''}
          />

          <label htmlFor="state">State</label>
          <select
            name="state"
            ref="state"
            defaultValue={'a'}
          >
          {
            usStates.map((state, index) => {
              return (
                <option key={state} value={usStateKeys[index]}>{state}</option>
              );
            })
          }
          </select>

          <label htmlFor="facts">Facts</label>
          <input
            name="facts"
            ref="facts"
            defaultValue={selectedUser ? selectedUser.facts : ''}
          />

          <label htmlFor="characters">Characters</label>
          <input
            name="characters"
            ref="characters"
            defaultValue={selectedUser ? selectedUser.characters.toString() : ''}
          />
          <input type="submit" value="Update User"/>
        </form>
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(UserContainer);
