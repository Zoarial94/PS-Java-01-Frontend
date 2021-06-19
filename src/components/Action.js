import React, { Component, useState } from 'react';
import "./Action.css"
import "./common.css"
import { withFetching, withEither, withMaybe, failedFetchCond, loadingCond, branch, withPosting, withNewFetching } from "../HOCs"
import { compose, withProps, withState } from "recompose"
import OutsideClickHandler from 'react-outside-click-handler';
import { KeyValueDisplay } from "./CommonComponents";

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

/*
 *  Name Value Display
*/
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


/*
 *  ZIoTResponse
*/
const ActionResponse = (props) => {
  return <p>{props.data}</p>
}
const withFetchingRunAction = (Component) => (props) => {
  const RenderedFetching = withPosting(props.postUrl)(Component);
  return <RenderedFetching {...props} />;
}
const withFetchDataAsString = (Component) => (props) => {
  const { data, ...passThoughProps } = props;
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

const ActionOptions = (props) => {

  const [postUrl, setPostUrl] = useState(null);
  const [counter, setCounter] = useState(0);

  const getRunFields = () => {
    let content = [];
    for (var i = 0; i < props.args; i++) {
      const id = `arg${i}`;
      content.push(<input type="text" key={props.name + id} id={id} name={id}></input>)
    }
    return content;
  }

  const runAction = (e) => {
    e.preventDefault();
    const formParams = new URLSearchParams(new FormData(e.target).entries()).toString();
    setPostUrl("/api/action/" + props.UUID + "/run?" + formParams)
    setCounter(counter + 1);
  }

  const updateEditingAction = (e) => {
    props.updateEditingAction(props.UUID)
  }

  return (
    <div>
      <form onSubmit={runAction} style={{display:"flex", flexFlow:"column wrap"}}>
        {getRunFields()}
        <input type="submit" value="Run" />
      </form>
      <button onClick={updateEditingAction}>Edit</button>
      <EnhancedZIoTResponse postUrl={postUrl} />
    </div>
  )

}

/*
 * Action
*/
const Action = (props) => {

  const [renderOptions, setRenderOptions] = useState(false);
  const [renderInfo, setRenderInfo] = useState(false);


  function toggleActionInfo(e) {
    e.stopPropagation();
    setRenderInfo(!renderInfo);
  }

  function outsideClickHandler() {
    if (renderOptions) {
      setRenderOptions(false);
    }
  }

  function handleClick() {
    if (!renderOptions) {
      setRenderOptions(true);
    }
  }

  let actionClasses = "Action Object"
  if (renderOptions) {
    actionClasses += " ActiveAction"
  }

  return (
    <OutsideClickHandler onOutsideClick={outsideClickHandler} >
      <div key={props.UUID} className={actionClasses} onClick={handleClick} >
        <h3>{props.name}</h3>
        {/*<h3>{props.UUID}</h3>*/}
        <div className="ObjectInfo">
          <div>
            <h3 style={{display:"inline"}}>Action Info</h3>
            <button onClick={toggleActionInfo}>Toggle Info</button>
          </div>
          {renderInfo && <div className="ObjectInfoList">
            {/*<p>Node UUID: {props.nodeUUID}</p>*/}
            <p>Security Level: {props.securityLevel}</p>
            <p>Arguments: {props.args}</p>
            <p>Local: {props.local.toString()}</p>
            <p>Encryped: {props.encrypt.toString()}</p>
            <EnhancedNameValueDisplayForDescription name="Description" value={props.description} />
          </div>
          }
        </div>
        {renderOptions &&
          <ActionOptions name={props.name} args={props.args} UUID={props.UUID} updateEditingAction={props.updateEditingAction} />
        }
      </div>
    </OutsideClickHandler>
  )

}

export default Action;