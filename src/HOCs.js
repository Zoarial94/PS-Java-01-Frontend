import React from 'react';
import axios from 'axios'

export const withMaybe = (conditionalRenderingFn) => (Component) => (props) =>
  conditionalRenderingFn(props)
    ? null
    : <Component {...props} />

export const withEither = (conditionalRenderingFn, EitherComponent) => (Component) => (props) =>
  conditionalRenderingFn(props)
    ? <EitherComponent />
    : <Component {...props} />

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
      console.log("Fetching: " + url);
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
    }

    render() {
      return <Component {...this.props} {...this.state} />;
    }
  }