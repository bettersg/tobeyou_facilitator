import React, { useEffect, useState } from 'react';
import { Modal, Typography } from '@mui/material';
import { ModalBox } from './StyledRoomModalComponents';
import { GeneralButton } from '../GeneralButton/GeneralButton';
import { GeneralTextField } from '../GeneralTextField/GeneralTextField';
import { getDbUser, getDbUserFromEmail } from '../../models/userModel';
import { updateDbRoom } from '../../models/roomModel';
import { useAuth } from '../../contexts/AuthContext';
import { useSnackbar } from '../../contexts/SnackbarContext';
import { sendFacilitatorEmail } from '../../utils';

const CoFacilitatorModal = (props) => {
  const { isModalOpen, setIsModalOpen, room, loadRooms } = props;
  const { currentUser } = useAuth();
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
    const fromEmail = currentUser?.email || '<no-email>';
    try {
      const coFacilitator = await getDbUserFromEmail(email);
      if (coFacilitator === null) {
        // Failure (co-facilitator does not exist): send failure email
        const message = `
          You were invited by your colleague at ${fromEmail} to be a co-facilitator for the room ${room.code} for ToBeYou.sg.
          Unfortunately, you do not yet have an account in the game.
          Creating an account is free and easy -
          just go to https://game.tobeyou.sg and create an account,
          then let your colleague know the email address that you used to register so that they can add you again.
          Once they have added you, you can go to your facilitator dashboard to access the room.
        `;
        sendFacilitatorEmail(room.code, email, message);
        handleCloseModal();
        setSnackbar({
          message: `There is no account with email ${email}. We've sent them an email inviting them to sign up with us.`,
          open: true,
          type: 'warning',
        });
      } else if (!room.facilitatorIds.includes(coFacilitator.id)) {
        // Success (co-facilitator exists): add co-facilitator to room and send success email
        const newFacilitatorIds = [...room.facilitatorIds, coFacilitator.id];
        const newRoom = { ...room, facilitatorIds: newFacilitatorIds };
        await updateDbRoom(newRoom);
        await loadRooms();
        const message = `
          You have been added by your colleague at ${fromEmail} as a co-facilitator for room ${room.code} for ToBeYou.sg.
          The room should now be available in your facilitator dashboard.
        `;
        sendFacilitatorEmail(room.code, email, message);
        handleCloseModal();
        setSnackbar({
          message: `Success! We've sent an email to ${email} to notify them that they've been added to the room.`,
          open: true,
          type: 'success',
        });
      } else {
        // Failure (co-facilitator already in room)
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
