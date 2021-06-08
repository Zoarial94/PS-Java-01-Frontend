import React, { Component, useState } from 'react';
import "./ActionList.css"
import "./common.css"
import { withFetching, withEither, withMaybe, failedFetchCond, loadingCond, branch, withPosting } from "../HOCs"
import { compose, withProps, withState } from "recompose"
import OutsideClickHandler from 'react-outside-click-handler';
import { KeyValueDisplay } from "./CommonComponents";


/*
const withFetchingAction = (uuid) => (Component) =>
  class WithFetchingAction extends React.Component {
    constructor(props) {
      super(props);
      this.state = {toRender: withFetching("http://localhost:8080/api/action/" + uuid)(Component)};
    }

    render() {
      let RenderedFetching = this.state.toRender;
      return <RenderedFetching {...this.props} />;
    }
  }

const withNodeUUID = (Component) => (props) => {
  const cond = () => props.data && props.withNodeUUID && props.withNodeUUID !== props.data.nodeUuid
  const Render = withMaybe(cond)(Component);
  return <Render {...props} />
}

class ActionList extends Component {
  constructor(props) {
    super(props);
    let allActions = [];

    // Create individual action components
    props.data.actions.forEach(action => {
      const renderActionInfo = compose(
        withFetchingAction(action.uuid),
        fetchingWithConditionalRenderings,
        withNodeUUID,
      );
      allActions.push([action.uuid, renderActionInfo(Action)])
    });

    this.state = { allActions };
  }

  render() {
    const actions = this.state.allActions;
    const Header = this.props.header;
    return (
      <div className="Actions ObjectsDisplay">
        <Header actions={actions} withNodeUUID={this.props.nodeUUID} />
        <div className="ObjectList">
          {actions.map(dict => {
            const Action = dict[1]
            return < Action uuid={dict[0]} key={dict[0]} withNodeUUID={this.props.nodeUUID} />;
          })}
        </div>
      </div>
    );
  }
}

const LoadingIndictor = () =>
  <div>
    <p>Loading...</p>
  </div>
const FailedFetchIndicator = () =>
  <div>
    <p>Failed to fetch component</p>
  </div>
const EmptyDescriptionIndicator = () =>
  <div>
    <p>No provided description</p>
  </div>


const fetchingWithConditionalRenderings = compose(
  withEither(loadingCond, LoadingIndictor),
  withEither(failedFetchCond, FailedFetchIndicator),
)

const emptyValueCond = (props) => !props.value || !props.value.trim().length;
const NameValueDisplay = (props) => {
  return <p>{props.name}: {props.value}</p>;
}
const enhanceNameValueDisplayForActionListHeader = compose(
  branch(emptyValueCond, withProps({ value: "No provided value" }))
)
const enhanceNameValueDisplayForDescritption = compose(
  branch(emptyValueCond, withProps({ value: "No provided value" }))
)
const EnhancedNameValueDisplayForDescription = enhanceNameValueDisplayForDescritption(NameValueDisplay);


const ActionResponse = (props) => {
  return <p>{props.data}</p>
}
const withFetchingRunAction = (Component) => (props) => {
  const RenderedFetching = withPosting(props.postUrl)(Component);
  return <RenderedFetching {...props} />;
}
const withFetchDataAsString = (Component) => (props) => {
  const { data, passThoughProps } = props;
  var output;
  if (typeof data === "object") {
    output = JSON.stringify(data);
  } else {
    output = data;
  }

  return <Component data={output} {...passThoughProps} />
}
const noUrlCondition = (props) => !props.postUrl
const enhanceZioTResponse = compose(
  withMaybe(noUrlCondition),
  withFetchingRunAction,
  fetchingWithConditionalRenderings,
  withFetchDataAsString
)
const EnhancedZIoTResponse = enhanceZioTResponse(ActionResponse)
 */

/* 
 * NEW STUFF
*/

const ActionListHeader = (props) => {
  return (<><h2>Actions(s) for</h2> <h2>{props.nodeUUID}: {props.listLen}</h2></>)
}

const noNodeUUIDCond = (props) => !props.nodeUUID;
const AllActionsHeader = (props) => <h2>All Actions ({props.listLen}) </h2>
const filterActions = (props) => {
}

const actionListHeaderWithConditionalRenderings = compose(
  withEither(noNodeUUIDCond, AllActionsHeader)
)
const EnhancedHeader = actionListHeaderWithConditionalRenderings(ActionListHeader);

const Actions = (props) => {
    console.log(props)

    const actions = React.Children.toArray(props.children);
    return( 
      <div className="Actions ObjectsDisplay">
        <EnhancedHeader listLen={actions.length} nodeUUID={props.nodeUUID} />
        <div className="ObjectList">
            {actions}
        </div>
      </div>
    )
}

export default Actions;