import React from 'react';

export class CreateFolder extends React.Component {
  state = {
    value: ""
  }

  constructor(props) {
    super(props)
    this.onChange = this.onChange.bind(this)
    this.onClick = this.onClick.bind(this)
  }

  onClick() {
    console.log("submit:"+this.state.value);
    Storage.put(this.state.value, null)
    .then(result=>console.log(result))
    .catch(err=>console.log('err:'+err))
  }

  onChange(e) {
    this.setState({value: e.target.value})
  }

  render() {
    return (
      <div>
        <input type="text" value={this.state.value} onChange={this.onChange}/>
        <button onClick={this.onClick}>Create Folder</button>
      </div>
    );
  }
}

export class CurrentFolder extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      path : props.path
    };
    this.onClick = this.onClick.bind(this)
  }

  componentWillReceiveProps = (nextProps) => {
    this.setState({path: nextProps.path});
    console.log("CurrentFolder.receiveProps: nextProps.path="+nextProps.path)
  }

  onClick = () => {
    if (this.state.path == "") {
      return;
    } else {
      var arr = this.state.path.split("/")
      arr = arr.slice(0, arr.length-2)
      var path;
      if (arr.length == 0) {
        path = ""
      } else {
        path = arr.join("/")+"/"
      }
      // this.setState({path: path})
      // console.log("CurrentFolder: changeFolder to "+path)
      this.props.changeFolder(path);
    }
  }

  render() {
    return <div>
      <b>{this.state.path == "" ? "/" : this.state.path}</b>
      <button onClick={this.onClick}>Up</button>
    </div>
  }
}