import React, { useEffect, useState } from 'react';
import {
  Box,
  Container,
  makeStyles,
  CircularProgress
} from '@material-ui/core';
import axios from 'axios';
import Page from 'src/components/Page';
import Results from './Results';
import Toolbar from './Toolbar';
import { AdbSharp } from '@material-ui/icons';
import { AlignCenter } from 'react-feather';
// import data from './data';

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.dark,
    minHeight: '100%',
    paddingBottom: theme.spacing(3),
    paddingTop: theme.spacing(3)
  },
  progressBar : {
    position: 'absolute',
    display: 'flex',
    justifyContent: 'center',
    alignItems:'center',
    zIndex:100,
    left:0,
    top: 0,
    width:'100%',
    height: '100%',
    
    backgroundColor:'rgba( 255, 255, 255, 0.5 )',
  }
}));

const FileView = () => {
  const classes = useStyles();
  
  const [files, setFiles] = useState([]);
  const [route, setRoute] = useState(['./test-data']);
  const [progress, setProgress] = useState(false);

  useEffect(() => {
    findData('./test-data');
  },[]);
    
  const findData = (path) => {
    setProgress(true);
    axios.get(`/files?directory=${path}`).then(res => {
      axios.get(`/directories?directory=${path}`).then(res2 => {
        setFiles([...res2.data, ...res.data]);
        setProgress(false);
      })
    
  })
}



  const onExportClick = () =>{
    const selectedFile = files.filter((file) => file.check && file.name.includes('.'))
    if( selectedFile.length ===0) {
      alert('선택된 파일이 없습니다.');
      return;
    }
    setProgress(true);
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
          setProgress(false);
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
    findData(newRoute.join(''));
  } 

  return (
    <Page
      className={classes.root}
      title="Files"
    >


      <Container maxWidth={false}>
        <Box mt={3}>
          <Toolbar onExportClick={onExportClick}/>
          <Results route={route} onDoubleClick={handleAddRoute} onRemoveRoute={handleRemoveRoute} files={files} setfiles={setFiles}/>
        </Box>
      </Container>
      {/* {
        progress ?
          <div className={classes.progressBar}>
            <CircularProgress />
          </div> : null
      } */}
    </Page>
  );
};

export default FileView;
