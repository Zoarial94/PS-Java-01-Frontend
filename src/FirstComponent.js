import React, { Component } from 'react';
import './App.css';

class FirstComponent extends Component {
  state = {
    isLoading: true,
    text: ""
  };

  async componentDidMount() {
    const response = await fetch('http://localhost:8080/api/test');
    const body = await response.text();
    this.setState({ text: body, isLoading: false });
  }

  render() {
    const {text, isLoading} = this.state;

    if (isLoading) {
      return <p>Loading...</p>;
    }

    return (
          <div>
            <h2>Header:</h2>
            <p>{text}</p>
          </div>
    );
  }
}

export default FirstComponent