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
              <img src="/static/images/asset/prev.png" alt="????????????" />
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
                  <img src="/static/images/asset/directory.png" alt="?????????" />
                  <div>{file.name}</div>
                </div>
              );

            }

            return (
              <div key={file.name} className={`Node ${file.active ? 'active' : ''}`}
                onClick={() => { this.onNodeClick(idx, file) }}

                onContextMenu={(e) => { this.onContextMenu(e, idx, file) }}>
                <img src="/static/images/asset/cat.jpg" alt="?????????" 

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
Enzyme ??? react-testing-library ??? ?????? ?????? ????????? ????????? ????????????. Enzyme ??? ???????????? ????????? ????????? ?????? ??? ????????? ??????????????? ?????? ????????? ?????? ???????????????. ?????? ????????? ??????????????? ????????? ?????? props, state ??? ????????????, ??????????????? ?????? ???????????? ?????? ??????????????? ?????????.

react-testing-library??? ?????? ????????? ????????? ?????? ??? ????????? ?????????.
 ?????? DOM ??? ????????? ????????? ??? ?????? ??????,
 ??????????????? ??????????????? ????????? ???????????? ??????,
 ?????? ????????? ????????? ???????????????,
 ????????? ????????? ???????????? ??????????????? ????????? ????????? ????????? ???????????? ?????? ?????? ???????????????
 ?????? ??? ????????? ??????????????????.
 ?????????, react-testing-library ??? ?????? ??? ???????????? ???????????? ?????????????????? ?????? ???????????????.



 */