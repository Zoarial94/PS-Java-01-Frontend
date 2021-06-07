import logo from './logo.svg';
import './App.css';
import FirstComponent from './FirstComponent.js'
import { compose } from "recompose"
import React, { useState } from 'react';
import ActionList from './components/ActionList.js'
import Nodes from "./components/Nodes.js"
import CustomNavbar from "./components/CustomNavbar"
import { withMaybe, withEither, withFetching, loadingCond, failedFetchCond } from "./HOCs.js"


const actionsEmptyListCond = (props) => !props.data.actions.length;

const EmptyMessage = () =>
  <div>
    <p>Empty list</p>
  </div>

const LoadingIndictor = () =>
  <div>
    <p>Loading...</p>
  </div>

const FailedFetchIndicator = () =>
  <div>
    <p>Failed to fetch component</p>
  </div>


const realActionWithConditionalRenderings = compose(
  withFetching("http://localhost:8080/api/actions"),
  withEither(loadingCond, LoadingIndictor),
  withEither(failedFetchCond, FailedFetchIndicator),
  withEither(actionsEmptyListCond, EmptyMessage)
);


const nodesEmptyListCond = (props) => !props.data.nodes.length;

const nodesWithConditionalRenderings = compose(
  withFetching("http://localhost:8080/api/nodes"),
  withEither(loadingCond, LoadingIndictor),
  withEither(failedFetchCond, FailedFetchIndicator),
  withEither(nodesEmptyListCond, EmptyMessage)
);

const RealActionWithConditionalRenderings = realActionWithConditionalRenderings(ActionList);
const NodesWithConditionalRenderings = nodesWithConditionalRenderings(Nodes)

const noNodeUUIDCond = (props) => !props.withNodeUUID;
const AllActionsHeader = () => <h2>All Actions: </h2>
const ActionListHeader = (props) => {
  const actions = props.actions;
  const nodeUUID = props.nodeUUID;
  return <h2>Actions(s): {actions.length}</h2>
}
const actionListHeaderWithConditionalRenderings = compose(
  withEither(noNodeUUIDCond, AllActionsHeader)
)
const EnhancedActionListHeader = actionListHeaderWithConditionalRenderings(ActionListHeader);
const ListsContainer = (props) => {

  const [selectedNode, setSelectedNode] = useState(null);

  return (
    <div className="ListsContainer">
      <NodesWithConditionalRenderings updateSelectedNode={setSelectedNode} />
      <RealActionWithConditionalRenderings nodeUUID={selectedNode} header={EnhancedActionListHeader} />
    </div>
  )
}

function App() {
  const [opened, setOpened] = useState(false);

  const openApp = () => {
    setOpened(true);
  }

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        {!opened &&
          <div>
            <p style={{ display: 'inline' }}>This will be mine</p>
            <button onClick={openApp} style={{ margin: "4px" }}  >Start</button>
          </div>
        }
        {opened &&
          <ListsContainer />
        }
      </header>
    </div>
  );
}

export default App;
