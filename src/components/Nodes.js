import React, { useState } from 'react';
import "./Nodes.css"
import "./common.css"


const Nodes = (props) => {

  const [selectedNode, setSelectedNode] = useState(null);
  const { data } = props;
  const { nodes } = data;

  const updateSelectedNode = (node) => {
    setSelectedNode(node);
    props.updateSelectedNode(node);
  }

  return (
    <div className="Nodes ObjectsDisplay">
      <h2>Node(s): {nodes.length}</h2>
      {selectedNode && <button onClick={() => updateSelectedNode(null)} >Deselect node</button>}
      <div className="ObjectList">
        {nodes.map(node => {
          let nodeClasses = "Node Object"
          if(selectedNode && node.UUID === selectedNode.UUID) {
            nodeClasses += " ActiveNode"
          }
          return (<div key={node.UUID} className={nodeClasses} onClick={() => updateSelectedNode(node)}>
            <h3>{node.hostname}</h3>
            {/*<h3>{node.UUID}</h3>*/}
            <div className="ObjectInfoList">
              <p>Node Type: {node.node_type}</p>
              <p>Last Heard From: {new Date(node.last_heard_from).toLocaleString()}</p>
            </div>
          </div>)
        })}
      </div>
    </div>
  );
}

export default Nodes