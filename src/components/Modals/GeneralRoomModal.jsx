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
  Typography,
  Grid,
} from '@mui/material';
import {
  ContentCopy,
  MailOutline,
  WhatsApp,
  Check,
  CheckCircleOutline,
} from '@mui/icons-material';
import {
  ModalBox,
  ModalRightSide,
  ModalLeftSide,
  ModalStepConnector,
  StyledModalStepIcon,
  ModalBoxContentWrapper,
} from './StyledRoomModalComponents';
import {
  FlexBoxCenterColumn,
  FlexBoxCenterColumnAlign,
  FlexBoxSpaceEvenly,
} from '../styled/general';
import { GeneralButton } from '../GeneralButton/GeneralButton';
import { GeneralTextField } from '../GeneralTextField/GeneralTextField';
import { CharacterAvatar } from '../CharacterAvatar/CharacterAvatar';
import { useSnackbar } from '../../contexts/SnackbarContext';
import { getGameUrl } from '../../utils';
import { CHARACTER_ORDERING, REFLECTION_ID_MAP } from '../../models/storyMap';

function ModalStepIcon(props) {
  const { active, completed, className } = props;

  return (
    <StyledModalStepIcon
      ownerState={{ completed, active }}
      className={className}
    >
      {completed ? (
        <Check
          className='ModalStepIcon-completedIcon'
          sx={{ width: '20px', height: '20px' }}
        />
      ) : (
        <Box sx={{ fontSize: '12px', fontWeight: 700 }}>{props.icon}</Box>
      )}
    </StyledModalStepIcon>
  );
}

const SuccessPanel = ({ createdOrEditedRoom, handleCloseModal }) => {
  const gameUrl = getGameUrl(createdOrEditedRoom.code);

  return (
    <React.Fragment>
      <ModalLeftSide>
        <FlexBoxCenterColumnAlign
          sx={{
            backgroundColor: (theme) => theme.palette.lemongrass[20],
            borderRadius: '16px',
            width: '50%',
            p: '24px',
            mb: 3,
          }}
        >
          <CheckCircleOutline
            fontSize='large'
            sx={{ color: (theme) => theme.palette.lemongrass.dark1 }}
          />
          <Typography
            variant='h4'
            sx={{ color: (theme) => theme.palette.lemongrass.dark2 }}
          >
            Class set up!
          </Typography>
        </FlexBoxCenterColumnAlign>

        <Typography variant='h4' sx={{ mb: 2, fontWeight: 800 }}>
          Share with your class
        </Typography>
        <QRCode size={128} value={gameUrl} />
        <Typography m='12px 0 18px 0' variant={'h6'}>
          <Link target='_blank' color='inherit' href={gameUrl}>
            {gameUrl}
          </Link>
        </Typography>
        <Typography variant='body2' sx={{ mb: 1 }}>
          Share via:
        </Typography>
        <FlexBoxSpaceEvenly sx={{ width: '40%', mb: 2 }}>
          <WhatsApp
            fontSize='large'
            sx={{ color: (theme) => theme.palette.lapis[100] }}
          />
          <MailOutline
            fontSize='large'
            sx={{ color: (theme) => theme.palette.lapis[100] }}
          />
          <ContentCopy
            fontSize='large'
            sx={{ color: (theme) => theme.palette.lapis[100] }}
          />
        </FlexBoxSpaceEvenly>
        <GeneralButton variant='contained' onClick={handleCloseModal}>
          Return to dashboard
        </GeneralButton>
      </ModalLeftSide>
      <ModalRightSide>
        <Typography variant='h3' sx={{ fontWeight: 900, mb: 1 }}>
          What&apos;s next?
        </Typography>
        <Typography variant='body' sx={{ mb: 2 }}>
          Let&apos;s get you ready for class
        </Typography>
        <Link
          href='https://docs.google.com/presentation/d/1XsiCXh4mgDa4O470tRjYaThRSJ4lAQ7HjrPzrMhvRZc/edit?usp=sharing'
          target='_blank'
        >
          <FlexBoxCenterColumnAlign>
            <img src='/modal/lessonplan.png' style={{ width: '55%' }} />
          </FlexBoxCenterColumnAlign>
        </Link>
        <Typography variant='h5' sx={{ m: '20px 0' }}>
          Check out the Facilitation Resources
        </Typography>
        <Link href='https://game.tobeyou.sg/' target='_blank'>
          <FlexBoxCenterColumnAlign>
            <img src='/modal/playgame.png' style={{ width: '55%' }} />
          </FlexBoxCenterColumnAlign>
        </Link>
        <Typography variant='h5' sx={{ mt: 2 }}>
          Play the Game
        </Typography>
      </ModalRightSide>
    </React.Fragment>
  );
};

