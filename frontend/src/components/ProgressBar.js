import React from 'react';
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
    
    backgroundColor:'rgba( 255, 255, 255, 0.5 )',
  }
}));

const ProgressBar = (open) => {
  return
  <>
    
  </>
}

export default ProgressBar