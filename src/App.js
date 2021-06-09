import logo from './logo.svg';
import './App.css';
import FirstComponent from './FirstComponent.js'
import { compose } from "recompose"
import React, { useState } from 'react';
import ActionList from './components/ActionList.js'
import Nodes from "./components/Nodes.js"
import CustomNavbar from "./components/CustomNavbar"
import { withMaybe, withEither, withFetching, withNewFetching, loadingCond, failedFetchCond } from "./HOCs.js"
import Actions from "./components/Actions"
import Action from "./components/Action"


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

const filterActions = (Component) => (props) => {
  console.log(props)
  if (!props.node) {
    return <Component {...props} />
  }

  const input = React.Children.toArray(props.children);

  let passActions = input.filter(action => action.props.nodeUUID === props.node.UUID)

  let { children, ...passThoughProps } = props;

  return <Component children={passActions} {...passThoughProps} />
}

const enhanceActions = compose(
  filterActions,

)
const EnhancedActions = enhanceActions(Actions)

const ListsContainer = (props) => {

  const [selectedNode, setSelectedNode] = useState(null);

  console.log(props.actions)

  return (
    <div className="ListsContainer">
      <NodesWithConditionalRenderings id="NodesList" updateSelectedNode={setSelectedNode} />
      <EnhancedActions id="ActionsList" node={selectedNode}>
        {props.actions.map(action => {
          return <Action key={action.UUID} {...action} />
        })}
      </EnhancedActions>
    </div>
  )
}

const App = (props) => {
  const [opened, setOpened] = useState(false);
  const [nodes, setNodes] = useState(props.nodesData.nodes);
  const [actions, setActions] = useState(props.actionsData.actions);

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
          <ListsContainer actions={actions} />
        }
      </header>
    </div>
  );
}

const nodesLoadingCond = (props) => props.nodesIsLoading;
const actionsLoadingCond = (props) => props.actionsIsLoading;
const nodesErrorCond = (props) => props.nodesError;
const actionsErrorCond = (props) => props.actionsError;

const enhanceApp = compose(
  withNewFetching("http://localhost:8080/api/nodes", "nodes"),
  withNewFetching("http://localhost:8080/api/actions", "actions"),
  withEither(nodesLoadingCond, LoadingIndictor),
  withEither(actionsLoadingCond, LoadingIndictor),
  withEither(nodesErrorCond, FailedFetchIndicator),
  withEither(actionsErrorCond, FailedFetchIndicator),
);

const EnhancedApp = enhanceApp(App)

export default EnhancedApp;
