import React from 'react';
import moment from 'moment';

import { useAuth } from '../../contexts/AuthContext';
import { createDbRoomIfNotExists, getDbRoom } from '../../models/roomModel';
import GeneralRoomModal from '../dashboard/GeneralRoomModal';

const NewRoomModal = (props) => {
  const {
    isModalOpen,
    setIsModalOpen,
    formData,
    setFormData,
    initialFormData,
    loadRooms,
  } = props;
  const { currentUser } = useAuth();

  const generateCode = () => {
    // credits: https://stackoverflow.com/questions/1349404/generate-random-string-characters-in-javascript
    const CODE_LENGTH = 6;
    let code = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    const charactersLength = characters.length;
    for (let i = 0; i < CODE_LENGTH; i++) {
      code += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return code;
  };

  const convertFormDataToRoom = () => {
    const room = {
      name: formData.name, // TODO: validate
      code: generateCode(), // TODO: this might fail
      organisation: formData.organisation,
      reflectionIds: formData.reflectionIds, // TODO: validate, should need at least 1
      facilitatorIds: [currentUser.id],
      participantIds: [],
      isActive: true,
      isDeleted: false,
      date: moment(formData.date, 'YYYY-MM-DD').toDate(),
      createdAt: moment().toDate(),
      instructions: formData.instructions,
    };
    return room;
  };

  const createRoom = async (room) => {
    const id = await createDbRoomIfNotExists(room);
    const createdRoom = await getDbRoom(id);
    return createdRoom;
  };

  return (
    <GeneralRoomModal
      title={'Add a new class'}
      isModalOpen={isModalOpen}
      setIsModalOpen={setIsModalOpen}
      formData={formData}
      setFormData={setFormData}
      initialFormData={initialFormData}
      convertFormDataToRoom={convertFormDataToRoom}
      createOrEditRoom={createRoom}
      loadRooms={loadRooms}
    />
  );
};

export default NewRoomModal;
