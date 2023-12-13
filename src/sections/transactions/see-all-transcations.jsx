
import axios from 'axios';
// eslint-disable-next-line import/no-extraneous-dependencies
import dayjs from 'dayjs';
import * as React from 'react';

import { Chip } from '@mui/material';
// eslint-disable-next-line import/no-extraneous-dependencies
import { DataGrid } from '@mui/x-data-grid';
import { CallReceived } from '@mui/icons-material';
import CallMade from '@mui/icons-material/CallMade';

import { fTimestampToDate } from 'src/utils/format-time';

const columns = [
    { field: 'id', headerName: 'Index', width: 80 },
    { field: 'type', headerName: 'Type', width: 130, renderCell: (type) => type.value === "sender" ? <CallMade /> : <CallReceived /> },
    { field: 'timestamp', headerName: 'Upload At', width: 200, renderCell: (params) => `${dayjs(fTimestampToDate(params.row.timestamp)).format("MMM/DD/YYYY hh:mm:ss A")}` },
    {
        field: 'recipient_sender',
        headerName: 'Recipient/Sender',
        width: 300,
        renderCell: (params) => params.row.sender === undefined && params.row.recipient !== undefined ? `${params.row.recipient}` : `${params.row.sender}`
    },
    {
        field: 'file_name',
        headerName: 'File name',
        width: 160
    },
    {
        field: 'content_type',
        headerName: 'Content Type',
        width: 160
    },

    {
        field: 'extension',
        headerName: 'Extension',
        width: 160,
        renderCell: (param) => <Chip label={param.row.extension} />
    },

];


export default function SeeAllTransactionsView() {
    const [transcations, setTransactions] = React.useState([])
    React.useEffect(() => {
        const auth_token = localStorage.getItem("auth_token");
        const auth_token_type = localStorage.getItem("auth_token_type");
        const token = `${auth_token_type} ${auth_token}`;

        axios.get("http://localhost:8080/tangle/transcation/user/all", {
            headers: { Authorization: token }
        }).then((res) => {
            const values = []
            res.data.result.forEach(t => {
                values.push({
                    id: t.id,
                    type: t.type,
                    recipient: t.recipient,
                    sender: t.sender,
                    signature: t.signature,
                    timestamp: t.timestamp,
                    file_name: t.file_name,
                    content_type: t.content_type,
                    extension: t.extension
                })
            })
            setTransactions(values)
        })
            .catch((err) => {
                console.error(err)
            })
    }, [])
    return (
        <div style={{ height: 400, width: '100%' }}>
            <DataGrid
                rows={transcations}
                columns={columns}
                rowHeight={38}
                initialState={{
                    pagination: {
                        paginationModel: { page: 0, pageSize: 5 },
                    },
                }}
                pageSizeOptions={[5, 10]}
                checkboxSelection
            />
        </div>
    );
}