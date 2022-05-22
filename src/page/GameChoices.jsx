import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { useAuth } from '../contexts/AuthContext';
import { getDbSavedState } from '../models/savedStateModel';
import { getDbRoomByCode } from '../models/roomModel';
import { REFLECTION_ID_MAP } from '../models/storyMap';
import GLOBAL_VAR_MAP from '../models/globalVarMap';
import ChartScreen from '../components/ChartScreen/ChartScreen';

const GameChoices = () => {
  let { roomCode, reflectionId, choiceIdx } = useParams();
  reflectionId = parseInt(reflectionId);
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const [chartDatas, setChartDatas] = useState(null);

  const chapter = GLOBAL_VAR_MAP.flatMap(
    (character) => character.chapters
  ).find((chapter) => chapter.reflectionId === reflectionId);
  const gameChoices = chapter.variables;
  const gameEndings = chapter.endings;

  function getCountsForVariables(variableName, values, allGlobalVariables) {
    const data = allGlobalVariables
      .filter((globalVariables) =>
        Object.keys(globalVariables).includes(variableName)
      )
      .map((globalVariables) => globalVariables[variableName]);
    const counts = values.map((value) => {
      return data.filter((dataValue) => dataValue === value).length;
    });
    return counts;
  }

  function parseChartDatas(allGlobalVariables) {
    const gameChoicesDatas = gameChoices.map((gameChoice) => {
      return {
        title: gameChoice.description,
        labels: gameChoice.values.map((value) => value.description),
        data: getCountsForVariables(
          gameChoice.name,
          gameChoice.values.map((value) => value.value),
          allGlobalVariables
        ),
      };
    });
    const gameEndingData = {
      title: 'Chapter ending',
      labels: gameEndings.map((ending) => ending.title),
      data: getCountsForVariables(
        gameEndings[0].name,
        gameEndings.map((ending) => ending.endingId),
        allGlobalVariables
      ),
    };
    const chartDatas = [...gameChoicesDatas, gameEndingData];
    return chartDatas;
  }

  async function getData() {
    const dbRoom = await getDbRoomByCode(roomCode);
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
    const parsedChartDatas = parseChartDatas(dbAllGlobalVariables);
    setChartDatas(parsedChartDatas);
  }

  useEffect(() => getData(), []);

  return (
    <ChartScreen
      type='gameChoices'
      chartDatas={chartDatas}
      initialIndex={choiceIdx}
    />
  );
};

export default GameChoices;
