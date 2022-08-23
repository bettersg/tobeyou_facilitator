import { firestore } from '../firebase';
import GLOBAL_VAR_MAP from '../models/globalVarMap';
import { REFLECTION_ID_MAP } from '../models/storyMap';

// Returns the parsed chart datas for game choices, based on global variables in saved states
export const getDbGameChoicesChartDatas = async (
  reflectionId,
  participantIds
) => {
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
        isImage: false,
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

  const chapter = GLOBAL_VAR_MAP.flatMap(
    (character) => character.chapters
  ).find((chapter) => chapter.reflectionId === reflectionId);
  const gameChoices = chapter.variables;
  const gameEndings = chapter.endings;
  const { characterId } = REFLECTION_ID_MAP[reflectionId];
  const savedStateIds = participantIds.map(
    (participantId) => `${participantId}-${characterId}`
  );
  // Have to perform N+1 query unfortunately, can potentially be a performance issue
  const dbSavedStates = await Promise.all(savedStateIds.map(getDbSavedState));
  const dbAllGlobalVariables = dbSavedStates
    .map((dbSavedState) => dbSavedState.globalVariables)
    .filter((globalVariables) => globalVariables !== undefined); // some saved states may not have globalVariables defined
  const parsedChartDatas = parseChartDatas(dbAllGlobalVariables);
  return parsedChartDatas;
};

export const getDbSavedState = async (id) => {
  try {
    const savedState = await firestore.collection('savedStates').doc(id).get();
    const savedStateData = { id: savedState.id, ...savedState.data() };
    return savedStateData;
  } catch (err) {
    throw new Error(`Error at getDbSavedState: ${err}`);
  }
};
