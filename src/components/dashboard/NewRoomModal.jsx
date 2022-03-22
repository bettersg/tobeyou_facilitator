import React, { useCallback, useEffect, useState } from 'react';
import QRCode from 'react-qr-code';
import moment from 'moment';
import {
  Box,
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
import { ContentCopy, MailOutline, WhatsApp } from '@mui/icons-material';
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

const SuccessPanel = ({ createdRoom, handleCloseModal }) => {
  // TODO: refactor?
  const getGameUrl = (code) => {
    return `game.tobeyou.sg/room/${code}`;
  };

  const gameUrl = getGameUrl(createdRoom.code);

  return (
    <React.Fragment>
      <Typography variant='h4'>Class set up!</Typography>
      <Typography>Share with your class</Typography>
      <QRCode value={gameUrl} />
      <Typography>
        <Link href={'https://' + gameUrl}>{gameUrl}</Link>
      </Typography>
      <Typography>Share via:</Typography>
      <WhatsApp />
      <MailOutline />
      <ContentCopy />
      <GeneralButton variant='contained' onClick={handleCloseModal}>
        Return to dashboard
      </GeneralButton>
      <ModalRightSide>
        <Typography variant='h4'>What's next?</Typography>
        <Typography variant='h6'>Let's get you ready for class</Typography>
        <Typography variant='h5'>Check out the Lesson Plan</Typography>
        <Typography variant='h5'>Play the game</Typography>
      </ModalRightSide>
    </React.Fragment>
  );
};

const ModalStepper = ({ steps, activeStep }) => {
  return (
    <Stepper
      activeStep={activeStep}
      sx={{ position: 'absolute', bottom: 20, width: '10%' }}
      connector={<ModalStepConnector />}
      alternativeLabel
    >
      {steps.map((_, index) => {
        return (
          <Step key={index}>
            <StepLabel />
          </Step>
        );
      })}
    </Stepper>
  );
};

const Step0 = ({
  formData,
  handleChange,
  handleSubmit,
  handleNextStep,
  isSubmitting,
}) => {
  return (
    <form onSubmit={handleSubmit}>
      <Box>
        <FlexBoxCenterColumn sx={{ p: 10 }}>
          <Typography id='modal-modal-title' variant='h4' component='h2'>
            Add a new class
          </Typography>
          <Typography variant='h6'>Organisation:</Typography>
          <GeneralTextField
            name='organisation'
            variant='filled'
            defaultValue={formData.organisation}
            onChange={handleChange}
            disabled={isSubmitting}
          />
          <Typography variant='h6'>Class:</Typography>
          <GeneralTextField
            name='name'
            variant='filled'
            defaultValue={formData.name}
            onChange={handleChange}
            disabled={isSubmitting}
          />
          <Typography variant='h6'>Date:</Typography>
          <GeneralTextField
            name='date'
            variant='filled'
            type='date'
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
            Next: Assign Chapters
          </GeneralButton>
        </FlexBoxCenterColumn>
      </Box>
    </form>
  );
};

const Step1 = ({
  formData,
  handleSubmit,
  handleNextStep,
  handleBackStep,
  toggleChapterCheckbox,
  isSubmitting,
}) => {
  return (
    <form onSubmit={handleSubmit}>
      <Box>
        <FlexBoxCenterColumn>
          <Typography id='modal-modal-title' variant='h4' component='h2'>
            Assign chapters
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
          <GeneralButton
            variant='contained'
            onClick={handleNextStep}
            disabled={isSubmitting}
            style={{ marginTop: 10, width: '250px' }}
          >
            Next: Message to Participants
          </GeneralButton>
          <GeneralButton
            variant='contained'
            onClick={handleBackStep}
            disabled={isSubmitting}
            style={{ marginTop: 10, width: '250px' }}
          >
            Back
          </GeneralButton>
        </FlexBoxCenterColumn>
      </Box>
    </form>
  );
};

const Step2 = ({
  formData,
  handleChange,
  handleSubmit,
  handleBackStep,
  isSubmitting,
}) => {
  return (
    <form onSubmit={handleSubmit}>
      <Typography id='modal-modal-title' variant='h4' component='h2'>
        Message to participants
      </Typography>
      <Typography variant='h6'>
        We'll show the instructions to your class when they play the game
      </Typography>
      <FlexBoxCenterColumn>
        <TextField
          style={{ width: 350 }}
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
        <GeneralButton
          variant='contained'
          onClick={handleSubmit}
          disabled={isSubmitting}
          style={{ marginTop: 10, width: '250px' }}
        >
          Confirm
        </GeneralButton>
        <GeneralButton
          variant='contained'
          onClick={handleBackStep}
          disabled={isSubmitting}
          style={{ marginTop: 10, width: '250px' }}
        >
          Back
        </GeneralButton>
      </FlexBoxCenterColumn>
      <ModalRightSide>
        <Typography variant='h6'>
          Sample of what players see when they enter the game
        </Typography>
      </ModalRightSide>
    </form>
  );
};

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
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    const charactersLength = characters.length;
    for (let i = 0; i < CODE_LENGTH; i++) {
      code += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return code;
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
      const createdAt = moment().toDate();

      const room = {
        name,
        code,
        organisation,
        reflectionIds,
        facilitatorIds,
        participantIds,
        isActive,
        date,
        createdAt,
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

  const steps = [
    <Step0
      key={0}
      formData={formData}
      handleChange={handleChange}
      handleSubmit={handleSubmit}
      handleNextStep={handleNextStep}
      isSubmitting={isSubmitting}
    />,
    <Step1
      key={1}
      formData={formData}
      handleSubmit={handleSubmit}
      handleNextStep={handleNextStep}
      handleBackStep={handleBackStep}
      toggleChapterCheckbox={toggleChapterCheckbox}
      isSubmitting={isSubmitting}
    />,
    <Step2
      key={2}
      formData={formData}
      handleChange={handleChange}
      handleSubmit={handleSubmit}
      handleBackStep={handleBackStep}
      isSubmitting={isSubmitting}
    />,
  ];

  const currentStep = steps[activeStep];

  return (
    <Modal
      open={isNewRoomModalOpen}
      onClose={handleCloseModal}
      aria-labelledby='modal-modal-title'
    >
      <ModalBox>
        {createdRoom ? (
          <SuccessPanel
            createdRoom={createdRoom}
            handleCloseModal={handleCloseModal}
          />
        ) : (
          <React.Fragment>
            <ModalStepper steps={steps} activeStep={activeStep} />
            {currentStep}
          </React.Fragment>
        )}
      </ModalBox>
    </Modal>
  );
};

export default NewRoomModal;
