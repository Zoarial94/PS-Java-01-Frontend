import React, { Component } from 'react';
import "./Nodes.css"
import "./common.css"

class Nodes extends Component {
  constructor(props) {
    super(props);
    console.log("Props: ");
    console.log(props);
  }

  render() {
    const {data} = this.props;
    const {nodes} = data;

    return (
          <div className="Nodes ObjectsDisplay">
            <h2>Node(s): {nodes.length}</h2>
            <div className="ObjectList">
            {nodes.map(node => 
            <div key={node.uuid} className="Node Object">
              <h3>{node.hostname}</h3>
              <div className="ObjectInfoList">
                <p>UUID: {node.uuid}</p>
                <p>Node Type: {node.node_type}</p>
                <p>Last Heard From: {node.last_heard_from}</p>
              </div>
            </div>
              )}
              </div>
          </div>
    );
  }
}

export default Nodes 