import { firestore } from '../firebase';

export const createRoomIfNotExists = async (roomId, roomName, chapterId, teacherId) => {
  const room = {
      roomId,
      roomName,
      chapterId,
      teacherIds: [teacherId],
  };
  try {
    // Ensure that roomId is unique
    const existingRooms = await firestore.collection('rooms').where('roomId', '==', roomId).get();
    if (existingRooms.docs.length > 0) {
      throw new Error('The room with the given code already exists.');
    }
    await firestore.collection('rooms').doc().set(room);
  } catch (err) {
    throw new Error(`Error at createRoom: ${err}`);
  }
};

export const getRooms = async (teacherId) => {
  try {
    const snapshot = await firestore
      .collection('rooms')
      .where('teacherIds', 'array-contains', teacherId)
      .get();
    const rooms = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
    return rooms;
  } catch (err) {
    throw new Error(`Error at getRooms: ${err}`);
  }
};

export const deleteRoom = async (id) => {
  // Note: this is the room's ID, not roomId
  try {
    await firestore.collection('rooms').doc(id).delete();
  } catch (err) {
    throw new Error(`Error at deleteRoom: ${err}`);
  }
}
