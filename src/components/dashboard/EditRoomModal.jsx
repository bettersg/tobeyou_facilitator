import React from 'react';
import moment from 'moment';

import { getDbRoom, updateDbRoom } from '../../models/roomModel';
import GeneralRoomModal from '../dashboard/GeneralRoomModal';

const EditRoomModal = (props) => {
  const {
    isModalOpen,
    setIsModalOpen,
    formData,
    setFormData,
    initialFormData,
    loadRooms,
  } = props;

  const convertFormDataToRoom = () => {
    const room = {
      name: formData.name, // TODO: validate
      organisation: formData.organisation,
      reflectionIds: formData.reflectionIds, // TODO: validate, should need at least 1
      date: moment(formData.date, 'YYYY-MM-DD').toDate(),
      instructions: formData.instructions,
      id: formData.id, // necessary for editing the room
      // Omit other fields like `code`/`facilitatorIds`/`participantIds`, which are not changed
    };
    return room;
  };

  const editRoom = async (room) => {
    await updateDbRoom(room);
    const editedRoom = await getDbRoom(room.id);
    return editedRoom;
  };

  return (
    <GeneralRoomModal
      title={'Edit a class'}
      isModalOpen={isModalOpen}
      setIsModalOpen={setIsModalOpen}
      formData={formData}
      setFormData={setFormData}
      initialFormData={initialFormData}
      convertFormDataToRoom={convertFormDataToRoom}
      createOrEditRoom={editRoom}
      loadRooms={loadRooms}
    />
  );
};

export default EditRoomModal;
