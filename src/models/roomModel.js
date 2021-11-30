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
    const { id } = await firestore.collection('rooms').add(obj);
    const room = await firestore.collection('rooms').doc(id).get();
    return { id, ...room.data() };
  } catch (err) {
    throw new Error(`Error at createDbRoomIfNotExists: ${err}`);
  }
};

export const getDbRoom = async (id) => {
  try {
    const room = await firestore.collection('rooms').doc(id).get();
    if (!room.exists) return null;
    const roomData = { id: room.id, ...room.data() };
    return roomData;
  } catch (err) {
    throw new Error(`Error at getDbRoom: ${err}`);
  }
}

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

/**
 * Updates an existing room with a new room.
 */
export const updateDbRoom = async (obj) => {
  try {
    const newRoom = Object.assign({}, obj);
    delete newRoom.id;  // ID is already in doc ref, no need to store
    await firestore.collection('rooms').doc(obj.id).update(newRoom);
  } catch (err) {
    throw new Error(`Error at updateDbRoom: ${err}`);
  }
}
