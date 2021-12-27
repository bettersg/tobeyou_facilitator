import React, { useCallback, useEffect, useState } from 'react';
import QRCode from 'react-qr-code';
import moment from 'moment';
import { Box, Button, FormControl, InputLabel, Link, MenuItem, Modal, Select, Step, Stepper, StepLabel, TextField, Typography } from '@mui/material';
import { createDbRoomIfNotExists } from '../../models/roomModel';
import { getDbUser } from '../../models/userModel';
import { useAuth } from '../../contexts/AuthContext';

const newRoomModalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 800,
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
};

const initialFormData = {
  name: '',
  chapterId: null,
  date: moment().format('YYYY-MM-DD'),
  instructions: '',
}
const steps = ['Enter room details', 'Message for participants'];

const NewRoomModal = (props) => {
  const { isNewRoomModalOpen, setIsNewRoomModalOpen, loadRooms } = props;

  const { currentUser } = useAuth();
  const [user, setUser] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [createdRoom, setCreatedRoom] = useState(null);
  const [activeStep, setActiveStep] = useState(0);  // note that we start from activeStep 0, not 1
  const [formData, setFormData] = useState(initialFormData);
  const chapterIdMap = {
    1: 'Aman 1',
    2: 'Nadia 1',
    3: 'Nadia 2',
    4: 'Nadia 3',
  };

  const generateCode = () => {
    // credits: https://stackoverflow.com/questions/1349404/generate-random-string-characters-in-javascript
    const CODE_LENGTH = 6;
    let code = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    for (let i = 0; i < CODE_LENGTH; i++) {
      code += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return code;
  };

  // TODO: refactor?
  const getGameUrl = (code) => {
    return `game.tobeyou.sg/room/${code}`;
  }

  const handleChange = (event) => {
    setFormData({ ...formData, [event.target.name]: event.target.value.trim() });
  };

  const handleNextStep = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  }

  const handleBackStep = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  }

  const handleCloseModal = () => {
    setIsNewRoomModalOpen(false);
    setCreatedRoom(null);
  }

  const handleSubmit = useCallback(
    async (event) => {
      event.preventDefault();
      setIsSubmitting(true);

      const name = formData.name;  // TODO: validate
      const code = generateCode();  // TODO: this might fail
      const date = moment(formData.date, 'YYYY-MM-DD').toDate();
      const instructions = formData.instructions;
      const chapterId = parseInt(formData.chapterId);  // TODO: do we want to allow null for chapterId?
      const reflectionIds = [];  // TODO!
      const organisation = formData.organisation;
      const facilitatorIds = [currentUser.id];
      const participantIds = [];
      const isActive = true;

      const room = { name, code, organisation, chapterId, reflectionIds, facilitatorIds, participantIds, isActive, date, instructions };

      try {
        const newCreatedRoom = await createDbRoomIfNotExists(room);
        setCreatedRoom(newCreatedRoom);
        await loadRooms();
        setFormData(initialFormData);
        setActiveStep(0);
      } catch (error) {
        alert(error);  // TODO: error handling: how to deal with errors?
      } finally {
        setIsSubmitting(false);
      }
    },
    [currentUser, formData, loadRooms]
  );

  const getUser = async () => {
    const dbUser = await getDbUser(currentUser.id);
    setFormData({ ...formData, organisation: dbUser.organisation });  // set the room's organisation to be user's organisation by default
    setUser(dbUser);
  }

  useEffect(() => getUser(), []);

  return (
    <Modal
      open={isNewRoomModalOpen}
      onClose={handleCloseModal}
      aria-labelledby='modal-modal-title'
    >
      <Box sx={newRoomModalStyle}>
        {
          createdRoom ? (
            <React.Fragment>
              <Typography variant='h6' component='h2'>
                Success! New room added!
              </Typography>
              <QRCode value={getGameUrl(createdRoom.code)}/>
              <Typography>Class: {createdRoom.name}</Typography>
              <Typography>Chapter ID: {createdRoom.chapterId}</Typography>
              <Typography>All facilitator IDs: {createdRoom.facilitatorIds.join(', ')}</Typography>
              <Typography>Date: {JSON.stringify(createdRoom.date)}</Typography>
              <Typography>Code: {createdRoom.code}</Typography>
              <Typography>Link: <Link href={'https://' + getGameUrl(createdRoom.code)}>{ getGameUrl(createdRoom.code) }</Link></Typography>
              <Button
                variant='contained'
                color='primary'
                onClick={handleCloseModal}
                style={{ marginTop: 10 }}
              >
                Return to dashboard
              </Button>
            </React.Fragment>
          ) : (
            <React.Fragment>
              <Typography id='modal-modal-title' variant='h6' component='h2'>
                Add a new room
              </Typography>
              <Stepper activeStep={activeStep}>
                {steps.map((label) => {
                  return (
                    <Step key={label}>
                      <StepLabel>{label}</StepLabel>
                    </Step>
                  );
                })}
              </Stepper>
              {
                activeStep === 0 ? (
                  <React.Fragment>
                    <form onSubmit={handleSubmit}>
                      <Box style={{ display: 'flex', flexDirection: 'column' }}>
                        <TextField
                          name='name'
                          label='Room name'
                          variant='filled'
                          defaultValue={formData.name}
                          onChange={handleChange}
                          disabled={isSubmitting}
                        />
                        <FormControl variant='filled'>
                          <InputLabel id='chapter-label'>Chapter</InputLabel>
                          <Select
                            id='chapterId'
                            labelId='chapter-label'
                            name='chapterId'
                            label='Chapter'
                            variant='filled'
                            defaultValue={formData.chapterId}
                            onChange={handleChange}
                            disabled={isSubmitting}
                          >
                            {
                              Object.keys(chapterIdMap).map(chapterId => {
                                const chapterName = chapterIdMap[chapterId];
                                return <MenuItem key={chapterId} value={chapterId}>{chapterName}</MenuItem>;
                              })
                            }
                          </Select>
                        </FormControl>
                        <TextField
                          name='organisation'
                          label='Organisation'
                          variant='filled'
                          defaultValue={formData.organisation}
                          onChange={handleChange}
                          disabled={isSubmitting}
                        />
                        <TextField
                          name='date'
                          label='Date'
                          variant='filled'
                          type='date'
                          defaultValue={formData.date}
                          onChange={handleChange}
                          disabled={isSubmitting}
                        />
                        <Button
                          variant='contained'
                          color='primary'
                          onClick={handleNextStep}
                          disabled={isSubmitting}
                          style={{ marginTop: 10 }}
                        >
                          Next
                        </Button>
                      </Box>
                    </form>
                  </React.Fragment>
                ) : (
                  <React.Fragment>
                    <form onSubmit={handleSubmit}>
                      <Box style={{ display: 'flex', flexDirection: 'column' }}>
                        <TextField
                          multiline
                          name='instructions'
                          label='Instructions'
                          variant='filled'
                          defaultValue={formData.instructions}
                          minRows={3}
                          maxRows={7}
                          onChange={handleChange}
                          disabled={isSubmitting}
                        />
                        <Button
                          variant='contained'
                          color='primary'
                          onClick={handleBackStep}
                          disabled={isSubmitting}
                          style={{ marginTop: 10 }}
                        >
                          Back
                        </Button>
                        <Button
                          type='submit'
                          variant='contained'
                          color='primary'
                          onClick={handleSubmit}
                          disabled={isSubmitting}
                          style={{ marginTop: 10 }}
                        >
                          Submit
                        </Button>
                      </Box>
                    </form>
                  </React.Fragment>
                )
              }
            </React.Fragment>
          )
        }
      </Box>
    </Modal>
  );
}

export default NewRoomModal;
