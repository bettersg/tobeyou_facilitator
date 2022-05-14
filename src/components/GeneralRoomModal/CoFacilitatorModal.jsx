import React, { useEffect, useState } from 'react';
import { Modal, Typography } from '@mui/material';
import { ModalBox } from '../GeneralRoomModal/StyledRoomModalComponents';
import { GeneralButton } from '../../components/GeneralButton/GeneralButton';
import { GeneralTextField } from '../../components/GeneralTextField/GeneralTextField';
import { getDbUser, getDbUserFromEmail } from '../../models/userModel';
import { updateDbRoom } from '../../models/roomModel';
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
    const email = formData.email;
    try {
      const coFacilitator = await getDbUserFromEmail(email);
      console.log(coFacilitator);
      if (coFacilitator === null) {
        // TODO: send email instead of throwing an error
        throw new Error(`No facilitator with the email '${email}' exists.`);
      } else if (!room.facilitatorIds.includes(coFacilitator.id)) {
        // TODO: send success email
        const newFacilitatorIds = [...room.facilitatorIds, coFacilitator.id];
        const newRoom = { ...room, facilitatorIds: newFacilitatorIds };
        await updateDbRoom(newRoom);
        await loadRooms();
        handleCloseModal();
        setSnackbar({
          message: `The facilitator with email ${email} has been added to the room.`,
          open: true,
          type: 'success',
        });
      } else {
        throw new Error(
          `The facilitator with email '${email}' is already in the room.`
        );
      }
    } catch (error) {
      setSnackbar({
        message: error.message,
        open: true,
        type: 'error',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const getData = async () => {
    if (!isModalOpen) return;
    const facilitators = await Promise.all(
      room.facilitatorIds.map((facilId) => getDbUser(facilId))
    );
    setFacilitatorEmails(facilitators.map((facil) => facil.email));
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
