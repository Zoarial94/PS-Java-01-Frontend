import logo from './logo.svg';
import './App.css';
import FirstComponent from './FirstComponent.js'
import { compose } from "recompose"
import React from 'react';
import ActionList from './components/ActionList.js'
import Nodes from "./components/Nodes.js"
import CustomNavbar from "./components/CustomNavbar"
import {withMaybe, withEither, withFetching, loadingCond, failedFetchCond} from "./HOCs.js"


const actionsEmptyListCond = (props) => !props.data.actions.length;
const nodesEmptyListCond = (props) => !props.data.nodes.length;

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

const nodesWithConditionalRenderings = compose(
  withFetching("http://localhost:8080/api/nodes"),
  withEither(loadingCond, LoadingIndictor),
  withEither(failedFetchCond, FailedFetchIndicator),
  withEither(nodesEmptyListCond, EmptyMessage)
);

const RealActionWithConditionalRenderings = realActionWithConditionalRenderings(ActionList);
const NodesWithConditionalRenderings = nodesWithConditionalRenderings(Nodes)


function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          This will be mine
        </p>
        <div className="ListsContainer">
          <RealActionWithConditionalRenderings />
          <NodesWithConditionalRenderings />
        </div>
      </header>
    </div>
  );
}

export default App;
