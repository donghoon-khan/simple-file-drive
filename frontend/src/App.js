import 'react-perfect-scrollbar/dist/css/styles.css';
import React, { useState } from 'react';
import { useRoutes } from 'react-router-dom';
import { ThemeProvider } from '@material-ui/core';
import GlobalStyles from 'src/components/GlobalStyles';
import 'src/mixins/chartjs';
import theme from 'src/theme';
import routes from 'src/routes';
import axios from 'axios';


import {
  CircularProgress,
  makeStyles,
} from '@material-ui/core';

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
    backgroundColor:'rgba( 255, 255, 255, 0.9 )',
  }
}));




const App = () => {
  const classes = useStyles();
  const routing = useRoutes(routes);

  const [modalOpen, setModalOpen] = useState(false);

  axios.interceptors.request.use(
    function (config) {
      // 요청을 보내기 전에 수행할 일
      setModalOpen(true);
      return config;
    },
    function (error) {
      // 오류 요청을 보내기전 수행할 일
      // ...

      return Promise.reject(error);
    });

  // 응답 인터셉터 추가
  axios.interceptors.response.use(
    function (response) {
      // 응답 데이터를 가공
      // ...
      console.log('asdsadsadsads');
      setModalOpen(false);
      return response;
    },
    function (error) {
      // 오류 응답을 처리
      // ...
      return Promise.reject(error);
    });

  return (
    <>
      <ThemeProvider theme={theme}>
        <GlobalStyles />
        {routing}
      </ThemeProvider>

      {
         modalOpen ?
         <div className={classes.progressBar}>
           <CircularProgress />
         </div> : null
 
      }
    </>
  );
};

export default App;
