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

  if (e.key === 'Control') {

    cntrlIsPressed = true;

  } else if (e.key === 'Shift') {

    shiftIsPressed = true;

  }


})


document.addEventListener('keyup', (e) => {

  // cntrlIsPressed = false;
  // console.log('keyup', e);
  
  if (e.key === 'Control') {

    cntrlIsPressed = false

  } else if (e.key === 'Shift') {

    shiftIsPressed = false;

  }

});


let clickStartIndex = -1;

const ShareView = () => {

  const [files, setFiles] = useState([]);
  const [breadCrumb, setBreadCrumb] = useState([]);
  const [selectedFile, setSelectedFile] = useState({});
  const [path, setPath] = useState(['./test-data']);
  const [modalOpen, setModalOpen] = useState(false);
  const [fileName, setFileName] = useState('');
  const [dragRange, setDragRange] = useState(false);

  const focusRef = useRef(null);
  let mode = false;
  useEffect(() => {

    findData(path.join(''));

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

    console.log('cntrlIsPressed', cntrlIsPressed, 'shiftIsPressed', shiftIsPressed);
    // if(keyDown)
    if (cntrlIsPressed) {

      updateFile[idx].active = updateFile[idx].active ? false : true;
      setFiles(
        updateFile
      );
      clickStartIndex = idx;

    } else if (shiftIsPressed) {

      console.log('여기', clickStartIndex, idx);

      if (clickStartIndex === -1) {

        console.log('여기111111111',clickStartIndex);

        clickStartIndex = idx;
        updateFile[idx].active = updateFile[idx].active ? false : true;

      }else if (clickStartIndex < idx) {

        console.log('여기22222222');

        updateFile.forEach((file, index) => {

          if (index >= clickStartIndex && index <= idx) {

            console.log(index);
            file.active = true;

          }

        })


      } else {

        console.log('여기333333');

        updateFile.forEach((file, index) => {



          if (index <= clickStartIndex && index >= idx) {

            file.active = true;

          }

        })


      }

      // updateFile[idx].active = updateFile[idx].active ? false : true;

      setFiles(
        updateFile
      );

    } else {

      updateFile.forEach((d) => d.active = false);
      updateFile[idx].active = updateFile[idx].active ? false : true;
      clickStartIndex = idx;
      console.log('clickStartIndex', clickStartIndex);
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

  function onConfirmModal() {

    if (fileName !== '' && !fileName.includes('.')) {

      axios.post(`/directory?directory=${path.join('')}/${fileName}`).then((res) => {

        setFiles([...files, { name: fileName }]);
        alert('폴더를 생성했습니다.')

      })
        .catch((e) => {

          alert('생성 실패했습니다.')

        });

    }
    setModalOpen(false);
    setFileName('');

  }

  function onCancelModal() {

    setModalOpen(false);
    setFileName('');

  }

  function onChanageFileName(e) {

    setFileName(e.target.value);

  }

  function onClickBread(pathName) {

    const pathIndex = path.findIndex(item => {

      {

        console.log(item, pathName);

        if (item === pathName) return true;


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

    if (mode) {

      let x = e.clientX;
      let y = e.clientY;

      const width = Math.max(x - startX, startX - x);
      const left = Math.min(startX, x);
      const height = Math.max(y - startY, startY - y);
      const top = Math.min(startY, y);

    }


  })


  function onMouseDown(e) {

    mode = true;
    startX = e.clientX;
    startY = e.clientY;
    
    // setFiles(files.map(file => {
      
    //   file.active = false; return file
    
    // })
    // );
    // setDragRange(true);
    focusRef.current.style.display = 'block';

  }


  function onMouseMove(e){
    
    if (mode) {

      let x = e.clientX;
      let y = e.clientY;
  
      const width = Math.max(x - startX, startX - x);
      const left = Math.min(startX, x);
      focusRef.current.style.left = `${left}px`;
      console.log(left);
      focusRef.current.style.width = `${width}px`;
  
      const height = Math.max(y - startY, startY - y);
      const top = Math.min(startY, y);
      focusRef.current.style.height = `${height}px`;
      focusRef.current.style.top = `${top}px`;
      focusRef.current.style.zIndex='50';
      // focusRef.current.style.cssText=
      // console.log(width, left, top, height, focusRef.current.style);
      // focus.css('top', top);
      // focus.css('height', height);

    }

  }

  function onMouseUp() {

    mode = false;
    console.log(focusRef);
    console.log('onMouseUp');
    setDragRange(false);
    focusRef.current.style.display = 'none';
    focusRef.current.style.height = `0px`;
    focusRef.current.style.width = `0px`;
    focusRef.current.style.top = `0px`;
    focusRef.current.style.left = `0px`;
    
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
                {/* <div className={`dragRange ${dragRange ? '' : 'hidden'}`} ref={focusRef}></div> */}
                <div className="dragRange" ref={focusRef}></div>
              </main>
            </div>
          </Box>

        </Container>
        <Modal open={modalOpen}>
          <div className="modal-Wrapper">
            <input placeholder="파일명을 입력하세요" onChange={onChanageFileName} value={fileName}></input>
            <Button variant="contained" color="secondary" onClick={onConfirmModal}>확인</Button>
            <Button variant="contained" color="primary" onClick={onCancelModal}>취소</Button>
          </div>
        </Modal>

      </Card>

    </>
  );

};

export default ShareView;
