import React, { useCallback, useEffect, useState } from 'react';
import QRCode from 'react-qr-code';
import moment from 'moment';
import {
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  FormGroup,
  Link,
  Modal,
  Step,
  Stepper,
  StepLabel,
  TextField,
  Typography,
} from '@mui/material';
import { createDbRoomIfNotExists } from '../../models/roomModel';
import { getDbUser } from '../../models/userModel';
import { useAuth } from '../../contexts/AuthContext';
import {
  ModalBox,
  ModalRightSide,
  ModalStepConnector,
} from '../styled/Dashboard/newRoomModal';
import {
  FlexBoxCenterColumn,
} from "../styled/general";
import { GeneralButton } from "../components/GeneralButton";
import { GeneralTextField } from "../components/GeneralTextField";
import { CHARACTER_MAP } from "../../models/storyMap";

const initialFormData = {
  name: '',
  organisation: '',
  reflectionIds: [],
  date: moment().format('YYYY-MM-DD'),
  instructions: '',
};
const steps = ['Enter room details', 'Message for participants'];

const NewRoomModal = (props) => {
  const { isNewRoomModalOpen, setIsNewRoomModalOpen, loadRooms } = props;

  const { currentUser } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [createdRoom, setCreatedRoom] = useState(null);
  const [activeStep, setActiveStep] = useState(0); // note that we start from activeStep 0, not 1
  const [formData, setFormData] = useState(initialFormData);

  const generateCode = () => {
    // credits: https://stackoverflow.com/questions/1349404/generate-random-string-characters-in-javascript
    const CODE_LENGTH = 6;
    let code = '';
    const characters =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    for (let i = 0; i < CODE_LENGTH; i++) {
      code += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return code;
  };

  // TODO: refactor?
  const getGameUrl = (code) => {
    return `game.tobeyou.sg/room/${code}`;
  };

  const handleChange = (event) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value.trim(),
    });
  };

  const toggleChapterCheckbox = (event) => {
    setFormData(() => {
      const changedReflectionId = parseInt(event.target.name);
      const oldReflectionIds = formData.reflectionIds;
      const newReflectionIds = oldReflectionIds.some(
        (id) => id === changedReflectionId
      )
        ? oldReflectionIds.filter((id) => id !== changedReflectionId)
        : oldReflectionIds.concat([changedReflectionId]);
      return { ...formData, reflectionIds: newReflectionIds };
    });
  };

  const handleNextStep = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBackStep = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleCloseModal = () => {
    setIsNewRoomModalOpen(false);
    setCreatedRoom(null);
  };

  const handleSubmit = useCallback(
    async (event) => {
      event.preventDefault();
      setIsSubmitting(true);

      const name = formData.name; // TODO: validate
      const code = generateCode(); // TODO: this might fail
      const date = moment(formData.date, 'YYYY-MM-DD').toDate();
      const instructions = formData.instructions;
      const reflectionIds = formData.reflectionIds; // TODO: validate --- needs at least 1!
      const organisation = formData.organisation;
      const facilitatorIds = [currentUser.id];
      const participantIds = [];
      const isActive = true;

      const room = {
        name,
        code,
        organisation,
        reflectionIds,
        facilitatorIds,
        participantIds,
        isActive,
        date,
        instructions,
      };

      try {
        const newCreatedRoom = await createDbRoomIfNotExists(room);
        setCreatedRoom(newCreatedRoom);
        await loadRooms();
        setFormData(initialFormData);
        setActiveStep(0);
      } catch (error) {
        alert(error); // TODO: error handling: how to deal with errors?
      } finally {
        setIsSubmitting(false);
      }
    },
    [currentUser, formData, loadRooms]
  );

  const getUserOrganisation = async () => {
    const dbUser = await getDbUser(currentUser.id);
    initialFormData.organisation = dbUser.organisation;
    setFormData({ ...formData, organisation: dbUser.organisation }); // set the room's organisation to be user's organisation by default
  };

  useEffect(() => getUserOrganisation(), []);

  return (
    <Modal
      open={isNewRoomModalOpen}
      onClose={handleCloseModal}
      aria-labelledby='modal-modal-title'
    >
      <ModalBox>
        {createdRoom ? (
          <React.Fragment>
            <Typography variant='h6' component='h2'>
              Success! New room added!
            </Typography>
            <QRCode value={getGameUrl(createdRoom.code)} />
            <Typography>Class: {createdRoom.name}</Typography>
            <Typography>
              Reflection IDs: {JSON.stringify(createdRoom.reflectionIds)}
            </Typography>
            <Typography>
              All facilitator IDs: {createdRoom.facilitatorIds.join(', ')}
            </Typography>
            <Typography>Date: {JSON.stringify(createdRoom.date)}</Typography>
            <Typography>Code: {createdRoom.code}</Typography>
            <Typography>
              Link:{' '}
              <Link href={'https://' + getGameUrl(createdRoom.code)}>
                {getGameUrl(createdRoom.code)}
              </Link>
            </Typography>
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
            <Stepper
              activeStep={activeStep}
              sx={{ position: 'absolute', bottom: 20, width: '10%' }}
              connector={<ModalStepConnector />}
              alternativeLabel
            >
              {steps.map((label) => {
                return (
                  <Step key={label}>
                    <StepLabel />
                  </Step>
                );
              })}
            </Stepper>
            {activeStep === 0 ? (
              <React.Fragment>
                <div>
                  <form onSubmit={handleSubmit}>
                    <Box>
                      <FlexBoxCenterColumn sx={{ p: 10 }}>
                        <Typography
                          id='modal-modal-title'
                          variant='h5'
                          component='h2'
                        >
                          Add a new class / chapter
                        </Typography>
                        <Typography variant="h6">Organisation:</Typography>
                        <GeneralTextField
                          name="organisation"
                          variant="filled"
                          defaultValue={formData.organisation}
                          onChange={handleChange}
                          disabled={isSubmitting}
                        />
                        <Typography variant="h6">Class:</Typography>
                        <GeneralTextField
                          name="name"
                          variant="filled"
                          defaultValue={formData.name}
                          onChange={handleChange}
                          disabled={isSubmitting}
                        />
                        <Typography variant="h6">Date:</Typography>
                        <GeneralTextField
                          name="date"
                          variant="filled"
                          type="date"
                          defaultValue={formData.date}
                          onChange={handleChange}
                          disabled={isSubmitting}
                        />
                        <GeneralButton
                          variant='contained'
                          onClick={handleNextStep}
                          disabled={isSubmitting}
                          style={{ marginTop: 10, width: '250px' }}
                        >
                          Next
                        </GeneralButton>
                      </FlexBoxCenterColumn>
                      <ModalRightSide>
                        <Typography variant='h6'>
                          Character / Chapter:
                        </Typography>
                        {Object.keys(CHARACTER_MAP).map((character) => {
                          const chapterMap = CHARACTER_MAP[character];
                          return (
                            <FormGroup key={character}>
                              <Typography>{character}</Typography>
                              {Object.keys(chapterMap).map((reflectionId) => {
                                const chapterName = chapterMap[reflectionId];
                                return (
                                  <FormControlLabel
                                    key={reflectionId}
                                    control={
                                      <Checkbox
                                        checked={formData.reflectionIds.some(
                                          (id) => id === parseInt(reflectionId)
                                        )}
                                        onChange={toggleChapterCheckbox}
                                        name={reflectionId}
                                      />
                                    }
                                    label={chapterName}
                                  />
                                );
                              })}
                            </FormGroup>
                          );
                        })}
                      </ModalRightSide>
                    </Box>
                  </form>
                </div>
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
            )}
          </React.Fragment>
        )}
      </ModalBox>
    </Modal>
  );
};

export default NewRoomModal;
