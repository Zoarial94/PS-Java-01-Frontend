import logo from './logo.svg';
import './App.css';
import { compose } from "recompose"
import axios from "axios";
import React, { useState } from 'react';
import ActionList from './components/ActionList.js'
import Nodes from "./components/Nodes.js"
import CustomNavbar from "./components/CustomNavbar"
import { withMaybe, withEither, withFetching, withNewFetching, withNewPostFetching, loadingCond, failedFetchCond } from "./HOCs.js"
import Actions from "./components/Actions"
import Action from "./components/Action"
import Login from "./components/LoginComponent/Login"
import { useParams } from 'react-router';
import EditingAction from './components/Action/EditingAction';

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
  withFetching("/api/nodes"),
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
  const [editingAction, setEditingAction] = useState(null);

  console.log(props.actions)

  return (
    <div className="ListsContainer">
      <NodesWithConditionalRenderings id="NodesList" updateSelectedNode={setSelectedNode} />

      <EnhancedActions id="ActionsList" node={selectedNode}>
        {props.actions.map(action => {
          return <Action key={action.UUID}
                  updateEditingAction={(UUID) => setEditingAction(UUID)}
                  {...action}
                />
        })}
      </EnhancedActions>

      <EditingAction
        action={props.actions.find((action) => action.UUID === editingAction)} 
        updateEditingAction={(UUID) => setEditingAction(UUID)}
      />

    </div>
  )
}

const App = (props) => {
  const [nodes, setNodes] = useState(props.nodesData.nodes);
  const [actions, setActions] = useState(props.actionsData.actions);

  const logout = () => {
    axios.post("/user/logout")
      .then(result => {
        props.updateCounter()
      })
      .catch(error => {
      });


  }

  return (
    <div>
      <button onClick={logout}>Logout</button>
      <img src={logo} className="App-logo" alt="logo" />
      <ListsContainer actions={actions} />
    </div>
  );
}

const nodesLoadingCond = (props) => props.nodesIsLoading;
const actionsLoadingCond = (props) => props.actionsIsLoading;
const nodesErrorCond = (props) => props.nodesError;
const actionsErrorCond = (props) => props.actionsError;

const loginLoadingCond = (props) => props.loginTestLoading;
const loggedOutCond = (props) => props.loginTestError;

const LoggedOutIndicator = (props) =>
  <div>
    <h2>You are not logged in</h2>
    <Login updateCounter={props.updateCounter} />
  </div>


//TODO: separate out the login/App so the nodes and actions requests aren't sent until the user is logged in
const enhanceApp = compose(
  withNewFetching("/user/", "loginTest"),
  withEither(loadingCond, LoadingIndictor),
  withEither(loggedOutCond, LoggedOutIndicator),
  withNewFetching("/api/nodes", "nodes"),
  withNewFetching("/api/actions", "actions"),
  withEither(nodesLoadingCond, LoadingIndictor),
  withEither(actionsLoadingCond, LoadingIndictor),
  withEither(nodesErrorCond, FailedFetchIndicator),
  withEither(actionsErrorCond, FailedFetchIndicator),
);

const EnhancedApp = enhanceApp(App)

const AppManager = (props) => {
  const [opened, setOpened] = useState(false);
  const [counter, setCounter] = useState(0);
  const openApp = () => {
    setOpened(true);
  }

  return (
    <div className="App">
      <header className="App-header">
        {!opened &&
          <div>
            <p style={{ display: 'inline' }}>This is the beginning</p>
            <button onClick={openApp} style={{ margin: "4px" }}  >Start</button>
          </div>
        }
        {
          opened &&
          <EnhancedApp counter={counter} updateCounter={() => {
            setCounter(counter + 1)
            console.log("Updated counter: " + counter)
          }} />
        }
      </header>
    </div>)
}


export default AppManager;
