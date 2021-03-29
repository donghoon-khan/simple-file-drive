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

  constructor(props) {
    super(props);
    this.contextRef = React.createRef();
    this.state = {
      contextOpen: false
    }
  }

  onContextMenu = (e, idx, file) => {
    e.preventDefault();
    // console.log(this.contextRef);
    // console.log(e.clientX, e.clientY);
    // this.contextRef.current.style.position = 'fixed';
    // this.contextRef.current.style.top = e.pageY + 'px';
    // this.contextRef.current.style.left= e.pageX + 'px';
    // this.contextRef.current.style.zIndex='2';
    // if(!file.active){
    //   this.onNodeClick(idx, file);
    // }
    console.log(e);

    this.props.onClickContextMenu(e, idx, file);
    // this.setState({
    //   contextOpen :true,
    // });
  }


  onNodeClick = (idx, file) => {
    console.log('onNodeClick');
    this.setState({
      contextOpen : false,
    });
    this.props.onNodeClick(idx, file);
  }



  folderClick = (folderName) => {
    this.props.onFolderClick(folderName);

  }

  prevFolderClick = () => {
    this.props.prevFolderClick()
  }
  render() {
    const { files } = this.props;
    console.log(this.state.contextOpen);
    return (
      <div className="Nodes">
        {
          this.props.path.length > 1 ?
            <div className="Node"
              onDoubleClick={this.prevFolderClick}
            >
              <img src="/static/images/asset/prev.png" alt="상위폴더" />
            </div>
            :
            null
        }
        {
          files.map((file, idx) => {

            if (!file.name.includes('.')) {

              return (
                <div key={file.name}
                  data-idx={idx}
                  className={`Node ${file.active ? 'active' : ''}`}
                  onClick={() => { this.onNodeClick(idx, file) }}
                  onDoubleClick={() => { this.folderClick(file.name) }}>
                  <img src="/static/images/asset/directory.png" alt="이미지" />
                  <div>{file.name}</div>
                </div>
              );

            }

            return (
              <div key={file.name} className={`Node ${file.active ? 'active' : ''}`}
                onClick={() => { this.onNodeClick(idx, file) }}
                onContextMenu={(e) => { this.onContextMenu(e, idx, file) }}>
                <img src="/static/images/asset/cat.jpg" alt="이미지" />
                <div>{file.name}</div>
              </div>
            );

          })
        }

      </div>
    )
  }
}

export default Nodes;


/**
Enzyme 과 react-testing-library 는 서로 다른 철학을 가지고 있습니다. Enzyme 을 사용하여 테스트 코드를 작성 할 때에는 컴포넌트의 내부 기능을 자주 접근합니다. 예를 들어서 컴포넌트가 지니고 있는 props, state 를 확인하고, 컴포넌트의 내장 메서드를 직접 호출하기도 합니다.

react-testing-library는 반면 렌더링 결과에 조금 더 집중을 합니다.
 실제 DOM 에 대해서 신경을 더 많이 쓰고,
 컴포넌트의 인스턴스에 대해서 신경쓰지 않고,
 실제 화면에 무엇이 보여지는지,
 그리고 어떠한 이벤트가 발생했을때 화면에 원하는 변화가 생겼는지 이런 것을 확인하기에
 조금 더 최적화 되어있습니다.
 그래서, react-testing-library 는 조금 더 사용자의 관점에서 테스팅하기에 더욱 용이합니다.



 */