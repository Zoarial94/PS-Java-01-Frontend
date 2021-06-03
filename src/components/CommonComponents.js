import React, { Component } from 'react';
import "./common.css"
import { withFetching, withEither, failedFetchCond, loadingCond } from "../HOCs"
import { compose, withState} from "recompose"

export class KeyValueDisplay extends React.Component {
    render() {
        return <p>{this.props.myKey}: {this.props.value}</p>
    }
}

export const nonEmptyText = (placeHolder) =>

    class NonEmptyText extends React.Component {
        render() {
            console.log(this.props.children)
            const text = !this.props.children || this.props.children.trim().length === 0 ?
                placeHolder : this.props.children.trim();
            return <p>Description: {text}</p>
        }
    }
