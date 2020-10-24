import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setAvatar, deleteAvatar } from '../reducers/userReducer';
import { notify } from '../reducers/notificationReducer';
import DeleteDialog from './DeleteDialog';
import generateBase64Encode from '../utils/genBase64Encode';
import AlertMessage from './AlertMessage';

import {
  Button,
  useMediaQuery,
  IconButton,
  Typography,
} from '@material-ui/core';
import { useAvatarFormStyles } from '../styles/muiStyles';
import { useTheme } from '@material-ui/core/styles';
import PublishIcon from '@material-ui/icons/Publish';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import CancelIcon from '@material-ui/icons/Cancel';
import FaceIcon from '@material-ui/icons/Face';

const UpdateAvatarForm = () => {
  const [avatarInput, setAvatarInput] = useState('');
  const [fileName, setFileName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const classes = useAvatarFormStyles();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('xs'));

  const handleFileInputChange = (e) => {
    const file = e.target.files[0];
    setFileName(file.name);
    generateBase64Encode(file, setAvatarInput, true);
  };

  const clearfileSelection = () => {
    setAvatarInput('');
    setFileName('');
  };

  const handleAvatarUpload = async () => {
    if (avatarInput === '') return setError('Select an image file first.');
    try {
      setIsLoading(true);
      await dispatch(setAvatar(avatarInput));
      setIsLoading(false);

      dispatch(notify('Successfully updated the avatar!', 'success'));
      setAvatarInput('');
      setFileName('');
    } catch (err) {
      setIsLoading(false);
      if (err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else {
        setError(err.message);
      }
    }
  };

  const handleRemoveAvatar = async () => {
    try {
      await dispatch(deleteAvatar());
      dispatch(notify('Removed avatar.', 'success'));
    } catch (err) {
      if (err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else {
        setError(err.message);
      }
    }
  };

  return (
    <div>
      <Typography color="secondary" variant="h4" className={classes.title}>
        {user.avatar.exists ? 'Update your avatar' : 'Add an avatar'}
      </Typography>
      {user.avatar.exists && (
        <div>
          <div className={classes.imagePreview}>
            <img
              alt={user.username + '-avatar'}
              src={user.avatar.imageLink}
              width={150}
            />
          </div>
          <div className={classes.currentAvatar}>
            <Typography
              variant="h6"
              color="secondary"
              className={classes.currentAvatarText}
            >
              Current Avatar
            </Typography>
            <DeleteDialog type="avatar" handleDelete={handleRemoveAvatar} />
          </div>
        </div>
      )}
      <div className={classes.imageBtnsWrapper}>
        <input
          type="file"
          id="image-upload"
          accept="image/*"
          hidden
          onChange={handleFileInputChange}
        />
        <Button
          component="label"
          htmlFor="image-upload"
          variant="outlined"
          color="primary"
          fullWidth
          startIcon={avatarInput ? <CheckCircleIcon /> : <PublishIcon />}
          size={isMobile ? 'small' : 'medium'}
          className={classes.selectBtn}
        >
          {avatarInput
            ? `${isMobile ? '' : 'Selected '}"${fileName}"`
            : `Select Image`}
        </Button>
        {avatarInput && (
          <IconButton
            onClick={clearfileSelection}
            color="secondary"
            size={isMobile ? 'small' : 'medium'}
            className={classes.clearSelectionBtn}
          >
            <CancelIcon />
          </IconButton>
        )}
      </div>
      {avatarInput && (
        <div className={classes.imagePreview}>
          <img alt={fileName} src={avatarInput} width={isMobile ? 250 : 350} />
        </div>
      )}
      <Button
        size={isMobile ? 'small' : 'large'}
        variant="contained"
        color="secondary"
        className={classes.submitButton}
        fullWidth
        startIcon={<FaceIcon />}
        onClick={handleAvatarUpload}
        disabled={isLoading}
      >
        {user.avatar.exists
          ? isLoading
            ? 'Updating'
            : 'Update avatar'
          : isLoading
          ? 'Adding'
          : 'Add avatar'}
      </Button>
      <AlertMessage
        error={error}
        severity="error"
        clearError={() => setError(null)}
      />
    </div>
  );
};

export default UpdateAvatarForm;
