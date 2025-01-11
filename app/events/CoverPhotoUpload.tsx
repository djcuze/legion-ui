'use client';

import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import {styled} from "@mui/material";
import LoadingButton from "@mui/lab/LoadingButton";

const VisuallyHiddenInput = styled('input')({
    clip: 'rect(0 0 0 0)',
    clipPath: 'inset(50%)',
    height: 1,
    overflow: 'hidden',
    position: 'absolute',
    bottom: 0,
    left: 0,
    whiteSpace: 'nowrap',
    width: 1,
});

export default function CoverPhotoUpload({handleFileUpload, isLoading, hasExistingUpload}) {
    return (
        <LoadingButton
            component="label"
            role={undefined}
            size="small"
            loading={isLoading}
            disabled={isLoading}
            variant="contained"
            tabIndex={-1}
            startIcon={<CloudUploadIcon />}
        >
            {hasExistingUpload ? "Replace file" : "Upload file"}
            <VisuallyHiddenInput
                type="file"
                accept={"image/png, image/jpg, image/jpeg"}
                onChange={handleFileUpload}
            />
        </LoadingButton>
    );
}