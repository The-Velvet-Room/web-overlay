import * as React from 'react';
import './style.scss';
const cn = require('classnames');

interface Props extends React.Props<TabView> {
  names: string[],
}
interface State {
  selectedIndex: number,
}

export default class TabView extends React.Component<Props, State> {
  constructor(state, props) {
    super(state, props);
    this.state = {
      selectedIndex: 0,
    };
  }
  
  handleChangeTab = (e: React.MouseEvent) => {
    const target = (e.target as HTMLOListElement);
    const selectedIndex = parseInt(target.dataset['index'], 10);
    this.setState({selectedIndex})
  }
  
  public render () {
    const links = [];
    const views = [];
    
    React.Children.forEach(this.props.children, (tab, index) => {
      const isSelected = this.state.selectedIndex === index;
      const linkClass = cn('tab-link', {active: isSelected}); 
      links.push(
        <li
          className={linkClass} 
          onClick={this.handleChangeTab}
          data-index={index}
        >
          {this.props.names[index]}
        </li>
      );
      
      const viewClass = cn('tab', {active: isSelected});
      views.push(
        <div className={viewClass}>
          {tab}
        </div>
      );
    });
    
    return (
      <div className="tab-view">
        <ol className="tab-links">
          {links}
        </ol>
        <div className='tabs'>
          {views}
        </div>
      </div>
    );
  }
}