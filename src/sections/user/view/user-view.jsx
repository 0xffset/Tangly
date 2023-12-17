import axios from 'axios';
import { useState, useEffect } from 'react';

import { Grid } from '@mui/material';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import Alert from '@mui/material/Alert';
import Collapse from '@mui/material/Collapse';
import Container from '@mui/material/Container';
import TableBody from '@mui/material/TableBody';
import SendIcon from '@mui/icons-material/Send';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import LoadingButton from '@mui/lab/LoadingButton';
import TableContainer from '@mui/material/TableContainer';
import TablePagination from '@mui/material/TablePagination';

import Scrollbar from 'src/components/scrollbar';
import FileUpload from 'src/components/drop-upload-file/FileUpload';
import HorizontalLinearStepper from 'src/components/strapper/strapper';

import TableNoData from '../table-no-data';
import UserTableRow from '../user-table-row';
import UserTableHead from '../user-table-head';
import TableEmptyRows from '../table-empty-rows';
import UserTableToolbar from '../user-table-toolbar';
import { emptyRows, applyFilter, getComparator } from '../utils';

// ----------------------------------------------------------------------

export default function UserPage() {
  const [page, setPage] = useState(0);

  const [order, setOrder] = useState('asc');

  const [selected, setSelected] = useState([]);

  const [orderBy, setOrderBy] = useState('name');

  const [filterName, setFilterName] = useState('');
 
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [userData, setUserData] = useState([]);
  const [isValidStep2, SetIsValidStep2] = useState(false);
  const [isValidStep3, SetIsValidStep3] = useState(false);
  const [loading, setLoading] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [type, setType] = useState('info');
  const [transactionData, setTransactionData] = useState({
    'recipient': '',
    'file': ''
  });
  const API_URL = import.meta.env.VITE_ENVIRONMENT === "development" ? import.meta.env.VITE_SERVER_DEVELOPMENT : import.meta.env.VITE_SERVER_PRODUCTION

  const handleSort = (event, id) => {
    const isAsc = orderBy === id && order === 'asc';
    if (id !== '') {
      setOrder(isAsc ? 'desc' : 'asc');
      setOrderBy(id);
    }
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = userData.map((n) => n.name);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const checkStep2Valid = (value) => {
    setDisabled(false)
    SetIsValidStep2(value);
  }
  const checkStep3Valid = (value) => {
    SetIsValidStep3(value);
  }

  const handleClick = (event, name) => {
    const selectedIndex = selected.indexOf(name);
    let newSelected = [];
    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, name);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
    }
    setTransactionData((prev) => ({
      ...prev,
      recipient: newSelected[0]
    }));
    setSelected(newSelected);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setPage(0);
    setRowsPerPage(parseInt(event.target.value, 10));
  };

  const handleFilterByName = (event) => {
    setPage(0);
    setFilterName(event.target.value);
  };

  const dataFiltered = applyFilter({
    inputData: userData,
    comparator: getComparator(order, orderBy),
    filterName,
  });

  const notFound = !dataFiltered.length && !!filterName;
  
  useEffect(() => {
    const auth_token = localStorage.getItem("auth_token");
    const auth_token_type = localStorage.getItem("auth_token_type");
    const token = `${auth_token_type} ${auth_token}`;

    axios.get(`${API_URL}users/all`, {
      headers: { Authorization: token },
    })
      .then((res) => {
        setUserData(res.data.result);
      })
  }, [API_URL])


  const handleClickSendTransaction = () => {
    const auth_token = localStorage.getItem("auth_token");
    const auth_token_type = localStorage.getItem("auth_token_type");
    const token = `${auth_token_type} ${auth_token}`;

    const url = `${API_URL}tangle/transaction/new?recipient=${transactionData.recipient}`;
    setLoading(true);
    const formData = new FormData();
    formData.append("recipient", transactionData.recipient);
    formData.append("file", transactionData.file);
    const config = {
      headers: {
        'Accept': 'application/json',
        'content-type': 'multipart/form-data',
        'Authorization': token
      }
    }
    axios.post(url, formData, config).then((res) => {
      if (res.data.result.error !== undefined) {
        setMessage(res.data.result.error)
        setLoading(false);
        setDisabled(false);
        setOpen(true);
        setType('error');
      }
      else if (res.data.result.success !== undefined) {
        setMessage("Transaction was send successfully!")
        setLoading(false);
        setDisabled(true);
        setOpen(true);
        setType('success');
        setTransactionData({ file: '', recipient: '' })

      }
    }).catch((err) => {
      setMessage("Fields required.")
      setLoading(false);
      setDisabled(false);
      setOpen(true);
      setType('error');
    })
  }
  const FileUploadProps = {
    accept: 'image/* video/* file/*',
    onChange: (event) => {
      if (
        event.target.files !== null &&
        event.target?.files?.length > 0
      ) {
        setTransactionData((prev) => ({
          ...prev,
          file: event.target.files[0]
        }))

      }
    },
    onDrop: (event) => {
      setTransactionData((prev) => ({
        ...prev,
        file: event.target.files[0]
      }))

    },
  }



  const Step1 = (
    <Card>
      <UserTableToolbar
        numSelected={selected.length}
        filterName={filterName}
        onFilterName={handleFilterByName}
      />

      <Scrollbar>
        <TableContainer sx={{ overflow: 'unset' }}>
          <Table sx={{ minWidth: 800 }}>
            <UserTableHead
              order={order}
              orderBy={orderBy}
              rowCount={userData.length}
              numSelected={selected.length}
              onRequestSort={handleSort}
              onSelectAllClick={handleSelectAllClick}
              headLabel={[
                { id: 'first_name', label: 'First Name' },
                { id: 'last_name', label: 'Last Name' },
                { id: 'email', label: 'Email' },
                { id: '' },
              ]}
            />
            <TableBody>
              {dataFiltered
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row) => (
                  <UserTableRow
                    key={row.id}
                    first_name={row.first_name}
                    last_name={row.last_name}
                    email={row.email}
                    image={row.image}
                    avatarUrl={row.image}
                    selected={selected.indexOf(row.id) !== -1}
                    handleClick={(event) => handleClick(event, row.id)}
                    type='users'
                  />
                ))}

              <TableEmptyRows
                height={77}
                emptyRows={emptyRows(page, rowsPerPage, userData.length)}
              />

              {notFound && <TableNoData query={filterName} />}
            </TableBody>
          </Table>
        </TableContainer>
      </Scrollbar>

      <TablePagination
        page={page}
        component="div"
        count={userData.length}
        rowsPerPage={rowsPerPage}
        onPageChange={handleChangePage}
        rowsPerPageOptions={[5, 10, 25]}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Card>

  );


  const Step2 = (
    <Stack spacing={3}>
      <FileUpload {...FileUploadProps} />
    </Stack>
  );

  const Step3 = (
    <Stack spacing={3}>

      <Collapse in={open}>
        <Alert
          severity={type}
          action={
            <IconButton
              aria-label="close"
              color="inherit"
              size="small"
              onClick={() => {
                setOpen(false);
              }}
            >
              <CloseIcon fontSize="inherit" />
            </IconButton>
          }
          sx={{ mb: 2 }}
        >
          {message}
        </Alert>
      </Collapse>

      <Grid container
        spacing={0}
        direction="column"
        alignItems="center"
        justify="center"
        style={{ minHeight: '100vh' }}>
        <LoadingButton
          disabled={disabled}
          onClick={handleClickSendTransaction}
          loading={loading}
          startIcon={<SendIcon />}
          loadingPosition="start"
          variant="contained"
        >
          <span>Send transaction</span>
        </LoadingButton>

        {/* <Button variant="contained" onClick={handleClickSendTransaction}>
          Send transaction
        </Button> */}
      </Grid>
    </Stack>
  )

  return (
    <Container>
      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
        {/* <Typography variant="h4">Users</Typography> */}

        {/* <Button variant="contained" color="inherit" startIcon={<Iconify icon="eva:plus-fill" />}>
          New User
        </Button> */}
      </Stack>
      <HorizontalLinearStepper id={selected} handleIsValidStep2={checkStep2Valid}
        handleIsValidStep3={checkStep3Valid} fileSelected={transactionData.file.length !== 0} />
      { }

      {
        (() => {
          if (isValidStep2 && !isValidStep3) {
            return Step2;
          }
          if (!isValidStep2 && isValidStep3) {
            return Step3;
          }
          return Step1;
        })()
      }
    </Container>
  );
}
