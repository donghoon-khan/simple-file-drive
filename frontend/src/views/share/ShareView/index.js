/* eslint padded-blocks: ["error", "always"] */
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Box, Container, Card } from '@material-ui/core';

import './main.css';
import BreadCrumb from './BreadCrumb';
import Nodes from './Nodes';

const ShareView = () => {

  const [files, setFiles] = useState([]);
  const [breadCrumb, setBreadCrumb] = useState([]);
  const [selectedFile, setSelectedFile] = useState({});

  useEffect(() => {

    axios.get('/files').then((res) => {

      console.log(res);
      setFiles(res.data);

    });

  }, []);

  function onNodeClick (idx, file) {

    const updateFile = [...files];
    updateFile[idx].active = updateFile[idx].active ? false : true;
    
    setFiles(
      updateFile
    )

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
                <BreadCrumb breadCrumb={breadCrumb} />
                <Nodes files={files} onNodeClick={onNodeClick} />
              </main>
            </div>
          </Box>
        </Container>
      </Card>
    </>
  );

};

export default ShareView;
