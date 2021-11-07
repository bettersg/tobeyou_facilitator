import { firestore } from '../firebase';

export const createRoom = async (roomName, chapterId, teacherId) => {
  const room = {
      roomId: "abc123", // TODO: have to randomly generate this, and make sure it's unique
      roomName,
      chapterId,
      teacherIds: [teacherId],
  };
  try {
    await firestore.collection('rooms').doc().set(room);
  } catch (err) {
    throw new Error(`Error at createRoom: ${err}`);
  }
}
