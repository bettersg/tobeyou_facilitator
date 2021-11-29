import { firestore } from '../firebase';

export const createDbRoomIfNotExists = async (obj) => {
  // TODO: perform validation on room
  try {
    // Ensure that the room's code is unique
    const existingRooms = await firestore
      .collection('rooms')
      .where('code', '==', obj.code)
      .get();
    if (existingRooms.docs.length > 0) {
      throw new Error('The room with the given code already exists.');
    }
    await firestore.collection('rooms').doc().set(obj);
  } catch (err) {
    throw new Error(`Error at createDbRoomIfNotExists: ${err}`);
  }
};

/**
 * Gets all the rooms of a facilitator with user ID `facilitatorId`.
 */
export const getDbRooms = async (facilitatorId) => {
  try {
    const snapshot = await firestore
      .collection('rooms')
      .where('facilitatorIds', 'array-contains', facilitatorId)
      .get();
    const rooms = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
    return rooms;
  } catch (err) {
    throw new Error(`Error at getDbRooms: ${err}`);
  }
};

/**
 * Deletes the room with ID `id`.
 */
export const deleteDbRoom = async (id) => {
  try {
    await firestore.collection('rooms').doc(id).delete();
  } catch (err) {
    throw new Error(`Error at deleteDbRoom: ${err}`);
  }
}
