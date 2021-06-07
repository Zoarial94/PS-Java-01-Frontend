import React, { Component } from 'react';
import "./Nodes.css"
import "./common.css"

class Nodes extends Component {
  constructor(props) {
    super(props)

  }

  render() {
    const { data } = this.props;
    const { nodes } = data;

    return (
      <div className="Nodes ObjectsDisplay">
        <h2>Node(s): {nodes.length}</h2>
        <div className="ObjectList">
          {nodes.map(node =>
            <div key={node.uuid} className="Node Object" onClick={() => {console.log(this.props);this.props.updateSelectedNode(node.uuid)}}>
              <h3>{node.hostname}</h3>
              <h3>{node.uuid}</h3>
              <div className="ObjectInfoList">
                <p>Node Type: {node.node_type}</p>
                <p>Last Heard From: {new Date(node.last_heard_from).toLocaleString()}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }
}

export default Nodes