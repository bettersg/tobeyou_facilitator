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

  function getCountsForGameChoice(gameChoice, allGlobalVariables) {
    const name = gameChoice.name;
    const data = allGlobalVariables
      .filter((globalVariables) => Object.keys(globalVariables).includes(name))
      .map((globalVariables) => globalVariables[name]);
    const values = gameChoice.values.map((value) => value.value);
    const counts = values.map((value) => {
      return data.filter((dataValue) => dataValue === value).length;
    });
    return counts;
  }

  function parseChartDatas(allGlobalVariables) {
    const chartDatas = gameChoices.map((gameChoice) => {
      return {
        title: gameChoice.description,
        labels: gameChoice.values.map((value) => value.description),
        data: getCountsForGameChoice(gameChoice, allGlobalVariables),
      };
    });
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
