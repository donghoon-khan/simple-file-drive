import React, { Component, RefObject } from 'react';
import styled from 'styled-components';

const NodesBlock = styled.div`

  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  flex-wrap: wrap;

.Node {
  width: 140px;
  height: 150px;
  padding: 12px;
  margin: 8px;
  text-align: center;
  display: flex;
  flex-direction: column;
  word-break: keep-all;
}

.Node img{
  min-height: 105px;
}
`; 

type State = {
  contextOpen : boolean,
}

type file = {
  name: string,
  type: string,
  active?: boolean,

}

type Props  = {
  files : file[],
  path  : string[],
  onClickContextMenu : (e: any, idx: number, file: file)=> void,
  onNodeClick: (idx: number, file: file) => void,
  onFolderClick : (folderName: string) => void,
  prevFolderClick : () => void,
  setNodesRef : (ref: HTMLDivElement | null) => void,
}


class Nodes extends Component<Props, State> {
  contextRef: React.RefObject<HTMLElement> = React.createRef();
  state : State = {
    contextOpen: false
  }
  
  setNodesRef = (ref: HTMLDivElement | null) => {
    this.props.setNodesRef(ref);
  }
  

  onContextMenu = (e: any, idx: number, file: file) : void => {

    e.preventDefault();

    console.log(e);

    this.props.onClickContextMenu(e, idx, file);

  }


  onNodeClick = (idx: number, file: file) : void=> {
    console.log('onNodeClick');
    this.setState({
      contextOpen : false,
    });
    this.props.onNodeClick(idx, file);
  }



  folderClick = (folderName: string) => {
    this.props.onFolderClick(folderName);

  }

  prevFolderClick = () => {
    this.props.prevFolderClick();
  }


  onDrop = (e: React.MouseEvent<HTMLDivElement>): void => {
    console.log('onDrop', e);
  }

  allowDrop = (e: React.MouseEvent<HTMLDivElement>): void=> {
    console.log('allowDrop', e);
  }

  onDrag = (e: React.MouseEvent<HTMLDivElement>): void => {
     console.log('e', e);
  }

  render() {
    const { files } = this.props;
    console.log(this.state.contextOpen);
    console.log('paths', this.props.path);
    return (
      <NodesBlock ref={(ref) => { this.setNodesRef(ref) }}>
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

            if (file.type === 'directory') {

              return (
                <div key={file.name}
                  data-idx={idx}
                  onDrop={this.onDrop} //onDragOver={this.allowDrop}
                  // droppable={true}
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
                <img src="/static/images/asset/cat.jpg" alt="이미지" 

                draggable={true}
                />
                <div>{file.name}</div>
              </div>
            );

          })
        }

      </NodesBlock>
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