const ModalStepper = ({ steps, activeStep, ...props }) => {
  return (
    <Stepper
      activeStep={activeStep}
      sx={{ width: '160px' }}
      connector={<ModalStepConnector />}
      alternativeLabel
      {...props}
    >
      {steps.map((_, index) => {
        return (
          <Step key={index + 1}>
            <StepLabel StepIconComponent={ModalStepIcon}></StepLabel>
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
        <FlexBoxCenterColumnAlign>
          <Typography
            id='modal-modal-title'
            variant='h4'
            component='h2'
            sx={{ margin: '24px 0', textAlign: 'center' }}
          >
            {title}
          </Typography>
          <GeneralTextField
            name='organisation'
            label='Organisation:'
            defaultValue={formData.organisation}
            onChange={handleChange}
            disabled={isSubmitting}
          />
          <GeneralTextField
            name='name'
            label='Class:'
            defaultValue={formData.name}
            onChange={handleChange}
            disabled={isSubmitting}
          />
          <GeneralTextField
            name='date'
            label='Date:'
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
        </FlexBoxCenterColumnAlign>
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
          <Typography
            id='modal-modal-title'
            variant='h4'
            component='h2'
            sx={{ margin: '24px 0', textAlign: 'center' }}
          >
            Assign chapters
          </Typography>
          <Box
            sx={{
              maxHeight: '360px',
              paddingBottom: '10px',
              overflow: 'auto',
              borderBottom: (theme) => `1px solid ` + theme.palette.lapis[20],
            }}
          >
            {CHARACTER_ORDERING.map((character) => {
              const reflectionIds = Object.keys(REFLECTION_ID_MAP).filter(
                (reflectionId) =>
                  REFLECTION_ID_MAP[reflectionId].character === character
              );
              return (
                <FormGroup key={character}>
                  <Grid container>
                    <Grid
                      item
                      xs={2}
                      sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}
                    >
                      <CharacterAvatar avatarContent={character} />
                      <Typography variant='h5'>{character}</Typography>
                    </Grid>
                    <Grid
                      item
                      xs={10}
                      sx={{ display: 'flex', flexDirection: 'column' }}
                    >
                      {reflectionIds.map((reflectionId) => {
                        const chapterId =
                          REFLECTION_ID_MAP[reflectionId].chapterId;
                        const chapterTitle =
                          REFLECTION_ID_MAP[reflectionId].title;
                        return (
                          <FormControlLabel
                            key={reflectionId}
                            sx={{ margin: 'unset' }}
                            control={
                              <Checkbox
                                checked={formData.reflectionIds.some(
                                  (id) => id === parseInt(reflectionId)
                                )}
                                sx={{
                                  color: (theme) => theme.palette.lapis[40],
                                }}
                                onChange={toggleChapterCheckbox}
                                name={reflectionId}
                              />
                            }
                            label={`Chapter ${chapterId}: ${chapterTitle}`}
                          />
                        );
                      })}
                    </Grid>
                  </Grid>
                </FormGroup>
              );
            })}
          </Box>
        </FlexBoxCenterColumn>
        <FlexBoxCenterColumnAlign
          sx={{
            marginTop: '20px',
            color: (theme) => theme.palette.midnight[80],
          }}
        >
          <GeneralButton
            variant='contained'
            onClick={handleNextStep}
            disabled={isSubmitting}
            style={{ marginTop: 10, width: '250px' }}
          >
            Next: Message to Participants
          </GeneralButton>
          <GeneralButton
            variant='outlined'
            onClick={handleBackStep}
            disabled={isSubmitting}
            style={{ marginTop: 10, width: '250px' }}
          >
            Back
          </GeneralButton>
        </FlexBoxCenterColumnAlign>
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
      <ModalLeftSide>
        <Typography
          id='modal-modal-title'
          variant='h4'
          component='h2'
          sx={{ m: '18px 0 12px 0' }}
        >
          Message to participants
        </Typography>
        <Typography
          variant='body2'
          sx={{ mb: '10px', maxWidth: '60%', textAlign: 'center' }}
        >
          We&apos;ll show the instructions to your class when they play the game
        </Typography>
        <FlexBoxCenterColumn>
          <GeneralTextField
            multiline
            name='instructions'
            label='Message:'
            placeholder=''
            defaultValue={formData.instructions}
            minRows={3}
            maxRows={7}
            onChange={handleChange}
            disabled={isSubmitting}
            fullWidth
            sx={{ background: (theme) => theme.palette.grey[0] }}
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
            variant='outlined'
            onClick={handleBackStep}
            disabled={isSubmitting}
            style={{ marginTop: 10, width: '250px' }}
          >
            Back
          </GeneralButton>
        </FlexBoxCenterColumn>
      </ModalLeftSide>
      <ModalRightSide>
        <Typography
          variant='body2'
          sx={{
            width: '50%',
            textAlign: 'center',
            mb: 2,
            color: (theme) => theme.palette.lapis[100],
          }}
        >
          Sample of what players see when they enter the game
        </Typography>
        <img
          src='/modal/sampleview_students.png'
          style={{ maxHeight: '80%' }}
        />
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

  const { setSnackbar } = useSnackbar();
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
        // TODO: error handling: how to deal with errors?
        setSnackbar({
          message: error.message,
          open: true,
          type: 'error',
        });
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
      <ModalBox big={activeStep === 2 || createdOrEditedRoom}>
        {createdOrEditedRoom ? (
          <ModalBoxContentWrapper big>
            <ModalStepper
              steps={steps}
              activeStep={3}
              sx={{
                width: '160px',
                marginLeft: '16.5%',
                mb: 2,
              }}
            />
            <SuccessPanel
              createdOrEditedRoom={createdOrEditedRoom}
              handleCloseModal={handleCloseModal}
            />
          </ModalBoxContentWrapper>
        ) : (
          <ModalBoxContentWrapper big={activeStep === 2}>
            <ModalStepper
              steps={steps}
              activeStep={activeStep}
              sx={{
                width: '160px',
                marginLeft: activeStep === 2 ? '16.5%' : '',
              }}
            />
            {currentStep}
          </ModalBoxContentWrapper>
        )}
      </ModalBox>
    </Modal>
  );
};

export default GeneralRoomModal;
