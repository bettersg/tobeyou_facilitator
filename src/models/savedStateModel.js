import { firestore } from '../firebase';

export const getDbSavedState = async (id) => {
  try {
    const savedState = await firestore.collection('savedStates').doc(id).get();
    const savedStateData = { id: savedState.id, ...savedState.data() };
    return savedStateData;
  } catch (err) {
    throw new Error(`Error at getDbSavedState: ${err}`);
  }
};
