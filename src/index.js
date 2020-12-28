import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
// import App from './App';
import reportWebVitals from './reportWebVitals';

import Amplify, { Auth } from 'aws-amplify';
import awsconfig from './aws-exports';
import { AmplifyAuthenticator, withAuthenticator, AmplifySignOut } from '@aws-amplify/ui-react';
import { Storage } from 'aws-amplify' ;
import {FileList} from "./filelist";
import {CurrentFolder, CreateFolder} from "./folder";

Amplify.configure(awsconfig);
Amplify.configure({
  Auth: {
    region: 'ap-northeast-2',
    userPoolId: 'ap-northeast-2_IGdADGi0q',
    userPoolWebClientId: 'b8oufjr49b2brbhliqfkecm71',
    mandatorySignIn: true,
    authenticationFlowType: 'USER_PASSWORD_AUTH'
  },
});

class App extends React.Component {
  constructor(props) {
    super(props)
    this.onChange = this.onChange.bind(this)
    this.changeFolder = this.changeFolder.bind(this)
  }

  state = {
    currentFolder: '',
    files: [],
  }

  changeFolder = (path) => {
    console.log("changeFolder:"+path);
    this.setState({ currentFolder: path });
  }

  onChange = (e) => {
    const file = e.target.files[0]
    console.log("put file : current=" +this.state.currentFolder+",files="+ this.state.files+",file="+file)
    Storage.put( this.state.currentFolder + file.name, file)
    .then (result=> {
      this.setState({ currentFolder: this.state.currentFolder })
    })
    .catch(err => console.log(err));
  }

  render() {
    return (
      <AmplifyAuthenticator>
        <AmplifySignOut />
        <CurrentFolder 
          path={this.state.currentFolder}
          changeFolder={this.changeFolder}
        >
        </CurrentFolder>
        <FileList 
          folder={this.state.currentFolder}
          items={this.state.files}
          changeFolder={this.changeFolder}
        />
        <div>
          <input
              type="file" 
              onChange={this.onChange}
            />
        </div>
        <CreateFolder></CreateFolder>
      </AmplifyAuthenticator>
    )
  }
}

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);

export default App;