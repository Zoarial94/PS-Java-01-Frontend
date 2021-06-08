import React, { Component, useState } from 'react';
import "./ActionList.css"
import "./common.css"
import { withFetching, withEither, withMaybe, failedFetchCond, loadingCond, branch, withPosting, withNewFetching } from "../HOCs"
import { compose, withProps, withState } from "recompose"
import OutsideClickHandler from 'react-outside-click-handler';
import { KeyValueDisplay } from "./CommonComponents";

/*

class Action extends Component {
  constructor(props) {
    super(props);

    this.state = { optionsOpen: false, renderInfo: false };
    this.handleClick = this.handleClick.bind(this);
    this.outsideClickHandler = this.outsideClickHandler.bind(this);
    this.toggleActionInfo = this.toggleActionInfo.bind(this);

  }

  toggleActionInfo(e) {
    e.stopPropagation();
    this.setState({ renderInfo: !this.state.renderInfo });
  }

  outsideClickHandler() {
    if (this.state.optionsOpen) {
      this.setState({ optionsOpen: false, postUrl: null })
    }
  }

  handleClick() {
    if (!this.state.optionsOpen) {
      this.setState({ optionsOpen: true });
    }
  }

  render() {
    const action = this.props.data;
    const renderOptions = this.state.optionsOpen;
    const renderInfo = this.state.renderInfo;
    const getRunFields = () => {
      let content = [];
      if (renderOptions) {
        for (var i = 0; i < action.arguments; i++) {
          const id = `arg${i}`;
          content.push(<input type="text" key={action.name + id} id={id} name={id}></input>)
        }
      }
      return content;
    }
    const runAction = (e) => {
      e.preventDefault();
      const formParams = new URLSearchParams(new FormData(e.target).entries()).toString();
      this.setState({ postUrl: "http://localhost:8080/api/action/" + action.uuid + "/run?" + formParams })
    }

    return (

      <OutsideClickHandler onOutsideClick={this.outsideClickHandler} >
        <div key={action.uuid} className="Action Object" onClick={this.handleClick} >
          <h3>{action.name}</h3>
          <h3>{action.uuid}</h3>
          <div className="ObjectInfoList">
            <h3>Action Info</h3>
            <button onClick={this.toggleActionInfo}>Toggle Info</button>
            {renderInfo && <div>
              <p>Node UUID: {action.nodeUuid}</p>
              <p>Security Level: {action.securityLevel}</p>
              <p>Arguments: {action.arguments}</p>
              <p>Local: {action.local.toString()}</p>
              <p>Encryped: {action.encrypted.toString()}</p>
              <EnhancedNameValueDisplayForDescription name="Description" value={action.description} />
            </div>
            }
          </div>
          {renderOptions &&
            <div className="ObjectActions" >
              <h3>Here are {action.name}'s actions</h3>
              <form onSubmit={runAction}>
                {getRunFields()}
                <input type="submit" value="Run" />
              </form>
              <EnhancedZIoTResponse postUrl={this.state.postUrl} />
            </div>
          }
        </div>
      </OutsideClickHandler>
    );
  }
}

*/

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
        setPostUrl("http://localhost:8080/api/action/" + props.UUID + "/run?" + formParams)
        setCounter(counter + 1);
    }

    return (
        <div className="ObjectActions" >
            <h3>Here are {props.name}'s props.</h3>
            <form onSubmit={runAction}>
                {getRunFields()}
                <input type="submit" value="Run" />
            </form>
            <EnhancedZIoTResponse postUrl={postUrl}/>
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

    return (
        <OutsideClickHandler onOutsideClick={outsideClickHandler} >
            <div key={props.UUID} className="Action Object" onClick={handleClick} >
                <h3>{props.name}</h3>
                <h3>{props.UUID}</h3>
                <div className="ObjectInfoList">
                    <h3>Action Info</h3>
                    <button onClick={toggleActionInfo}>Toggle Info</button>
                    {renderInfo && <div>
                        <p>Node UUID: {props.nodeUUID}</p>
                        <p>Security Level: {props.securityLevel}</p>
                        <p>Arguments: {props.args}</p>
                        <p>Local: {props.local.toString()}</p>
                        <p>Encryped: {props.encrypt.toString()}</p>
                        <EnhancedNameValueDisplayForDescription name="Description" value={props.description} />
                    </div>
                    }
                </div>
                {renderOptions &&
                <ActionOptions name={props.name} args={props.args} UUID={props.UUID} />
                }
            </div>
        </OutsideClickHandler>
    )

}

export default Action;