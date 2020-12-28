import React from 'react';
import { Storage } from 'aws-amplify' ;

export class FileList extends React.Component {
  constructor(props) {
    super(props)
    this.onClick = this.onClick.bind(this)
    this.state = { 
      folder: props.folder,
      files: props.files
    }
    this.listFiles()
  }

  static defaultProps = {
    folder: "",
    files: []
  }

  componentWillReceiveProps = (nextProps) => {
    console.log("FileList.receiveProps: nextProps.folder="+nextProps.folder)
    this.setState({ folder: nextProps.folder });
    this.listFiles()
  }

  onClick(e) {
    // 1. 폴더 => 해당 폴더로 이동
    // 2. 파일 => 다운로드
    const path = e.target.textContent;
    if (path.endsWith('/')) {
      this.props.changeFolder(path);
    }
    console.log(e.target);
  }

  delete = item => e =>  {
      console.log("delete:"+item)
      Storage.remove(item)
      let files = this.state.files
      files.splice(files.indexOf(item),1)
      console.log("files1="+files)
      this.setState({files: files})
  }

  download = item => e => {
    console.log("download : " + item)
    Storage.get(item, {download: true})
    .then(res => this.downloadBlob(res.Body, item))
  }

  downloadBlob(blob, filename) {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename || 'download';
    const clickHandler = () => {
      setTimeout(() => {
        URL.revokeObjectURL(url);
        a.removeEventListener('click', clickHandler);
      }, 150);
    };
    a.addEventListener('click', clickHandler, false);
    a.click();
    return a;
  }

  listFiles = async () => {
    const files = await Storage.list(this.state.folder)
    console.log("FileList.list folder="+this.state.folder)
    let signedFiles = files.map(f => {
      return f.key
    })

    signedFiles = await Promise.all(signedFiles)
    signedFiles.map( f => {
      if (!f.startsWith(this.state.folder)) {
        console.log('just return: '+f+",folder="+this.state.folder)
        return null;
      }
      return f;
    })
    console.log("FileList.list files="+signedFiles)
    this.setState({ files: signedFiles })
  }

  render() {
    const list = this.state.files.map(
        (item) => {
          if (item !== "" && item.startsWith(this.state.folder)) {
            return (
              <li key={item}>
                <span onClick={this.onClick}>
                  {item}
                </span>
                <span onClick={this.delete(item)}>
                  [Delete]
                </span>
                <span onClick={this.download(item)}>
                  [Download]
                </span>
              </li>
            )
          }
        }
    )

    return (
      <div>
        <ul>
          {list}
        </ul>
      </div>
    );
  }
}
