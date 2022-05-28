import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import {
  KeyboardArrowLeft,
  KeyboardArrowRight,
  KeyboardArrowDown,
  PushPin,
  PushPinOutlined,
} from '@mui/icons-material';
import { Modal, Typography, Box } from '@mui/material';
import { useAuth } from '../contexts/AuthContext';
import {
  getDbRoomByCode,
  toggleDbRoomPinnedReflectionResponse,
} from '../models/roomModel';
import { getDbReflectionResponses } from '../models/reflectionResponseModel';
import {
  ModalArrowBox,
  ModalContentBox,
  ModalImage,
  ModalBox,
  ReflectionCard,
  CardContentBox,
  ModalInnerBox,
  Background,
  TopSection,
  Header,
  Description,
} from '../components/styled/Dashboard/reflections';
import { Masonry } from '@mui/lab';
import MenuButtonwithIcon from '../components/MenuButtonwithIcon/MenuButtonwithIcon';

const ReflectionModal = (props) => {
  const { reflectionResponses, modalReflectionIndex, setModalReflectionIndex } =
    props;

  // const [modalReflectionResponses, setModalReflectionResponses] = useState(null);

  // const checkModalResponses = () => {
  //   setModalReflectionResponses(displayedReflectionResponses)
  // }

  // useEffect(checkModalResponses(), displayedReflectionResponses)

  const reflection =
    modalReflectionIndex !== null
      ? reflectionResponses[modalReflectionIndex]
      : null;

  const isLeftmostReflection =
    reflectionResponses && modalReflectionIndex === 0;
  const isRightmostReflection =
    reflectionResponses &&
    modalReflectionIndex === reflectionResponses.length - 1;

  const handleLeft = () => {
    if (isLeftmostReflection) return;
    setModalReflectionIndex(modalReflectionIndex - 1);
  };

  const handleRight = () => {
    if (isRightmostReflection) return;
    setModalReflectionIndex(modalReflectionIndex + 1);
  };

  const handleKeyDown = (event) => {
    if (event.keyCode === 37) {
      // left keypress
      handleLeft();
    } else if (event.keyCode === 39) {
      // right keypress
      handleRight();
    }
  };

  const LeftArrowBox = () => {
    return isLeftmostReflection ? null : (
      <ModalArrowBox>
        <KeyboardArrowLeft onClick={handleLeft} />
      </ModalArrowBox>
    );
  };

  const RightArrowBox = () => {
    return isRightmostReflection ? null : (
      <ModalArrowBox>
        <KeyboardArrowRight onClick={handleRight} />
      </ModalArrowBox>
    );
  };

  return (
    <Modal
      open={modalReflectionIndex !== null}
      onClose={() => setModalReflectionIndex(null)}
      aria-labelledby='reflection-modal'
      onKeyDown={handleKeyDown}
    >
      <ModalBox>
        <ModalInnerBox>
          <LeftArrowBox />
          <ModalContentBox>
            <Typography>{reflection?.answer}</Typography>
          </ModalContentBox>
          <RightArrowBox />
        </ModalInnerBox>
        <ModalImage>
          <img width='303px' src='/avatar/nadia_avatar_group.svg' />
        </ModalImage>
      </ModalBox>
    </Modal>
  );
};

