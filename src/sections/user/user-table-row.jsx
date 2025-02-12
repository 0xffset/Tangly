import axios from 'axios';
import { useState } from 'react';
import PropTypes from 'prop-types';

import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import Popover from '@mui/material/Popover';
import TableRow from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox';
import MenuItem from '@mui/material/MenuItem';
import TableCell from '@mui/material/TableCell';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';

import { fTimestampToDate } from 'src/utils/format-time';

import Iconify from 'src/components/iconify';
import ModalFileDetails from 'src/components/modal/modal';

// ----------------------------------------------------------------------

export default function UserTableRow({
  selected,
  name,
  avatarUrl,
  company,
  role,
  isVerified,
  status,
  handleClick,
  first_name,
  last_name,
  email,
  image,
  index,
  type
}) {
  const [open, setOpen] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [dataDetails, setDataDetails] = useState({
    'signature': '',
    'extension': '',
    'sender': '',
    'content_type': '',
    'upload_at': ''

  });
  const handleOpenMenu = (event) => {
    setOpen(event.currentTarget);
  };

  const handleSeeFileDetails = () => {
    const auth_token = localStorage.getItem("auth_token");
    const auth_token_type = localStorage.getItem("auth_token_type");
    const token = `${auth_token_type} ${auth_token}`;
    const API_URL = import.meta.env.VITE_ENVIRONMENT === "development" ? import.meta.env.VITE_SERVER_DEVELOPMENT : import.meta.env.VITE_SERVER_PRODUCTION

    const data = {
      index
    }
    axios.post(`${API_URL}tangle/transactions/file/details`, data, {
      headers: { Authorization: token }
    }).then((res) => {

      setDataDetails({
        signature: res.data.result.signature,
        extension: res.data.result.file_extension,
        sender: res.data.result.sender,
        content_type: res.data.result.content_type,
        upload_at: res.data.result.upload
      })
      setOpenModal(true)
    })
      .catch((err) => {
        console.error(err)
      })
    setOpen(null);
  }

  const handleCloseModal = () => {
    setOpenModal(false)
  }
  const handleCloseMenu = () => {
    setOpen(null);
  };

  return (
    <>
      <ModalFileDetails openModal={openModal} onCloseModal={handleCloseModal} sender={dataDetails.sender}
        extension={dataDetails.extension}
        content_type={dataDetails.content_type} signature={dataDetails.signature} upload_time={fTimestampToDate(dataDetails.upload_at).toDateString()}
      />
      <TableRow hover tabIndex={-1} role="checkbox" selected={selected}>
        <TableCell padding="checkbox">
          <Checkbox disableRipple checked={selected} onChange={handleClick} />
        </TableCell>

        <TableCell component="th" scope="row" padding="none">
          <Stack direction="row" alignItems="center" spacing={2}>
            <Avatar alt={`${first_name} ${last_name}`} src={image} />
            <Typography variant="subtitle2" noWrap>
              {first_name}
            </Typography>
          </Stack>
        </TableCell>

        <TableCell>{last_name}</TableCell>

        <TableCell>{email}</TableCell>


        {type !== "users" ? (
          <TableCell align="right">
            <IconButton onClick={handleOpenMenu}>
              <Iconify icon="eva:more-vertical-fill" />
            </IconButton>
          </TableCell>

          // eslint-disable-next-line react/jsx-no-useless-fragment
        ) : (<></>)}
      </TableRow>

      {type !== "users" ? (
        <Popover
          open={!!open}
          anchorEl={open}
          onClose={handleCloseMenu}
          anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
          transformOrigin={{ vertical: 'top', horizontal: 'right' }}
          PaperProps={{
            sx: { width: 140 },
          }}
        >
          <MenuItem onClick={handleSeeFileDetails}>
            <Iconify icon="eva:edit-fill" sx={{ mr: 2 }} />
            Details
          </MenuItem>
        </Popover>

        // eslint-disable-next-line react/jsx-no-useless-fragment
      ) : (<></>)}
    </>
  );
}

UserTableRow.propTypes = {
  first_name: PropTypes.any,
  last_name: PropTypes.any,
  email: PropTypes.any,
  image: PropTypes.any,
  avatarUrl: PropTypes.any,
  company: PropTypes.any,
  handleClick: PropTypes.func,
  isVerified: PropTypes.any,
  name: PropTypes.any,
  role: PropTypes.any,
  selected: PropTypes.any,
  status: PropTypes.string,
  index: PropTypes.any,
  type: PropTypes.string
};
