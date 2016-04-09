import * as React from 'react';
import * as actions from '../../../redux/actions/user';
import { connect } from 'react-redux';
import { usStates, usStateKeys } from '../../../../public/javascripts/constants/constants';
import StoreData from '../../../models/StoreData';
import User from '../../../models/User';

interface Props extends React.Props<UserContainer> {
  users?: Object,
  addOrUpdateUser?: (user: User) => void,
}
interface State { 
  selectedUserId: string,
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
  constructor(state, props) { 
    super(state, props);
    this.state = {
      selectedUserId: '',
    };
  }
  
  handleSelectUser = (e: React.FormEvent) => {
    const selectedUserId = (e.target as HTMLSelectElement).value;
    this.setState({selectedUserId})
  }
  
  handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const user = new User();
    for (const key in user) {
      if (user.hasOwnProperty(key)) {
        // Not sure that it matters if this cast is not techincally correct
        // (e.g. this.refs[key] is an HTMLSelectElement)
        const ref = (this.refs[key] as HTMLInputElement);
        if (!ref) {
          continue;
        }
        
        if (user[key] instanceof Array) {
          user[key] = ref.value.split(',');
        } else {
          user[key] = ref.value;
        }
      }
    }
    
    this.props.addOrUpdateUser(user);
  }

  public render() {
    const selectedUser: User = this.props.users[this.state.selectedUserId];
    const userOptions = [];
    const users = this.props.users;
    const title = selectedUser ? 'editing user' : 'create user';
    
    for (const key in users) {
      if (users.hasOwnProperty(key)) {
        const user = users[key];
        const name = `${user.firstName} "${user.gamerTag}" ${user.lastName}`;
        userOptions.push(
          <option key={user.id} value={user.id}>{name}</option>
        );
      }
    }
    
    return (
      <div className="user-container">
        <div>{title}</div>
       
        <label htmlFor="user">User</label>
        <select 
          name="user"
          ref="user"
          defaultValue={this.state.selectedUserId}
          onChange={this.handleSelectUser}
        >
          {userOptions}
        </select>
      
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
          <input type="submit" />
        </form>
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(UserContainer);
