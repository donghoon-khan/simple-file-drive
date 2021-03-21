import React, { useState, useEffect } from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';

import PerfectScrollbar from 'react-perfect-scrollbar';
import axios from 'axios';
import {

  Box,
  Card,
  Checkbox,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  Typography,
  makeStyles,
  Button
} from '@material-ui/core';
import { Save as SaveIcon, Delete as DeleteIcon } from '@material-ui/icons';

// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
// import { faDownload, faTrash } from '@fortawesome/free-solid-svg-icons'



const useStyles = makeStyles((theme) => ({
  root: {},
  avatar: {
    marginRight: theme.spacing(2)
  },
  button: {
    marginLeft: '10px'
  }
}));

const Results = ({ className, files, setfiles,...rest }) => {
  const classes = useStyles();
  const [selectedCustomerIds, setSelectedCustomerIds] = useState([]);
  const [limit, setLimit] = useState(25);
  const [page, setPage] = useState(0);



  const handleSelectAll = (event) => {
    let newFiles;
    console.log('handleSelectAll');
    if (event.target.checked) {
      newFiles = files.map((file) => {
        file.check = true;
        return file;
      });
    } else {
      newFiles = files.map((file) => {
        file.check = false;
        return file;
      });

    }

    console.log(newFiles);

    setfiles(newFiles);
  };

  const handleSelectOne = (event, idx) => {
    // const selectedIndex = selectedCustomerIds.indexOf(id);
    // let newSelectedCustomerIds = [];

    // if (selectedIndex === -1) {
    //   newSelectedCustomerIds = newSelectedCustomerIds.concat(selectedCustomerIds, id);
    // } else if (selectedIndex === 0) {
    //   newSelectedCustomerIds = newSelectedCustomerIds.concat(selectedCustomerIds.slice(1));
    // } else if (selectedIndex === selectedCustomerIds.length - 1) {
    //   newSelectedCustomerIds = newSelectedCustomerIds.concat(selectedCustomerIds.slice(0, -1));
    // } else if (selectedIndex > 0) {
    //   newSelectedCustomerIds = newSelectedCustomerIds.concat(
    //     selectedCustomerIds.slice(0, selectedIndex),
    //     selectedCustomerIds.slice(selectedIndex + 1)
    //   );
    // }
    const newFiles = [...files];
    if (newFiles[idx].check) {
      newFiles[idx].check = false;

    } else {
      newFiles[idx].check = true;
    }
    console.log(newFiles);

    setfiles(newFiles);
    // setSelectedCustomerIds(newSelectedCustomerIds);
  };

  const handleLimitChange = (event) => {
    setLimit(event.target.value);
  };

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  const onClickExport = (file) => {

    axios({ url: `/file/${file.name}`, method: 'GET', responseType: 'blob' }).then((response) => {
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', file.name); //or any other extension
      document.body.appendChild(link);
      link.click();
    });
  }
  const data = [
    {
      "type": "DIRECTORY",
      "name": "childDirectory",
      "path": ".\\test-data\\childDirectory",
      "mimeType": null
    },
  ];

  return (
    <Card
      className={clsx(classes.root, className)}
      {...rest}
    >
      <PerfectScrollbar>
        <Box minWidth={1050}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell padding="checkbox">
                  <Checkbox
                    checked={files.filter(file => file.check).length === files.length}
                    color="primary"
                    indeterminate={
                      selectedCustomerIds.length > 0
                      && selectedCustomerIds.length < customers.length
                    }
                    onChange={handleSelectAll}
                  />
                </TableCell>
                <TableCell>
                  File Name
                </TableCell>
                <TableCell>
                  type
                </TableCell>
                <TableCell>
                  export
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {files.slice(0, limit).map((file, idx) => (
                <TableRow
                  hover
                  key={file.name}
                  selected={file.check === undefined ? false : file.check}
                >
                  <TableCell padding="checkbox">

                    {file.type !== 'DIRECTORY' ?
                      <Checkbox
                        checked={file.check === undefined ? false : file.check}
                        onChange={(event) => handleSelectOne(event, idx)}
                      // value={file.check===undefined ? false : file.check }
                      /> : null}

                  </TableCell>
                  <TableCell>
                    <Box
                      alignItems="center"
                      display="flex"
                    >

                      <Typography
                        color="textPrimary"
                        variant="body1"
                      >
                        {file.name}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    {file.type}
                  </TableCell>
                  <TableCell>
                    {
                      file.type !== 'DIRECTORY' ? 
                      <>
                        <Button
                      variant="contained"
                      color="secondary"
                      className={classes.button}
                      startIcon={<SaveIcon />}
                      onClick={()=>{onClickExport(file)}}
                    >SAVE</Button>

                    <Button
                      variant="contained"
                      color="primary"
                      className={classes.button}
                      startIcon={<DeleteIcon />}
                    >Delete</Button>
                      </> : null
                    }

                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Box>
      </PerfectScrollbar>
      <TablePagination
        component="div"
        count={files.length}
        onChangePage={handlePageChange}
        onChangeRowsPerPage={handleLimitChange}
        page={page}
        rowsPerPage={limit}
        rowsPerPageOptions={[5, 10, 25]}
      />
    </Card>
  );
};

Results.propTypes = {
  className: PropTypes.string,
};

export default Results;
