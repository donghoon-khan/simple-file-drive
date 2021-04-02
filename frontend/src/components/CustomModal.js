import React, { useRef, useState } from 'react';
import { Button } from '@material-ui/core';


export default function CustomModal (props) {
  const newFileInput = useRef(null);
  const [selectedFile, setSelectedFile] = useState('');

  
  
  function renderChildren(){
    console.log('prop.type 출력 : ', props.type);
    if (props.type === 'NEW_DIRECTORY') {
      return <><h1>새 폴더</h1>
        <input placeholder="폴더명을 입력해주세요" onChange={props.onChanageFileName} value={props.fileName}></input>
        <div>
          <Button variant="outlined" color="secondary" onClick={props.onConfirmModal}>확인</Button>
          <Button variant="outlined" color="primary" onClick={props.onCancelModal}>취소</Button>
        </div></>
    } else if (props.type === 'NEW_FILE') {
      return <><h1>새 파일</h1>
        <input
          ref={newFileInput}
          id="newFile"
          type="file"
          onChange={newFileChnage}
          value={selectedFile}
        >
        </input>
        <div>
          <Button variant="outlined" color="secondary" onClick={onConfirmModal}>확인</Button>
          <Button variant="outlined" color="primary" onClick={onCancelModal}>취소</Button>
        </div></>
    } else if ( props.type === 'RENAME_FILE' ){
      const activeFiles = props.files.filter((file) => file.active);
      let name = '';
      if(activeFiles.length === 1){
        name = activeFiles[0].name;
      }
      
      return <><h1>이름 바꾸기</h1>
        <input onChange={props.onChanageFileName} value={props.fileName}></input>
        <div>
          <Button variant="outlined" color="secondary" onClick={props.onConfirmModal}>확인</Button>
          <Button variant="outlined" color="primary" onClick={props.onCancelModal}>취소</Button>
        </div></>
    }
  }

  function onConfirmModal () {
    if (props.type === 'NEW_DIRECTORY') {

      props.onConfirmModal();

    } else if (props.type === 'NEW_FILE') {

      console.log(newFileInput);
      props.onConfirmModal(selectedFile);
      setSelectedFile('');

    }

  }


  function onCancelModal ( ) {

    if (props.type === 'NEW_FILE') {
      
      setSelectedFile('');
      props.onCancelModal();

    }

  }

  function newFileChnage(e){

    console.log('newFileChnage', e.target.files[0]);
    setSelectedFile(e.target.files[0]);

  }

  return (

    <div className="modal-Wrapper" style={{ display: props.modalOpen ? 'flex' : 'none' }}>
      <div className="modal-Content">
        {renderChildren()}
      </div>
    </div>

  )

}


// export default CustomModal;