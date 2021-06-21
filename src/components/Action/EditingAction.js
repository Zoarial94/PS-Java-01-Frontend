import { compose } from "recompose"
import { withEither, withMaybe } from "../../HOCs"
import axios from "axios";

const EditingAction = (props) => {


  const updateAction = (e) => {
    e.preventDefault()
    const formParams = new URLSearchParams(new FormData(e.target).entries()).toString();
    axios.post("/api/action/" + props.action.UUID + "/updateInfo?" + formParams)
      .then(result => {
      })
      .catch(error => {
      });
      props.updateEditingAction(null);
  }

  return (
    <div className="Actions ObjectsDisplay">
      <h2>Editing Action: {props.action.name}</h2>
      <div className="ObjectList">
        <form onSubmit={updateAction} style={{ display: "flex", flexFlow: "column wrap" }}>

          <label htmlFor="securityLevel" >Security Level</label>
          <input type="text" name="securityLevel" key={props.action.name + "secLev"} defaultValue={props.action.securityLevel}></input>
          <label htmlFor="encrypt">Encryped</label>
          <input type="text" name="encrypt" key={props.action.name + "encrypt"} defaultValue={props.action.encrypt.toString()}></input>
          <label htmlFor="local">Local</label>
          <input type="text" name="local" key={props.action.name + "local"} defaultValue={props.action.local.toString()}></input>
          <label htmlFor="desc">Description</label>
          <input type="text" name="desc" key={props.action.name + "desc"} defaultValue={props.action.description} />
          <input type="submit" value="Update" />
        </form>
      </div>
      <button onClick={() => props.updateEditingAction(null)} >Stop Editing</button>
    </div>
  )

}

const noActionCond = (props) => !props.action;

const noActionIndicator = () =>
  <div><p>No action</p></div>

const enhance = compose(
  withMaybe(noActionCond)
)

const EnhancedEditingAction = enhance(EditingAction)

export default EnhancedEditingAction;