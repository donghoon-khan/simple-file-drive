/* eslint padded-blocks: ["error", "always"] */
import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { Box, Container, Card, Button } from '@material-ui/core';

import './main.css';
import BreadCrumb from './BreadCrumb';
import Nodes from './Nodes';
import { CreateNewFolder } from '@material-ui/icons';
import CustomModal from 'src/components/CustomModal';
import ContextMenu from 'src/components/ContextMenu';

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

  if (e.key === 'Control') {

    cntrlIsPressed = false

  } else if (e.key === 'Shift') {

    shiftIsPressed = false;

  }

});

type file = {
  name: string,
  type: string,
  active?: boolean
}

type DragMode = {
  mode: boolean,
  dragElements: file[]
}

let clickStartIndex = -1;

const ShareView = () => {

  const [files, setFiles] = useState<file[]>([]);
  const [path, setPath] = useState<string[]>(['/']);
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [fileName, setFileName] = useState<string>('');
  const [mode , setMode] = useState<boolean>(false);
  const [dragMode , setDragMode] = useState<DragMode>({mode: false, dragElements : []});
  const [position, setPosition] = useState<{x: number, y: number}>({ x: 0, y: 0 });
  const [contextOpen, setContextOpen] = useState<boolean>(false);
  const [mouseRangeDrag, setMouseRangeDrag] = useState<boolean>(true);
  const [modalType, setModalType] = useState<string>('NEW_DIRECTORY');

  const [contextType, setContextType] = useState('file');
  

  const focusRef = useRef<HTMLDivElement>(null);
  const contextRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {

    findData(path.join(''));

  }, []);

  function findData(path: string) : void{


      axios.get(`/directory/${path}`).then(res => {

        setFiles(res.data);

      })

  };

  function onNodeClick(idx: number, file: file) : void{

    const updateFile = [...files];
    if (cntrlIsPressed) {

      updateFile[idx].active = updateFile[idx].active ? false : true;
      setFiles(updateFile);
      clickStartIndex = idx;

    } else if (shiftIsPressed) {

      if (clickStartIndex === -1) {

        clickStartIndex = idx;
        updateFile[idx].active = updateFile[idx].active ? false : true;

      } else if (clickStartIndex < idx) {

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

  }

  function onFolderClick(newPath: string) {

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

  function onConfirmModal(data: string) {

    if(modalType==='NEW_DIRECTORY'){

      if (fileName !== '' && !fileName.includes('.')) {
  
        axios.post(`/directory/${path.join('')}/${fileName}`).then((res) => {
  
          setFiles([...files, { name: fileName, type: 'directory' }]);
          alert('폴더를 생성했습니다.')
  
        })
          .catch((e) => {
  
            alert('생성 실패했습니다.')
  
          });
  
      }

      setFileName('');

    } else if (modalType === 'NEW_FILE') {

      //파일업로드 구현
      console.log('modalType===NEW_FILE', data);
      var frm = new FormData();
      frm.append('file', data);
      axios.post(`/file?force=false`, frm, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }).then((e) => {

        alert('파일을 추가했습니다.');

      })
        .catch((e) => {

          alert('파일 추가에 실패 했습니다.');

        })

    }

    setModalOpen(false);

  }

  function onCancelModal() {

    setModalOpen(false);
    setFileName('');

  }

  function onChanageFileName(e: any) {

    setFileName(e.target.value);

  }

  function onClickBread(pathName: string) {

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

  function onMouseDown(e: any) {

    console.log(document.elementFromPoint(e.clientX, e.clientY));
    const pointElement = document.elementFromPoint(e.clientX, e.clientY);
    setContextOpen(false);
    if(pointElement){
      
      console.log('pointElement.className', pointElement.className);
      if(pointElement.className && pointElement.className.includes('App')||pointElement.className.includes('Nodes') || e.ctrlKey || e.shiftKey){ //1. 메인 클릭했을때 드래그 범위 나오도록 해야함
  
        //2.컨트롤 클릭했을 때도 드래그 범위나오도록
        e.stopPropagation();
  
        if(e.button===0) {
    
          setMode(true);
          setPosition({x: e.clientX, y: e.clientY})
          if(focusRef && focusRef.current){

            focusRef.current.style.display = 'block';

          }
          if (!e.shiftKey && !e.ctrlKey) {
  
            clearSelectedFiles();
  
          }
          clearContextOpen();
          
        }
  
      } else if(pointElement.className.includes('Node ') || pointElement.tagName ==='IMG'){
        
        //여기서 한번 files 해줘야함 컨트롤 클릭은 위로 가니까 밑에 
        //그냥 클릭할때 원래 active 취소하고
        //얘가 액티브가 아니라면 액티브를 해주고 다른건 다 취소해야댄다
        const pointElement = document.elementFromPoint(e.clientX, e.clientY);

        if(pointElement){

          const targetElement: any = pointElement.tagName==='IMG' ? pointElement.parentNode : document.elementFromPoint(e.clientX, e.clientY);
          // console.log('targetElement', targetElement.className.includes('Node active'));

          if(targetElement){

            if( !targetElement.className.includes('Node active')){
      
              clearSelectedFiles();
              targetElement.className = 'Node active';
              setActiveFiles(e);
      
            }
            const activeFiles = files.filter((file) => file.active);
      
            setDragMode({ mode: true, dragElements: activeFiles });

          }

        }

  
      }

    }

    console.dir(document.elementFromPoint(e.clientX, e.clientY));

  }

  

  function boxIntersects (boxA: {top: number, left: number, width: number, height: number}, boxB: {top: number, left: number, width: number, height: number}) {

    if(boxA.left <= boxB.left + boxB.width &&
      boxA.left + boxA.width >= boxB.left &&
      boxA.top <= boxB.top + boxB.height &&
      boxA.top + boxA.height >= boxB.top) {

      return true;

    }

    return false;

  }

  function onMouseMove(e: any){
    
    e.preventDefault();
    e.stopPropagation();
    
    if (mode) {
    

      let x = e.clientX;
      let y = e.clientY;

      const width = Math.max(x - position.x, position.x - x);
      const left = Math.min(position.x, x);
      const height = Math.max(y - position.y, position.y - y);
      const top = Math.min(position.y, y);
      
      if(focusRef && focusRef.current){

        focusRef.current.style.left = `${left}px`;
        focusRef.current.style.width = `${width}px`;
        focusRef.current.style.height = `${height}px`;
        focusRef.current.style.top = `${top}px`;
        focusRef.current.style.zIndex='50';

      }

      const nodes = document.getElementsByClassName('Node');
      //신나게 Node를 돌면서 드래그 박스안에 있는지 확인한다.
      Array.prototype.forEach.call(nodes, (node, idx) => {

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

          if ((e.ctrlKey || e.shiftKey) && node.className.includes('Node active')) {

            node.className = 'Node active';

          } else {

            node.className = 'Node';

          }

        }

      })

    } else if (dragMode.mode) {

      let x = e.clientX;
      let y = e.clientY;

      if( dragRef && dragRef.current){

        dragRef.current.style.position = 'fixed';
        dragRef.current.style.left = `${x+5}px`;
        dragRef.current.style.top = `${y+5}px`;

      }

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
  
  function onMouseUp(e: any) {

    e.stopPropagation();
    setMode(false);
    setDragMode({mode: false, dragElements : []});
    if(focusRef && focusRef.current){

      focusRef.current.style.display = 'none';
      focusRef.current.style.height = `0px`;
      focusRef.current.style.width = `0px`;
      focusRef.current.style.top = `0px`;
      focusRef.current.style.left = `0px`;

    }

    if(dragRef && dragRef.current){

      dragRef.current.style.position = 'fixed';
      dragRef.current.style.left = `${0}px`;
      dragRef.current.style.top = `${0}px`;

    }


    const currentNode: any = findCurrentNodeElement(e);
    console.log('mouseUpCurrentNode ', currentNode);

    if(currentNode && currentNode.childNodes[0].currentSrc && currentNode.childNodes[0] && (typeof currentNode.childNodes[0].currentSrc === 'string') && currentNode.childNodes[0].currentSrc.includes('directory')){

      console.log('이동 구현필요');

    }
    //currentNode가directory가 아니라면 그냥끝 directory라면 폴더에 넣는다 

    setActiveFiles(e);
    
  }

  function findCurrentNodeElement(e: any) {

    const target = document.elementFromPoint(e.clientX, e.clientY);
    if(target && target.tagName==='IMG'){

      return target.parentNode;

    }else{

      return target;

    }

  }

  function setActiveFiles (e: any) {

    const activeNodes = document.getElementsByClassName('Node active');

    const newFiles = files;
    if(!e.ctrlKey  && !e.shiftKey){

      newFiles.forEach(file => {
  
        file.active = false;
  
      })

    }
    
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

  function onClickContextMenu (e: any, idx: number, file: file) {

    const activeFiles = files.filter((file) => file.active);
    
    if(activeFiles.length === 1){

      setFileName(activeFiles[0].name);

    }
    

    e.preventDefault();
    e.stopPropagation();
    console.log(contextRef);
    console.log(e.clientX, e.clientY);
    if( contextRef && contextRef.current){

      contextRef.current.style.position = 'fixed';
      contextRef.current.style.top = e.pageY + 'px';
      contextRef.current.style.left= e.pageX + 'px';
      contextRef.current.style.zIndex='2';

    }
    //여러개일때 분기 한번 필요
    //한개일때 ? 
    
    if(file && !file.active){

      onNodeClick(idx, file);

    }

    //file Modal 에 context에 전달 필요

    setContextOpen(true);
    setContextType('file');

  }

  function clearContextOpen() {

    setContextOpen(false);

    if( contextRef && contextRef.current){

      contextRef.current.style.display = 'none';

    }

  }

  function onDownLoadClick() {

    

    const activeFiles = files.filter(file => file.active);

    
    console.log(activeFiles, path);

    activeFiles.forEach((file) => {

      if (file.type !== 'directory') {

        axios({ url: `/file${path.join('')}/${file.name}`, method: 'GET', responseType: 'blob' }).then((response) => {

          const url = window.URL.createObjectURL(new Blob([response.data]));
          const link = document.createElement('a');
          link.href = url;
          link.setAttribute('download', file.name); //or any other extension
          document.body.appendChild(link);
          link.click();
          setContextOpen(false);

        });

      }

    });

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

  function mainContextMenu (e: any) {

    e.preventDefault();
    console.log('mainContextMenu', e)
    setContextType('background');
    if(contextRef && contextRef.current){

      contextRef.current.style.position = 'fixed';
      contextRef.current.style.top = e.pageY + 'px';
      contextRef.current.style.left= e.pageX + 'px';
      contextRef.current.style.zIndex='2';

    }
    setContextOpen(true);

  }

  function onRenameClick () {

    // 동적으로 렌더링 바꾸기 어케하지
    console.log('onRenameClick');
    setModalType('RENAME_FILE');
    setModalOpen(true);
    setContextOpen(false);
    // 모달내용, context 내용
    
  }

  function onNewFolderClick(){

    setModalType('NEW_DIRECTORY');
    onClickNewFile();
    setContextOpen(false);

  }

  function onNewFileClick(){

    setModalType('NEW_FILE');
    setModalOpen(true);
    setContextOpen(false);

  }

  return (
    <>
      <Card>
        <Container maxWidth={false}>
          <Box mt={3}>
            <div className="directory">
              <header>
                <h1>고양이 사진첩</h1>
              </header>
              <main className="App"
                onMouseDown={onMouseDown } 
                onMouseMove={onMouseMove} 
                onMouseUp={onMouseUp}
                onContextMenu={mainContextMenu}
              >
                <nav>
                  <Button variant="outlined" color="secondary" onClick={onClickNewFile}><CreateNewFolder/></Button>
                </nav>
                <BreadCrumb
                  onClickBread={onClickBread}
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
        <CustomModal
          modalOpen={modalOpen}
          onChanageFileName={onChanageFileName}
          onConfirmModal={onConfirmModal}
          onCancelModal={onCancelModal}
          fileName={fileName}
          type={modalType}
          files={files}
        />
         
        
      <ContextMenu
        onDeleteClick={onDeleteClick}
        onRenameClick={onRenameClick}
        onDownLoadClick={onDownLoadClick}
        onNewFolderClick={onNewFolderClick}
        onNewFileClick={onNewFileClick}
        contextOpen={contextOpen}
        contextRef={contextRef}
        contextType={contextType}
        files={files}
      />
        <div ref={dragRef} className="dragContainer">
          {/* <div className="item" style={{'--n': 1, }}>file.jpg</div>
          <div className="item" style={{'--n': 2, }}>file.jpg</div>
          <div className="item" style={{'--n': 3, }}>file.jpg</div> */}
          {/* <div className="count">3</div> */}
          {
            dragMode.dragElements.map((file, idx) => {

              return <div
                key={file.name}
                className="item">
                {file.name}
              </div>

            })
          }
          {dragMode.dragElements.length > 0 ? <div className="count">{dragMode.dragElements.length} </div> : null}

        </div>
        

      </Card>

    </>
  );

};

export default ShareView;