import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { KeyboardArrowLeft, KeyboardArrowRight } from '@mui/icons-material';
import { Modal, Typography } from '@mui/material';
import { useAuth } from '../contexts/AuthContext';
import { getDbRoom } from '../models/roomModel';
import { getDbReflectionResponses } from '../models/reflectionResponseModel';
import { ModalArrowBox, ModalContentBox, ModalBox, ReflectionCard } from '../components/styled/Dashboard/reflections';
import { Masonry } from '@mui/lab';

const ReflectionModal = (props) => {
  const { reflectionResponses, modalReflectionIndex, setModalReflectionIndex } = props;
  const reflection = modalReflectionIndex !== null ? reflectionResponses[modalReflectionIndex] : null;

  const isLeftmostReflection = reflectionResponses && modalReflectionIndex === 0;
  const isRightmostReflection = reflectionResponses && modalReflectionIndex === reflectionResponses.length - 1;

  const handleLeft = () => {
    if (isLeftmostReflection) return;
    setModalReflectionIndex(modalReflectionIndex - 1);
  };

  const handleRight = () => {
    if (isRightmostReflection) return;
    setModalReflectionIndex(modalReflectionIndex + 1);
  };

  const handleKeyDown = (event) => {
    if (event.keyCode === 37) { // left keypress
      handleLeft();
    } else if (event.keyCode === 39) { // right keypress
      handleRight();
    }
  };

  const LeftArrowBox = () => {
    return isLeftmostReflection
      ? null
      : (
        <ModalArrowBox>
          <KeyboardArrowLeft onClick={handleLeft} />
        </ModalArrowBox>
      );
  };

  const RightArrowBox = () => {
    return isRightmostReflection
      ? null
      : (
        <ModalArrowBox>
          <KeyboardArrowRight onClick={handleRight} />
        </ModalArrowBox>
      );
  };

  return (
    <Modal
      open={modalReflectionIndex !== null}
      onClose={() => setModalReflectionIndex(null)}
      aria-labelledby="reflection-modal"
      onKeyDown={handleKeyDown}
    >
      <ModalBox>
        <LeftArrowBox/>
        <ModalContentBox>
          <Typography>{ reflection ? reflection.answer : null }</Typography>
        </ModalContentBox>
        <RightArrowBox/>
      </ModalBox>
    </Modal>
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
      <Masonry columns={3} spacing={2}>
        {
          reflectionResponses
            ? reflectionResponses.map((reflectionResponse, index) =>
              <ReflectionCard
                variant='outlined'
                onClick={() => setModalReflectionIndex(index)}
                key={index}
              >
                {reflectionResponse.answer}
              </ReflectionCard>
            )
            : null
        }
      </Masonry>
      <ReflectionModal
        reflectionResponses={reflectionResponses}
        modalReflectionIndex={modalReflectionIndex}
        setModalReflectionIndex={setModalReflectionIndex}
      />
    </div>
  );
};

export default Reflections;
