import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '../../contexts/AuthContext';
import { getDbSavedState } from '../../models/savedStateModel';
import { getDbRoom } from '../../models/roomModel';
import REFLECTION_ID_MAP from '../../models/reflectionIdMap';
import GLOBAL_VAR_MAP from '../../models/globalVarMap';
import { ChapterDetailsCard } from '../ChapterDetailsCard/ChapterDetailsCard';
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';

export const GameChoicesCarousel = ({
  deviceType = 'desktop',
  roomId,
  reflectionId,
}) => {
  // let { roomId, reflectionId } = useParams();
  reflectionId = parseInt(reflectionId);
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const [currentGameChoiceIndex, setCurrentGameChoiceIndex] = useState(0);
  const [allGlobalVariables, setAllGlobalVariables] = useState(null);

  const chapter = GLOBAL_VAR_MAP.flatMap(
    (character) => character.chapters
  ).find((chapter) => chapter.reflectionId === reflectionId);
  const gameChoices = chapter.variables;

  async function getData() {
    const dbRoom = await getDbRoom(roomId);
    if (
      !dbRoom ||
      !dbRoom.facilitatorIds.includes(currentUser.id) ||
      !dbRoom.reflectionIds.includes(reflectionId)
    ) {
      navigate('/'); // redirect if the room does not exist, or facilitator is unauthorised to access it
    }
    const { characterId } = REFLECTION_ID_MAP[reflectionId];
    const savedStateIds = dbRoom.participantIds.map(
      (participantId) => `${participantId}-${characterId}`
    );
    // Have to perform N+1 query unfortunately, can potentially be a performance issue
    const dbSavedStates = await Promise.all(savedStateIds.map(getDbSavedState));
    const dbAllGlobalVariables = dbSavedStates.map(
      (dbSavedState) => dbSavedState.globalVariables
    );
    setAllGlobalVariables(dbAllGlobalVariables);
  }

  const handleLeft = () => {
    setCurrentGameChoiceIndex(Math.max(0, currentGameChoiceIndex - 1));
  };

  const handleRight = () => {
    setCurrentGameChoiceIndex(
      Math.min(gameChoices.length - 1, currentGameChoiceIndex + 1)
    );
  };

  const handleKeyDown = (event) => {
    if (event.keyCode === 37) {
      handleLeft();
    } else if (event.keyCode === 39) {
      handleRight();
    }
  };

  useEffect(() => getData(), []);
  // useEventListener('keydown', handleKeyDown);

  const gameChoice = gameChoices[currentGameChoiceIndex];
  const userChoices = allGlobalVariables?.map(
    (globalVariables) => globalVariables[gameChoice.name]
  );

  const responsive = {
    desktop: {
      breakpoint: { max: 3000, min: 1024 },
      items: 2,
      paritialVisibilityGutter: 60,
    },
    tablet: {
      breakpoint: { max: 1024, min: 464 },
      items: 2,
      paritialVisibilityGutter: 50,
    },
    mobile: {
      breakpoint: { max: 464, min: 0 },
      items: 1,
      paritialVisibilityGutter: 30,
    },
  };

  return (
    <div onKeyDown={handleKeyDown}>
      <Carousel
        ssr
        partialVisbile
        deviceType={deviceType}
        itemClass='carousel-item-padding-40-px'
        responsive={responsive}
        autoPlay={false}
      >
        {gameChoices.map((choice, idx) => {
          return (
            <div key={idx} style={{ margin: '20px 0 20px 0' }}>
              <ChapterDetailsCard
                sx={{
                  backgroundColor: (theme) => theme.palette.lapis[0],
                }}
              >
                <h3>{choice.name}</h3>
                <p>{choice.description}</p>
              </ChapterDetailsCard>
              <ul>
                {gameChoice.values.map((value) => {
                  const numUsersMadeChoice = userChoices?.filter(
                    (userChoice) => userChoice === value.value
                  ).length;
                  return (
                    <li key={value.value}>
                      {value.description} - {numUsersMadeChoice} made this
                      choice
                    </li>
                  );
                })}
              </ul>
            </div>
          );
        })}
      </Carousel>

      <p>Note: use left/right arrow keys to scroll through game choices</p>
    </div>
  );
};
