import React, { Component, useState } from 'react';
import "./common.css"
import "./Actions.css"
import { withFetching, withEither, withMaybe, failedFetchCond, loadingCond, branch, withPosting } from "../HOCs"
import { compose } from "recompose"
import OutsideClickHandler from 'react-outside-click-handler';
import { KeyValueDisplay } from "./CommonComponents";


const ActionListHeader = (props) => {
  return (<><h2>Actions(s) for <span className="ActionsNodeHostname">{props.node.hostname}</span>: {props.listLen}</h2></>)
}

const noNodeCond = (props) => !props.node;
const AllActionsHeader = (props) => <h2>All Actions ({props.listLen}) </h2>

const actionListHeaderWithConditionalRenderings = compose(
  withEither(noNodeCond, AllActionsHeader)
)
const EnhancedHeader = actionListHeaderWithConditionalRenderings(ActionListHeader);

const Actions = (props) => {
  console.log(props)

  const actions = React.Children.toArray(props.children);
  return (
    <div className="Actions ObjectsDisplay">
      <EnhancedHeader listLen={actions.length} node={props.node} />
      <div className="ObjectList">
        {actions}
      </div>
    </div>
  )
}

export default Actions;