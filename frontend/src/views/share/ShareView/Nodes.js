import { FilledInput } from '@material-ui/core';
import axios from 'axios';
import React, { Component } from 'react';
// eslint-disable-next-line react/prefer-stateless-function
// document.addEventListener('click', () => {
//   this.setState({
//     contextOpen : false,
//   })
// })
class Nodes extends Component {

  constructor(props){
    super(props);
    this.contextRef = React.createRef();
    this.state ={
      contextOpen: false
    }
  }

  onContextMenu = (e, idx, file) => {
    e.preventDefault();
    console.log(this.contextRef);
    console.log(e.clientX, e.clientY);
    this.contextRef.current.style.position = 'fixed';
    this.contextRef.current.style.top = e.pageY + 'px';
    this.contextRef.current.style.left= e.pageX + 'px';
    this.contextRef.current.style.zIndex='2';
    if(!file.active){
      this.onNodeClick(idx, file);
    }
    this.setState({
      contextOpen :true,
    });
  }


  onNodeClick = (idx, file) => {
    this.setState({
      contextOpen : false,
    });
    this.props.onNodeClick(idx, file);
  }

  onDownLoadClick = () => {
  const activeFiles = this.props.files.filter(file => 
    file.active
  );
  
  console.log(activeFiles);
    activeFiles.forEach((file) => {
      axios({url: `/file/${file.name}`, method:'GET', responseType: 'blob'}).then((response) => {
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', file.name); //or any other extension
        document.body.appendChild(link);
        link.click();
     });
      
    })

  }

  render() {
    const { files } = this.props;
    
    return (
      <div className="Nodes">
        <div className="Node">
          <img src="/static/images/asset/prev.png" alt="상위폴더" />
        </div>
        {
          files.map((file, idx) => {

            if (file.type === 'DIRECTORY') {

              return (
                <div key={file.name} className={`Node ${file.active ? 'active' : ''}`} onClick={() => { this.onNodeClick(idx, file) }}>
                  <img src="/static/images/asset/directory.png" alt="이미지" />
                  <div>{file.name}</div>
                </div>
              );

            }

            return (
              <div key={file.name} className={`Node ${file.active ? 'active' : ''}`} 
              onClick={() => { this.onNodeClick(idx, file) }}
              onContextMenu={(e)=>{this.onContextMenu(e, idx, file)}}>
                <img src="/static/images/asset/cat.jpg" alt="이미지" />
                <div>{file.name}</div>
              </div>
            );

          })
        }

        <div ref={this.contextRef} id='context_menu' className="custom-context-menu" style={{display: this.state.contextOpen? 'block' : 'none'}}>
          <ul>
            <li><a onClick={this.onDownLoadClick}>다운로드</a></li>
            
          </ul>
        </div>
      </div>
    )
  }
}

export default Nodes;