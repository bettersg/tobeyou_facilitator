import React, { useCallback, useState } from 'react';
import QRCode from 'react-qr-code';
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
import {
  ModalBox,
  ModalRightSide,
  ModalStepConnector,
} from '../styled/Dashboard/generalRoomModal';
import { FlexBoxCenterColumn } from '../styled/general';
import { GeneralButton } from '../GeneralButton/GeneralButton';
import { GeneralTextField } from '../GeneralTextField/GeneralTextField';
import { CHARACTER_MAP } from '../../models/storyMap';

const SuccessPanel = ({ createdOrEditedRoom, handleCloseModal }) => {
  // TODO: refactor?
  const getGameUrl = (code) => {
    return `game.tobeyou.sg/room/${code}`;
  };

  const gameUrl = getGameUrl(createdOrEditedRoom.code);

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
  title,
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
            {title}
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

const GeneralRoomModal = (props) => {
  const {
    title,
    isModalOpen,
    setIsModalOpen,
    formData,
    setFormData,
    initialFormData,
    convertFormDataToRoom,
    createOrEditRoom,
    loadRooms,
  } = props;

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [createdOrEditedRoom, setCreatedOrEditedRoom] = useState(null);
  const [activeStep, setActiveStep] = useState(0); // note that we start from activeStep 0, not 1

  const handleSubmit = useCallback(
    async (event) => {
      event.preventDefault();
      setIsSubmitting(true);
      const room = convertFormDataToRoom();
      try {
        const createdOrEditedRoom = await createOrEditRoom(room);
        setCreatedOrEditedRoom(createdOrEditedRoom);
        await loadRooms();
        setFormData(initialFormData);
        setActiveStep(0);
      } catch (error) {
        alert(error); // TODO: error handling: how to deal with errors?
      } finally {
        setIsSubmitting(false);
      }
    },
    [formData, loadRooms]
  );

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
    setIsModalOpen(false);
    setActiveStep(0);
    setCreatedOrEditedRoom(null);
  };

  const steps = [
    <Step0
      key={0}
      title={title}
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
      open={isModalOpen}
      onClose={handleCloseModal}
      aria-labelledby='modal-modal-title'
    >
      <ModalBox>
        {createdOrEditedRoom ? (
          <SuccessPanel
            createdOrEditedRoom={createdOrEditedRoom}
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

export default GeneralRoomModal;
