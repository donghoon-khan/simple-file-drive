import React, { useState } from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import {
  Box,
  Button,
  Card,
  CardContent,
  TextField,
  InputAdornment,
  SvgIcon,
  makeStyles
} from '@material-ui/core';
import { Search as SearchIcon } from 'react-feather';
import Modal from '../../../components/Modal'

const useStyles = makeStyles((theme) => ({
  root: {},
  importButton: {
    marginRight: theme.spacing(1)
  },
  exportButton: {
    marginRight: theme.spacing(1)
  }
}));

const Toolbar = ({ className, onExportClick, ...rest }) => {
  const classes = useStyles();
  const [modalOpen, setModalOpen] = useState(false);

  const onModalChange = () => {
    setModalOpen(true);
  } 

  const onFileUpload = (e) =>{
    let file = e.target.files[0];
    let formData = new FormData();
    formData.append('files', file);
  }

  const onConfirmFileUpload = () =>{
    setModalOpen(false);
  }

  const onCloseModal = () =>{
    setModalOpen(false);
  }

  return (
    <div
      className={clsx(classes.root, className)}
      {...rest}
    >
      <Box
        display="flex"
        justifyContent="flex-end"
      >
        <Button className={classes.importButton} onClick={onModalChange}>
          Import
        </Button>
        <Button className={classes.exportButton} onClick={(e) => {onExportClick(e)}}>
          Export
        </Button>
      </Box>
      <Box mt={3}>
        <Card>
          <CardContent>
            <Box maxWidth={500}>
              <TextField
                fullWidth
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SvgIcon
                        fontSize="small"
                        color="action"
                      >
                        <SearchIcon />
                      </SvgIcon>
                    </InputAdornment>
                  )
                }}
                placeholder="Search customer"
                variant="outlined"
              />
            </Box>
          </CardContent>
        </Card>
      </Box>
      <Modal open={modalOpen}>
        <input type="file" onChange={(e) => {onFileUpload(e)}}></input>
        <Button onClick={onConfirmFileUpload}>확인</Button>
        <Button onClick={onCloseModal}>취소</Button>
      </Modal>
    </div>
  );
};

Toolbar.propTypes = {
  className: PropTypes.string
};

export default Toolbar;
