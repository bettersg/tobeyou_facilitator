import { firestore } from '../firebase';

/**
 * Creates room if it does not exist, i.e. no duplicate `code` field.
 * Returns the `id` of the created room.
 */
export const createDbRoomIfNotExists = async (obj) => {
  // TODO: perform validation on room
  try {
    // Ensure that the room's code is unique
    const existingRooms = await firestore
      .collection('rooms')
      .where('code', '==', obj.code)
      .get();
    if (existingRooms.docs.length > 0) {
      throw new Error(
        'The room with the given code already exists. Please try again!'
      );
    }
    const { id } = await firestore.collection('rooms').add(obj);
    return id;
  } catch (err) {
    throw new Error(`Error at createDbRoomIfNotExists: ${err}`);
  }
};

// TODO: refactor
function parseDate(firestoreTimestamp) {
  return firestoreTimestamp?.toDate();
}

// TODO: refactor logic for parsing dates across getting functions
// TODO: refactor logic for { id: X.id, ...X.data() }
export const getDbRoom = async (id) => {
  try {
    const room = await firestore.collection('rooms').doc(id).get();
    if (!room.exists) return null;
    const roomData = { id: room.id, ...room.data() };
    roomData.date = parseDate(roomData.date);
    roomData.createdAt = parseDate(roomData.createdAt);
    return roomData;
  } catch (err) {
    throw new Error(`Error at getDbRoom: ${err}`);
  }
};

export const getDbRoomByCode = async (code) => {
  try {
    const snapshot = await firestore
      .collection('rooms')
      .where('code', '==', code)
      .get();
    const rooms = snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
    if (rooms.length === 0) {
      return null;
    }
    return rooms[0];
  } catch (err) {
    throw new Error(`Error at getDbRoomByCode: ${err}`);
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
    const rooms = snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
    for (const room of rooms) {
      room.date = parseDate(room.date);
      room.createdAt = parseDate(room.createdAt);
    }
    return rooms;
  } catch (err) {
    throw new Error(`Error at getDbRooms: ${err}`);
  }
};

/**
 * Soft deletes the room with ID `id`.
 */
export const softDeleteDbRoom = async (id) => {
  try {
    await firestore.collection('rooms').doc(id).update({ isDeleted: true });
  } catch (err) {
    throw new Error(`Error at deleteDbRoom: ${err}`);
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
};

/**
 * Updates an existing room by its ID. (Does not overwrite document)
 * Assumes that the ID field is already in the object.
 */
export const updateDbRoom = async (obj) => {
  try {
    const newRoom = Object.assign({}, obj);
    delete newRoom.id; // ID is already in doc ref, no need to store
    await firestore.collection('rooms').doc(obj.id).update(newRoom);
  } catch (err) {
    throw new Error(`Error at updateDbRoom: ${err}`);
  }
};

/**
 * Toggles the pinned status of a reflection in the room.
 * @param {string} roomCode - room's code
 * @param {string} reflectionResponseId - reflection response's ID. Note that this does NOT refer to `reflectionResponse.reflectionId`, which refers to a particular chapter instead.
 */
export const toggleDbRoomPinnedReflectionResponse = async (
  roomCode,
  reflectionResponseId
) => {
  try {
    const room = await getDbRoomByCode(roomCode);
    const pinnedRrIds = room.pinnedReflectionResponseIds || [];
    const newPinnedRrIds = pinnedRrIds.includes(reflectionResponseId)
      ? pinnedRrIds.filter((rrId) => rrId !== reflectionResponseId)
      : [...pinnedRrIds, reflectionResponseId];
    await firestore.collection('rooms').doc(room.id).update({
      pinnedReflectionResponseIds: newPinnedRrIds,
    });
  } catch (err) {
    throw new Error(`Error at toggleDbRoomPinnedReflectionResponse: ${err}`);
  }
};
