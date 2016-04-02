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
    const user: User = this.props.users[this.state.selectedUserId];
    const options = [];
    return (
      <div className="user-container">
        <form onSubmit={this.handleSubmit}>
          <label htmlFor="firstName">First Name</label>
          <input 
            name="firstName"
            ref="firstName"
            defaultValue={user ? user.firstName : ''}
          />
          
          <label htmlFor="lastName">Last Name</label>
          <input 
            name="lastName"
            ref="lastName"
            defaultValue={user ? user.lastName : ''}
          />
          
          <label htmlFor="gamerTag">Gamer Tag</label>
          <input 
            name="gamerTag"
            ref="gamerTag"
            defaultValue={user ? user.gamerTag : ''}
          />
          
          <label htmlFor="clanPrefix">Clan Prefix</label>
          <input 
            name="clanPrefix"
            ref="clanPrefix"
            defaultValue={user ? user.clanPrefix : ''}
          />
          
          <label htmlFor="twitterHandle">Twitter Handle</label>
          <input 
            name="twitterHandle"
            ref="twitterHandle"
            defaultValue={user ? user.twitterHandle : ''}
          />
          
          <label htmlFor="city">City</label>
          <input 
            name="city"
            ref="city"
            defaultValue={user ? user.city : ''}
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
            defaultValue={user ? user.facts : ''}
          />
          
          <label htmlFor="characters">Characters</label>
          <input 
            name="characters"
            ref="characters"
            defaultValue={user ? user.characters.toString() : ''}
          />
          <input type="submit" />
        </form>
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(UserContainer);