const Reflections = () => {
  let { roomCode, reflectionId } = useParams();
  reflectionId = parseInt(reflectionId);
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const [currentView, setCurrentView] = useState(null);
  const [reflectionResponses, setReflectionResponses] = useState(null);
  const [displayedReflectionResponses, setDisplayedReflectionResponses] =
    useState(null);
  const [modalReflectionIndex, setModalReflectionIndex] = useState(null); // null means modal is inactive; an index means its reflection is displayed in the modal
  const [pinnedReflectionResponseIds, setPinnedReflectionResponseIds] =
    useState(null);

  const filterMenuItems = [
    {
      title: 'All',
    },
    {
      title: 'Pinned',
    },
    {
      title: 'Unpinned',
    },
  ];

  const handleRequest = (filter) => {
    setCurrentView(filter);
    if (filter === 'All') {
      setDisplayedReflectionResponses(reflectionResponses);
      // setDisplayedReflectionResponses(reflectionResponses)
    } else if (filter === 'Pinned') {
      setDisplayedReflectionResponses(
        reflectionResponses.filter((rr) =>
          pinnedReflectionResponseIds.includes(rr.id)
        )
      );
    } else if (filter === 'Unpinned') {
      setDisplayedReflectionResponses(
        reflectionResponses.filter(
          (rr) => !pinnedReflectionResponseIds.includes(rr.id)
        )
      );
    }
  };

  async function getData() {
    const dbRoom = await getDbRoomByCode(roomCode);
    if (
      !dbRoom ||
      !dbRoom.facilitatorIds.includes(currentUser.id) ||
      !dbRoom.reflectionIds.includes(reflectionId)
    ) {
      navigate('/'); // redirect if the room does not exist, or facilitator is unauthorised to access it
    }
    setPinnedReflectionResponseIds(dbRoom.pinnedReflectionResponseIds || []);
    const dbReflectionResponses = await getDbReflectionResponses(
      roomCode,
      reflectionId,
      true
    );
    // Filter for non-empty reflection responses
    const filteredDbReflectionResponses = dbReflectionResponses.filter(
      (rr) => rr.answer.length > 5
    );
    setReflectionResponses(filteredDbReflectionResponses);
  }

  function isReflectionResponsePinned(reflectionResponse) {
    return pinnedReflectionResponseIds.includes(reflectionResponse.id);
  }

  async function togglePinnedReflectionResponse(reflectionResponse) {
    toggleDbRoomPinnedReflectionResponse(roomCode, reflectionResponse.id);
    const newPinnedRrIds = pinnedReflectionResponseIds.includes(
      reflectionResponse.id
    )
      ? pinnedReflectionResponseIds.filter(
          (rrId) => rrId !== reflectionResponse.id
        )
      : [...pinnedReflectionResponseIds, reflectionResponse.id];
    setPinnedReflectionResponseIds(newPinnedRrIds);
  }

  useEffect(() => getData(), []);
  useEffect(() => handleRequest(currentView), [pinnedReflectionResponseIds]);

  return (
    <Background>
      <TopSection>
        <Box>
          <KeyboardArrowLeft
            fontSize='large'
            sx={{ cursor: 'pointer' }}
            onClick={() => navigate(-1)}
          />
          <Header>REFLECTIONS</Header>
          <Description>
            Do you have any reflections or similar stories to share after
            playing this chapter?
          </Description>
        </Box>
        <Box>
          <MenuButtonwithIcon
            ButtonText='Filter'
            Icon={<KeyboardArrowDown />}
            Items={filterMenuItems}
            handleRequest={handleRequest}
          />
        </Box>
      </TopSection>
      <Masonry columns={3} spacing={3}>
        {(displayedReflectionResponses ?? reflectionResponses ?? [])
          .sort((x, y) => {
            // Sort by pinned status, then by submitted time
            const isPinned =
              isReflectionResponsePinned(x) - isReflectionResponsePinned(y);
            if (isPinned !== 0) return -isPinned; // pinned reflections get a lower value
            return x.submittedAt - y.submittedAt;
          })
          .map((reflectionResponse, index) => {
            const toggleFunction = (e) => {
              e.stopPropagation();
              togglePinnedReflectionResponse(reflectionResponse);
            };
            return (
              <ReflectionCard
                variant='outlined'
                onClick={() => setModalReflectionIndex(index)}
                key={index}
              >
                <CardContentBox>
                  {reflectionResponse.answer}
                  {isReflectionResponsePinned(reflectionResponse) ? (
                    <PushPin
                      sx={{ transform: 'rotate(45deg)' }}
                      onClick={toggleFunction}
                    />
                  ) : (
                    <PushPinOutlined
                      sx={{ transform: 'rotate(45deg)' }}
                      onClick={toggleFunction}
                    />
                  )}
                </CardContentBox>
              </ReflectionCard>
            );
          })}
      </Masonry>
      <ReflectionModal
        reflectionResponses={
          displayedReflectionResponses ?? reflectionResponses
        }
        modalReflectionIndex={modalReflectionIndex}
        setModalReflectionIndex={setModalReflectionIndex}
      />
    </Background>
  );
};

export default Reflections;
