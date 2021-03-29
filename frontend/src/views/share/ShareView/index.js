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
  const [path, setPath] = useState(['/']);
  const [modalOpen, setModalOpen] = useState(false);
  const [fileName, setFileName] = useState('');
  const [dragRange, setDragRange] = useState(false);
  const [mode , setMode] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [contextOpen, setContextOpen] = useState(false);
  

  const focusRef = useRef(null);
  const contextRef = useRef(null);
  
  useEffect(() => {

    findData(path.join(''));

  }, []);

  function findData(path) {

    // axios.get(`/files?directory=${path}`).then(res => {

      axios.get(`/directory/${path}`).then(res => {

        setFiles(res.data);

      })

    // })

  };

  function onNodeClick(idx, file) {

    const updateFile = [...files];
    if (cntrlIsPressed) {

      updateFile[idx].active = updateFile[idx].active ? false : true;
      setFiles(updateFile);
      clickStartIndex = idx;

    } else if (shiftIsPressed) {

      if (clickStartIndex === -1) {

        clickStartIndex = idx;
        updateFile[idx].active = updateFile[idx].active ? false : true;

      }else if (clickStartIndex < idx) {

        updateFile.forEach((file, index) => {

          if (index >= clickStartIndex && index <= idx) {

            console.log(index);
            file.active = true;

          }

        })


      } else {

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

      axios.post(`/directory/${path.join('')}/${fileName}`).then((res) => {

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

    } 

  }

  function onMouseDown(e) {

    

    setMode(true);
    console.log('e.which', e.which, e);
    setPosition({x: e.clientX, y: e.clientY})
    focusRef.current.style.display = 'block';
    if(!e.shiftKey && !e.ctrlKey){

      clearSelectedFiles();

    }
    console.log('onMouseDown');
    clearContextOpen();

  }

  function boxIntersects (boxA, boxB) {

    if(boxA.left <= boxB.left + boxB.width &&
      boxA.left + boxA.width >= boxB.left &&
      boxA.top <= boxB.top + boxB.height &&
      boxA.top + boxA.height >= boxB.top) {

      return true;

    }

    return false;

  }

  function onMouseMove(e){
    
    e.preventDefault();

    if (mode) {

      let x = e.clientX;
      let y = e.clientY;
      const width = Math.max(x - position.x, position.x - x);
      const left = Math.min(position.x, x);
      focusRef.current.style.left = `${left}px`;
      
      focusRef.current.style.width = `${width}px`;
  
      const height = Math.max(y - position.y, position.y - y);
      const top = Math.min(position.y, y);
      focusRef.current.style.height = `${height}px`;
      focusRef.current.style.top = `${top}px`;
      focusRef.current.style.zIndex='50';

      const nodes = document.getElementsByClassName('Node');
      
      Array.prototype.forEach.call(nodes, (node, idx) => {

        console.log(node.offsetTop, node.offsetLeft, node.clientWidth, node.clientHeight);
        if (boxIntersects(
          {
            top, left, width, height
          },
          {
            top: node.offsetTop,
            left: node.offsetLeft,
            width: node.clientWidth,
            height: node.clientHeight
          })) {

          node.className = 'Node active';

        } else {

          node.className = 'Node';

        }

      })

    }

  }

  function clearSelectedFiles () {

    const nodes = document.getElementsByClassName('Node');
    Array.prototype.forEach.call(nodes, (node) => {

      node.className = 'Node ';
      
    })

    const newFiles = files.map((file) => {

      file.active = false;
      return file;

    })

    setFiles(newFiles)
    
  }
  
  function onMouseUp() {

    setMode(false);
    setDragRange(false);
    
    focusRef.current.style.display = 'none';
    focusRef.current.style.height = `0px`;
    focusRef.current.style.width = `0px`;
    focusRef.current.style.top = `0px`;
    focusRef.current.style.left = `0px`;
    setActiveFiles();
    
  }

  function setActiveFiles () {

    const activeNodes = document.getElementsByClassName('Node active');

    console.log(setActiveFiles)
    const newFiles = files;
    newFiles.forEach(file => {

      file.active = false;

    })
    
    Array.prototype.forEach.call(activeNodes, activeNode => {

      console.dir( activeNode );
      newFiles.forEach(file => {

        console.log(activeNode.className, activeNode.innerText, file.name);

        if (activeNode.className.includes('active') && activeNode.innerText === file.name) {

          file.active = true;

        } 

      })

    })
    setFiles(newFiles);

  }

  function onClickContextMenu (e, idx, file) {

    e.preventDefault();
    e.stopPropagation();
    console.log(contextRef);
    console.log(e.clientX, e.clientY);
    contextRef.current.style.position = 'fixed';
    contextRef.current.style.top = e.pageY + 'px';
    contextRef.current.style.left= e.pageX + 'px';
    contextRef.current.style.zIndex='2';
    if(!file.active){

      this.onNodeClick(idx, file);

    }

    setContextOpen(true);

  }

  function clearContextOpen() {

    setContextOpen(false);
    console.log('clearContextOpen', contextRef.current.style);
    contextRef.current.style.display = 'none';

  }

  function onDownLoadClick() {

    const activeFiles = files.filter(file => file.active);

    
    console.log(activeFiles, path);

    activeFiles.forEach((file) => {

      axios({ url: `/file${path.join('')}/${file.name}`, method: 'GET', responseType: 'blob' }).then((response) => {

        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', file.name); //or any other extension
        document.body.appendChild(link);
        link.click();
        setContextOpen(false);
        
      });

    })

  }

  function onDeleteClick() {

    const activeFiles = files.filter(file => file.active);

    console.log(activeFiles, path);

    activeFiles.forEach((file) => {

      axios({ url: `/file${path.join('')}/${file.name}`, method: 'delete' }).then((response) => {

        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', file.name); //or any other extension
        document.body.appendChild(link);
        link.click();
        setContextOpen(false);

      });

    })

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
                  onClickContextMenu={onClickContextMenu}
                />
                {/* <div className={`dragRange ${dragRange ? '' : 'hidden'}`} ref={focusRef}></div> */}
                <div className="dragRange" ref={focusRef}></div>
              </main>
            </div>
          </Box>

        </Container>
        {/* <Modal open={modalOpen}> */}
          <div className="modal-Wrapper" style={{display: modalOpen ? 'flex' : 'none'}}>
            <div className="modal-Content">
            <input placeholder="폴더명을 입력해주세요" onChange={onChanageFileName} value={fileName}></input>
            <div>
            <Button variant="outlined" color="secondary" onClick={onConfirmModal}>확인</Button>
            <Button variant="outlined" color="primary" onClick={onCancelModal}>취소</Button>
            </div>
            </div>
          </div>
        {/* </Modal> */}

        <div ref={contextRef} id='context_menu' className="custom-context-menu" style={{display: contextOpen ? 'block' : 'none'}}>
          <ul className="contextMenu">
            <li><a onClick={onDownLoadClick}>다운로드</a></li>
            <li><a onClick={onDeleteClick}>삭제</a></li>

          </ul>
        </div>

      </Card>

    </>
  );

};

export default ShareView;
