
import axios from 'axios';
import { useState, useEffect } from 'react';

import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import Stack from '@mui/material/Stack';
import Alert from '@mui/material/Alert';
import Collapse from '@mui/material/Collapse';
import Container from '@mui/material/Container';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import TablePagination from '@mui/material/TablePagination';
import { Button, TableBody, Typography, TableContainer } from '@mui/material';

import { fToNow, fTimestampToDate } from 'src/utils/format-time';

import Scrollbar from 'src/components/scrollbar';
import Iconify from 'src/components/iconify/iconify';

import TableNoData from '../table-no-data';
import UserTableRow from '../user-table-row';
import UserTableHead from '../user-table-head';
import TableEmptyRows from '../table-empty-rows';
import { emptyRows, getComparator, applyFilterSignature } from '../utils';
// ----------------------------------------------------------------------

export default function DecryptFileView() {
    const [selected, setSelected] = useState([]);
    const [filterFileExtension] = useState('');
    const [order, setOrder] = useState('asc');
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [page, setPage] = useState(0);
    const [filesData, setFilesData] = useState([]);
    const [orderBy, setOrderBy] = useState('file_extension');
    const [open, setOpen] = useState(false);
    const [message, setMessage] = useState('');
    const [type, setType] = useState('info');
    const [fileDecrypted, setFileDecrypted] = useState('');
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
            const newSelecteds = filesData.map((n) => n.name);
            setSelected(newSelecteds);
            return;
        }
        setSelected([]);
    };
    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };
    const handleChangeRowsPerPage = (event) => {
        setPage(0);
        setRowsPerPage(parseInt(event.target.value, 10));
    };



    const dataFiltered = applyFilterSignature({
        inputData: filesData,
        comparator: getComparator(order, orderBy),
        filterName: filterFileExtension,
    });

    const notFound = !dataFiltered.length && !!filterFileExtension;
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
        setSelected(newSelected);
    };

    // eslint-disable-next-line react/no-unstable-nested-components
    const AlertComponent = (openAlert, typeAlert, alertMessage) => (
        <Collapse in={openAlert}>
            <Alert
                severity={typeAlert}
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
                {alertMessage}
            </Alert>
        </Collapse>
    )

    const handleDecryptFile = () => {
        if (selected.length > 1) {
            setMessage("For the moment, just allow decrypt a file per request.")
            setOpen(true);
            setType("warning")
        }
        else if (selected.length === 0) {
            setMessage("You must select file to decrypt it.")
            setOpen(true);
            setType("warning")
        }
        else {
            const auth_token = localStorage.getItem("auth_token");
            const auth_token_type = localStorage.getItem("auth_token_type");
            const token = `${auth_token_type} ${auth_token}`;
            const data = {
                signature: selected[0]
            }
            axios.post(`${API_URL}tangle/transaction/decrypt?signature=${data.signature}`, data, {
                headers: { Authorization: token }
            })
                .then((res) => {

                    if (res.data.result.error) {
                        setMessage(res.data.detail === "error")
                        setOpen(true);
                        setType("error")
                    } else if (res.data.detail === "success") {

                        setFileDecrypted(res.data.result)
                        setMessage("Your file was decrpyted successfully!")
                        setOpen(true);
                        setType("success")
                    }

                })
        }
    }
    useEffect(() => {
        const auth_token = localStorage.getItem("auth_token");
        const auth_token_type = localStorage.getItem("auth_token_type");
        const token = `${auth_token_type} ${auth_token}`;
        axios.get(`${API_URL}tangle/transactions/peers`, {
            headers: { Authorization: token },
        })
            .then((res) => {
                setFilesData(res.data.result)
            })

    }, [API_URL])
    return (
        <Container>
            <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
                <Typography variant="h4">Files Encrypted</Typography>
                <Button onClick={handleDecryptFile} variant="contained" color="inherit" startIcon={<Iconify icon="mdi:decrypted" />}>
                    Decrypt
                </Button>
            </Stack>
            {AlertComponent(open, type, message)}
            {type === "success" ? <a href={fileDecrypted} target='_blank' rel='noopener noreferrer'
                download="Download file" >Download file</a> : ""}
            <Card>
                {/* <UserTableToolbar numSelected={selected.length}
                    filterName={filterFileExtension}
                    onFilterName={handleFilterByName}
                /> */}
                <Scrollbar>
                    <TableContainer sx={{ overflow: 'unset' }}>
                        <Table sx={{ minWidth: 800 }}>
                            <UserTableHead
                                order={order}
                                orderBy={orderBy}
                                rowCount={filesData.length}
                                numSelected={selected.length}
                                onRequestSort={handleSort}
                                onSelectAllClick={handleSelectAllClick}
                                headLabel={[
                                    { id: "file_extension", label: "File Extension" },
                                    { id: 'timestamp', label: "Timeago" },
                                    { id: 'signature', label: 'Signature' },
                                    { id: '' }

                                ]}
                            />

                            <TableBody>
                                {filesData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                    .map((row) => (
                                        <UserTableRow
                                            key={row.signature}
                                            first_name={row.file_extension}
                                            last_name={fToNow(fTimestampToDate(row.timestamp))}
                                            email={row.signature}
                                            index={row.index}
                                            selected={selected.indexOf(row.signature) !== -1}
                                            handleClick={(event) => handleClick(event, row.signature)}
                                        />
                                    ))}
                                <TableEmptyRows
                                    height={77}
                                    emptyRows={emptyRows(page, rowsPerPage, filesData.length)}
                                />
                                {notFound && <TableNoData query={filterFileExtension} />}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Scrollbar>
                <TablePagination
                    page={page}
                    component="div"
                    count={filesData.length}
                    rowsPerPage={rowsPerPage}
                    onPageChange={handleChangePage}
                    rowsPerPageOptions={[5, 10, 25]}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />

            </Card>
        </Container>
    )
}