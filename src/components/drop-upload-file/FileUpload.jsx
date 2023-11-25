// eslint-disable-next-line import/no-extraneous-dependencies
import React from 'react'
import PropTypes from 'prop-types';

import { Box, Typography } from '@mui/material'
// eslint-disable-next-line import/no-unresolved
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

import FileUploadDefaultImage from './FileUploadDefaultImage.png'


export default function FileUpload({
    accept,
    imageButton = false,
    hoverLabel = 'Click or drag to upload file',
    dropLabel = 'Drop file here',
    width = '600px',
    height = '100px',
    backgroundColor = '#fff',
    image: {
        url = FileUploadDefaultImage,
        imageStyle = {
            height: 'inherit',
        },
    } = {},
    onChange,
    onDrop,
}) {
    const [imageUrl, setImageUrl] = React.useState(url)
    const [labelText, setLabelText] = React.useState(hoverLabel)
    const [isDragOver, setIsDragOver] = React.useState(false)
    const [isMouseOver, setIsMouseOver] = React.useState(false)
    const stopDefaults = (e) => {
        e.stopPropagation()
        e.preventDefault()
    }
    const dragEvents = {
        onMouseEnter: () => {
            setIsMouseOver(true)
        },
        onMouseLeave: () => {
            setIsMouseOver(false)
        },
        onDragEnter: (e) => {
            stopDefaults(e)
            setIsDragOver(true)
            setLabelText(dropLabel)
        },
        onDragLeave: (e) => {
            stopDefaults(e)
            setIsDragOver(false)
            setLabelText(hoverLabel)
        },
        onDragOver: stopDefaults,
        onDrop: (e) => {
            stopDefaults(e)
            setLabelText(hoverLabel)
            setIsDragOver(false)
            if (imageButton && e.dataTransfer.files[0]) {
                setImageUrl(URL.createObjectURL(e.dataTransfer.files[0]))
            }
            onDrop(e)
        },
    }

    const handleChange = (event) => {
        if (imageButton && event.target.files[0]) {
            setImageUrl(URL.createObjectURL(event.target.files[0]))
        }

        onChange(event)
    }

    return (
        <>
            <input
                onChange={handleChange}
                accept={accept}
               
                id="file-upload"
                type="file"
            />

            <label
                htmlFor="file-upload"
                {...dragEvents}

            >
                <Box
                    width={width}
                    height={height}
                    bgcolor={backgroundColor}

                >
                    {imageButton && (
                        <Box position="absolute" height={height} width={width}>
                            <img
                                alt="file upload"
                                src={imageUrl}
                                style={imageStyle}
                            />
                        </Box>
                    )}

                    {(!imageButton || isDragOver || isMouseOver) && (
                        <Box
                            height={height}
                            width={width}

                        >
                            <CloudUploadIcon fontSize="large" />
                            <Typography>{labelText}</Typography>
                        </Box>
                    )}
                </Box>
            </label>
        </>
    )
}


FileUpload.propTypes = {
    imageButton: PropTypes.bool,
    accept: PropTypes.string,
    hoverLabel: PropTypes.string,
    dropLabel: PropTypes.string,
    width: PropTypes.string,
    height: PropTypes.string,
    backgroundColor: PropTypes.string,
    image:  PropTypes.any,
    onChange: PropTypes.func,
    onDrop: PropTypes.func,
}