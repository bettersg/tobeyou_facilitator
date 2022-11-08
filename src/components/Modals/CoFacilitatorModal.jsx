import React, { useEffect, useState } from 'react';
import { Modal, Typography } from '@mui/material';
import { ModalBox } from './StyledRoomModalComponents';
import { GeneralButton } from '../GeneralButton/GeneralButton';
import { GeneralTextField } from '../GeneralTextField/GeneralTextField';
import {
  getCoFacilitatorEmailsForRoom,
  inviteUserToBeCofacilitatorForRoom,
} from '../../models/functions';
import { useSnackbar } from '../../contexts/SnackbarContext';

const CoFacilitatorModal = (props) => {
  const { isModalOpen, setIsModalOpen, room, loadRooms } = props;
  const { setSnackbar } = useSnackbar();

  const [formData, setFormData] = useState({ email: '' });
  const [facilitatorEmails, setFacilitatorEmails] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setFacilitatorEmails(null);
  };

  const handleChange = (event) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value.trim(),
    });
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    const toEmail = formData.email;
    const { success, message } = (
      await inviteUserToBeCofacilitatorForRoom({ roomId: room.id, toEmail })
    ).data;
    if (success) {
      await loadRooms();
      handleCloseModal();
      setSnackbar({
        message,
        open: true,
        type: 'success',
      });
    } else {
      setSnackbar({
        message,
        open: true,
        type: 'error',
      });
    }
    setIsSubmitting(false);
  };

  const getData = async () => {
    if (!isModalOpen) return;
    const facilEmails = (
      await getCoFacilitatorEmailsForRoom({ roomId: room.id })
    ).data;
    setFacilitatorEmails(facilEmails);
  };

  useEffect(() => getData(), [isModalOpen]);

  return (
    <Modal
      open={isModalOpen}
      onClose={handleCloseModal}
      aria-labelledby='qr-modal'
    >
      <ModalBox>
        <Typography variant='h4' sx={{ mb: 2, fontWeight: 800 }}>
          Facilitators
        </Typography>
        {facilitatorEmails?.map((facilEmail) => {
          return <Typography key={facilEmail}>{facilEmail}</Typography>;
        })}
        <Typography variant='h4' sx={{ m: 2 }}>
          Add a Co-Facilitator
        </Typography>
        <GeneralTextField
          name='email'
          type='email'
          placeholder='email@email.com'
          label='Email:'
          onChange={handleChange}
          disabled={isSubmitting}
        />
        <GeneralButton
          sx={{ width: 250 }}
          onClick={handleSubmit}
          disabled={isSubmitting}
        >
          Add
        </GeneralButton>
      </ModalBox>
    </Modal>
  );
};
export default CoFacilitatorModal;
