/* eslint padded-blocks: ["error", "always"] */
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Box, Container, Card, Modal, Button } from '@material-ui/core';

import './main.css';
import BreadCrumb from './BreadCrumb';
import Nodes from './Nodes';

const ShareView = () => {

  const [files, setFiles] = useState([]);
  const [breadCrumb, setBreadCrumb] = useState([]);
  const [selectedFile, setSelectedFile] = useState({});
  const [path, setPath] = useState(['./test-data']);
  const [modalOpen, setModalOpen] = useState(false);
  const [fileName, setFileName] = useState('');

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
    updateFile[idx].active = updateFile[idx].active ? false : true;

    setFiles(
      updateFile
    )

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
              <main className="App">
                <nav>
                  <Button variant="outlined" color="secondary" onClick={onClickNewFile}>new folder</Button>
                </nav>
                <BreadCrumb
                  breadCrumb={breadCrumb}
                  path={path} />
                <Nodes
                  files={files}
                  path={path}
                  onNodeClick={onNodeClick}
                  onFolderClick={onFolderClick}
                  prevFolderClick={prevFolderClick}
                />
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
