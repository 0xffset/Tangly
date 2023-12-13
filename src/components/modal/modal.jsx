import * as React from 'react';
import PropTypes from 'prop-types';

import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Modal from '@mui/material/Modal';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 800,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,

};


export default function ModalFileDetails({
    sender,
    extension,
    content_type,
    upload_time,
    signature,
    onCloseModal,
    openModal
}) {

    const handleClose = () => {
        openModal = false
    };

    const onModalClose = (event) => {
        onCloseModal(event);
    }

    return (
        <Modal
            open={openModal}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <Box sx={style}>
                <IconButton style={{ 'float': 'right' }} onClick={e => onModalClose(e)} aria-label="close" size="large">
                    <CloseIcon />
                </IconButton>
                <Typography id="modal-modal-title" variant="h6" component="h2">
                    File details
                </Typography>
                <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                    Sender: <Chip label={sender} />
                </Typography>
                <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                    Extension: <Chip label={extension} />
                </Typography>
                <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                    Content Type: <Chip label={content_type}/>
                </Typography>
                <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                    Signature: <Chip label={signature}/>
                </Typography>
                <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                    Upload at: <Chip label={upload_time}/>
                </Typography>
            </Box>
        </Modal>

    );
}
ModalFileDetails.propTypes = {
    sender: PropTypes.string,
    extension: PropTypes.string,
    content_type: PropTypes.string,
    upload_time: PropTypes.any,
    signature: PropTypes.string,
    onCloseModal: PropTypes.func,
    openModal: PropTypes.bool
}