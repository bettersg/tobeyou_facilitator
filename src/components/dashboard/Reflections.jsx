import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { KeyboardArrowLeft, KeyboardArrowRight } from '@mui/icons-material';
import { Box, Card, Modal, Typography } from '@mui/material';
import { useAuth } from '../../contexts/AuthContext';
import { getDbRoom } from '../../models/roomModel';
import { getDbReflectionResponses } from '../../models/reflectionResponseModel';

const ReflectionModal = (props) => {
  const { reflectionResponses, modalReflectionIndex, setModalReflectionIndex } = props;
  const reflection = modalReflectionIndex !== null ? reflectionResponses[modalReflectionIndex] : null;

  const isLeftmostReflection = reflectionResponses && modalReflectionIndex === 0;
  const isRightmostReflection = reflectionResponses && modalReflectionIndex === reflectionResponses.length - 1;

  const handleLeft = () => {
    if (isLeftmostReflection) return;
    setModalReflectionIndex(modalReflectionIndex - 1);
  }

  const handleRight = () => {
    if (isRightmostReflection) return;
    setModalReflectionIndex(modalReflectionIndex + 1);
  }

  return (
    <Modal
      open={modalReflectionIndex !== null}
      onClose={() => setModalReflectionIndex(null)}
      aria-labelledby="reflection-modal"
    >
      <Box style={{ padding: 10 }}>
        { isLeftmostReflection ? null : <KeyboardArrowLeft onClick={handleLeft}/> }
        { isRightmostReflection ? null : <KeyboardArrowRight onClick={handleRight}/> }
        <Typography>{ reflection ? reflection.answer : null }</Typography>
      </Box>
    </Modal>
  );
};

const ReflectionCard = ({ reflectionResponse, onClick }) => {
  const { answer } = reflectionResponse;
  return (
    <Card
      variant='outlined'
      style={{ borderRadius: 10, marginTop: 10, padding: 10, cursor: 'pointer' }}
      onClick={onClick}
    >
      {answer}
    </Card>
  );
};

const Reflections = () => {
  const { roomId, reflectionId } = useParams();
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const [reflectionResponses, setReflectionResponses] = useState(null);
  const [modalReflectionIndex, setModalReflectionIndex] = useState(null);  // null means modal is inactive; an index means its reflection is displayed in the modal

  async function getData() {
    const dbRoom = await getDbRoom(roomId);
    if (!dbRoom || !dbRoom.facilitatorIds.includes(currentUser.id)) {
      navigate('/');  // redirect if the room does not exist, or facilitator is unauthorised to access it
    }

    const dbReflectionResponses = await getDbReflectionResponses(roomId, reflectionId, true);
    setReflectionResponses(dbReflectionResponses);
  }

  useEffect(() => getData(), []);

  return (
    <div>
      <KeyboardArrowLeft onClick={() => navigate(-1)}/>
      <h2>REFLECTIONS</h2>
      <h4>Do you have any reflections or similar stories to share after playing this chapter?</h4>
      {
        reflectionResponses
          ? reflectionResponses.map((reflection, index) =>
            <ReflectionCard
              reflectionResponse={reflection}
              onClick={() => { console.log(`clicking ${index}`); setModalReflectionIndex(index) } }
            />
          )
          : null
      }
      <ReflectionModal
        reflectionResponses={reflectionResponses}
        modalReflectionIndex={modalReflectionIndex}
        setModalReflectionIndex={setModalReflectionIndex}
      />
    </div>
  );
};

export default Reflections;
