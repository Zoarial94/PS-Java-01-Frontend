import React from 'react';
import axios from 'axios'

export const loadingCond = (props) => props.isLoading;
export const failedFetchCond = (props) => props.error;

export const withMaybe = (conditionalRenderingFn) => (Component) => (props) =>
    conditionalRenderingFn(props)
        ? null
        : <Component {...props} />

export const withEither = (conditionalRenderingFn, EitherComponent) => (Component) =>
    class withEither extends React.Component {
        render() {
            return conditionalRenderingFn(this.props)
                ? <EitherComponent {...this.props} />
                : <Component {...this.props} />
        }
    }

export const withPosting = (url) => (Component) =>
    class WithFetching extends React.Component {
        constructor(props) {
            super(props);

            this.state = {
                data: null,
                isLoading: true,
                error: null,
            };
        }

        componentDidMount() {
            //console.log("Fetching: " + url);
            axios.post(url)
                .then(result => {
                    this.setState({
                        data: result.data,
                        isLoading: false,
                    });
                })
                .catch(error => this.setState({
                    error,
                    isLoading: false,
                }));

            // Maybe setup a timer to check for updates
        }

        render() {
            return <Component {...this.props} {...this.state} />;
        }
    }

export const withNewFetching = (url, saveTo = "data") => (Component) =>
    class WithFetching extends React.Component {
        constructor(props) {
            super(props);

            this.state = {
                [saveTo + "Data"]: null,
                [saveTo + "IsLoading"]: true,
                [saveTo + "Error"]: null,
            };
        }

        componentDidMount() {
            //console.log("Fetching: " + url);
            axios.get(url)
                .then(result => {
                    this.setState({
                        [saveTo + "Data"]: result.data,
                        [saveTo + "IsLoading"]: false,
                    });
                })
                .catch(error => this.setState({
                    [saveTo + "Error"]: error,
                    [saveTo + "IsLoading"]: false,
                }));

            // Maybe setup a timer to check for updates
        }

        render() {
            return <Component {...this.props} {...this.state} />;
        }
    }
export const withFetching = (url) => (Component) =>
    class WithFetching extends React.Component {
        constructor(props) {
            super(props);

            this.state = {
                data: null,
                isLoading: true,
                error: null,
            };
        }

        componentDidMount() {
            //console.log("Fetching: " + url);
            axios.get(url)
                .then(result => {
                    this.setState({
                        data: result.data,
                        isLoading: false,
                    });
                })
                .catch(error => this.setState({
                    error,
                    isLoading: false,
                }));

            // Maybe setup a timer to check for updates
        }

        render() {
            return <Component {...this.props} {...this.state} />;
        }
    }

const identity = Component => Component
export const branch = (test, left, right = identity) => BaseComponent => {
    const Branch = props => {
        if (test(props)) {
            return React.createElement(left(BaseComponent), props)
        }
        return React.createElement(right(BaseComponent), props)
    }

    return Branch
}
