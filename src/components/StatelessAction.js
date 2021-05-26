import React, { Component } from 'react';
import { componentFromStreamWithConfig } from 'recompose';
import "./StatelessAction.css"
import "./common.css"

class StatelessAction extends Component {
  constructor(props) {
    super(props);
    console.log("Props: ");
    console.log(props);
    console.log("Actions: ")
    console.log(this);
  }

  render() {
    const { actions } = this.props.data;

    return (
      <div className="Actions ObjectsDisplay">
        <h2>Actions(s): {actions.length}</h2>
        <div className="ObjectList">
          {actions.map(action =>
            <div key={action.uuid} className="Action Object">
              <h3>{action.name}</h3> <h3>{action.uuid}</h3>
              <div className="ObjectInfoList">
                <p>Security Level: {action.security_level}</p>
                <p>Arguments: {action.args}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }
}

export default StatelessAction