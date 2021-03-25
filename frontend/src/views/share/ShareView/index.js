/* eslint padded-blocks: ["error", "always"] */
import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { Box, Container, Card, Modal, Button } from '@material-ui/core';

import './main.css';
import BreadCrumb from './BreadCrumb';
import Nodes from './Nodes';

let cntrlIsPressed = false;
let shiftIsPressed = false;

document.addEventListener('keydown', (e) => {
  
  if(e.key==='Control'){

    cntrlIsPressed = true;

  }else if(e.key === 'Shift'){

    shiftIsPressed = true;

  }
  

})


document.addEventListener('keyup', (e)=>{

  // cntrlIsPressed = false;
  console.log('keyup', e);
  console.log(e.which)
  if(e.key==='Control'){

    cntrlIsPressed = false

  }else if(e.key === 'Shift'){

    shiftIsPressed = false;

  }

});


const ShareView = () => {

  const [files, setFiles] = useState([]);
  const [breadCrumb, setBreadCrumb] = useState([]);
  const [selectedFile, setSelectedFile] = useState({});
  const [path, setPath] = useState(['./test-data']);
  const [modalOpen, setModalOpen] = useState(false);
  const [fileName, setFileName] = useState('');

  const focusRef = useRef(null);
  let mode = false;
  useEffect(() => {

    findData('./test-data');

  }, []);

  function findData(path) {

    axios.get(`/files?directory=${path}`).then(res => {

      axios.get(`/directories?directory=${path}`).then(res2 => {

        setFiles([...res2.data, ...res.data]);

      })

    })

  };

  function onNodeClick(idx, file) {

    const updateFile = [...files];

    console.log('cntrlIsPressed', cntrlIsPressed);
    // if(keyDown)
    if(cntrlIsPressed){

      updateFile[idx].active = updateFile[idx].active ? false : true;
      setFiles(
        updateFile
      );

    }else{

      updateFile.forEach((d) => d.active = false);
      updateFile[idx].active = updateFile[idx].active ? false : true;
      setFiles(
        updateFile
      );

    }
    // )

  }

  function onFolderClick(newPath) {

    setPath([...path, `/${newPath}`]);

    findData(path.join('') + `/${newPath}`);

  }

  function prevFolderClick() {

    path.pop();
    setPath([...path]);
    findData(path.join(''));

  }

  function onClickNewFile() {

    setModalOpen(true);

  }

  function onConfirmModal(){

    if (fileName !== '' && !fileName.includes('.')) {

      axios.post(`/directory?directory=${path.join('')}/${fileName}`).then((res) => {

        setFiles([...files, {name:fileName}]);
        alert('폴더를 생성했습니다.')

      })
        .catch((e) => {

          alert('생성 실패했습니다.')

        });

    }
    setModalOpen(false);
    setFileName('');

  }

  function onCancelModal () {

    setModalOpen(false);
    setFileName('');

  }

  function onChanageFileName (e) {

    setFileName(e.target.value);

  }

  function onClickBread (pathName) {
    
    const pathIndex = path.findIndex(item => {

    {

      console.log(item, pathName);

      if(item === pathName) return true;

    
    }
      
      
    })

    if (pathIndex !== -1) {

      const newPath = path.slice(0, pathIndex + 1);
      console.log(newPath);
      setPath(newPath);
      findData(newPath.join(''));

    } else {

      console.log('pathIndex error');

    }



  }

  let startX = 0;
  let startY = 0;
  

  document.addEventListener('mousemove', (e) => {

    // console.log(clientX);
    // console.log(clientY);
    if(mode){

      let x = e.clientX;
      let y = e.clientY;
  
      
      // console.log('asdsadsad', startX, startY, e.clientX, e.clientY);
  
      const width = Math.max(x - startX, startX - x);
      const left = Math.min(startX, x);
      // console.log('focusRef', focusRef);
      // focusRef.current.style.left = left;
      // focusRef.current.style.width = width;
  
      // console.log('focusRef', focusRef);
      const height = Math.max(y - startY, startY - y);
      const top = Math.min(startY, y);
      // focusRef.current.style.height = height;
      // focusRef.current.style.top = top;
      // console.log(width, left, top, height);
      // focus.css('top', top);
      // focus.css('height', height);

    }


  })

  
  function onMouseDown (e) {

    mode = true;
    console.log('onMouseDown', startX);
    startX = e.clientX;
    startY = e.clientY;

  }


  function onMouseMove(e){
    
    // console.log('onMouseMove');
    if(mode){
      
      let x = e.clientX;
      let y = e.clientY;
  
      
      // console.log('asdsadsad', startX, startY, e.clientX, e.clientY);
  
      const width = Math.max(x - startX, startX - x);
      const left = Math.min(startX, x);
      // console.log('focusRef', focusRef);
      focusRef.current.style.left = left;
      console.log(left);
      focusRef.current.style.width = `${width}px`;
  
      // console.log('focusRef', focusRef);
      const height = Math.max(y - startY, startY - y);
      const top = Math.min(startY, y);
      focusRef.current.style.height = `${height}px`;
      focusRef.current.style.top = `${top}`;
      focusRef.current.style.zIndex='2';
      // focusRef.current.style.cssText=
      // console.log(width, left, top, height, focusRef.current.style);
      // focus.css('top', top);
      // focus.css('height', height);

    }

  }

  function onMouseUp () {

    mode=false;
    console.log(focusRef);
    console.log('onMouseUp');

  }
  
  console.log(files);
  return (
    <>
      <Card>
        <Container maxWidth={false}>
          <Box mt={3}>
            <div className="directory">
              <header>
                <h1>고양이 사진첩</h1>
              </header>
              <main className="App" onMouseDown={onMouseDown} onMouseMove={onMouseMove} onMouseUp={onMouseUp}>
                <nav>
                  <Button variant="outlined" color="secondary" onClick={onClickNewFile}>new folder</Button>
                </nav>
                <BreadCrumb
                  onClickBread={onClickBread}
                  breadCrumb={breadCrumb}
                  path={path} />
                <Nodes
                  files={files}
                  path={path}
                  onNodeClick={onNodeClick}
                  onFolderClick={onFolderClick}
                  prevFolderClick={prevFolderClick}
                />
                <div className="dragRange" ref={focusRef}></div>
              </main>
            </div>
          </Box>
          
        </Container>
        <Modal open={modalOpen}>
          <div className="modal-Wrapper">
            <input placeholder="파일명을 입력하세요" onChange={onChanageFileName} value={fileName}></input>
            <Button variant="contained" color="secondary"  onClick={onConfirmModal}>확인</Button>
            <Button variant="contained" color="primary" onClick={onCancelModal}>취소</Button>
          </div>
        </Modal>
        
      </Card>

    </>
  );

};

export default ShareView;
