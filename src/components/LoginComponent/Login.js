import { compose } from "recompose"
import React, { useState } from 'react';
import { withMaybe, withEither, withFetching, withNewFetching, withNewPostFetching, loadingCond, failedFetchCond } from "../../HOCs.js"
import axios from 'axios'

const Login = (props) => {
  const [postUrl, setPostUrl] = useState(null);
  const [error, setError] = useState(null);

  const runAction = (e) => {
    e.preventDefault();
    const formParams = new URLSearchParams(new FormData(e.target).entries()).toString();
    let url = "/user/login?" + formParams
    axios.post(url)
      .then(result => {
        props.updateCounter()
      })
      .catch(error => {
        setError("Invalid login");
      });
  }

  return (
    <div>
      {error && <p style={{color:"red"}}>{error}</p>}
      <form onSubmit={runAction} style={{ display: "flex", flexFlow: "column wrap" }}>
        <label htmlFor="username">Username: </label>
        <input type="text" id="username" name="username" />
        <label htmlFor="password">Password: </label>
        <input type="password" id="password" name="password" />
        <input type="submit" value="Login" />
      </form>
    </div>
  )

}

export default Login;