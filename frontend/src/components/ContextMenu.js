import React from 'react';

export default function ContextMenu (props) {

  //함수를 참조하고 있는 엘리먼트를 보내야하나 아니면 타입, 전체 함수를 다 전달하고 만들어야 하나 

  function renderChildren(){

    if (props.contextType === 'file') {

      return <>
        <li><a onClick={props.onDownLoadClick}>다운로드</a></li>
        <li><a onClick={props.onRenameClick}>이름변경</a></li>
        <li><a onClick={props.onDeleteClick}>삭제</a></li>
      </>

    } else {

      return <> 
        <li><a onClick={props.onNewFolderClick}>새폴더</a></li>
        <li><a onClick={props.onNewFileClick}>파일추가</a></li>
        {/* <li><a onClick={props.onDeleteClick}>삭제</a></li> */}
      </>

      

    }

  }



  return (
    <div ref={props.contextRef} id='context_menu' className="custom-context-menu" style={{ display: props.contextOpen ? 'block' : 'none' }}>
      <ul className="contextMenu">
        {renderChildren()}
      </ul>
    </div>
  )
}

