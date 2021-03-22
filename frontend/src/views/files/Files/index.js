import React, { useEffect, useState } from 'react';
import {
  Box,
  Container,
  makeStyles
} from '@material-ui/core';
import axios from 'axios';
import Page from 'src/components/Page';
import Results from './Results';
import Toolbar from './Toolbar';
// import data from './data';

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.dark,
    minHeight: '100%',
    paddingBottom: theme.spacing(3),
    paddingTop: theme.spacing(3)
  }
}));

const FileView = () => {
  const classes = useStyles();
  
  const [files, setFiles] = useState([]);
  const [route, setRoute] = useState(['./test-data']);

  useEffect(() => {
    findData('./test-data');
  },[]);
    
  const findData = (path) => {
    axios.get(`/files?directory=${path}`).then(res => {
      axios.get(`/directories?directory=${path}`).then(res2 => {
        setFiles([...res2.data, ...res.data]);
      })
    
  })
}



  const onExportClick = () =>{
    const selectedFile = files.filter((file) => file.check && file.type!=='DIRECTORY')
    if( selectedFile.length ===0) {
      alert('선택된 파일이 없습니다.');
      return;
    }
    files.forEach((file) => {
      if(file.check && !file.name.includes('.')){
        console.log(file.name)
        
        axios({url: `./test-data/file/${file.name}`, method:'GET', responseType: 'blob'}).then((response) => {
          const url = window.URL.createObjectURL(new Blob([response.data]));
          const link = document.createElement('a');
          link.href = url;
          link.setAttribute('download', file.name); //or any other extension
          document.body.appendChild(link);
          link.click();
       });
      }
    })
  }

  const handleAddRoute = (data) =>{
    setRoute([...route, `/${data}`])
    findData(route.join('')+`/${data}`);
  }

  const handleRemoveRoute = () => {
    const newRoute = [...route];
    newRoute.pop();
    setRoute(newRoute);
  } 

  return (
    <Page
      className={classes.root}
      title="Files"
    >
      <Container maxWidth={false}>
        <Box mt={3}>
          <Toolbar onExportClick={onExportClick}/>
          <Results onDoubleClick={handleAddRoute} onRemoveRoute={handleRemoveRoute} files={files} setfiles={setFiles}/>
        </Box>
      </Container>
    </Page>
  );
};

export default FileView;
