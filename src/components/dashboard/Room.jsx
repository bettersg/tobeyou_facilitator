import React, { useCallback, useEffect, useState } from 'react';
import QRCode from 'react-qr-code';
import { useNavigate, useParams } from 'react-router';
import { useAuth } from '../../contexts/AuthContext';
import { getDbRoom } from '../../models/roomModel';
import { getDbSavedStates } from '../../models/savedStateModel';
import { getDbQuizAnswers } from '../../models/quizAnswerModel';
import { getDbReflectionResponses } from '../../models/reflectionResponseModel';

const Room = () => {
  const { roomId } = useParams();
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const [room, setRoom] = useState(null);
  const [savedStates, setSavedStates] = useState(null);
  const [quizAnswers, setQuizAnswers] = useState(null);
  const [reflectionResponses, setReflectionResponses] = useState(null);

  // TODO: refactor this along with the other getGameUrl function into helpers
  const getGameUrl = (code) => {
    return `game.tobeyou.sg/room/${code}`;
  }

  const getRoom = useCallback(
    async () => {
      const dbRoom = await getDbRoom(roomId);
      if (!dbRoom || !dbRoom.facilitatorIds.includes(currentUser.id)) {
        navigate('/');  // redirect if the room does not exist, or facilitator is unauthorised to access it
      }
      setRoom(dbRoom);
    },
    [roomId, currentUser, navigate]
  );

  const getSavedStates = useCallback(
    async () => {
      const dbSavedStates = await getDbSavedStates(roomId);
      setSavedStates(dbSavedStates);
    },
    [roomId]
  );

  const getQuizAnswers = useCallback(
    async () => {
      const dbQuizAnswers = await getDbQuizAnswers(roomId);
      setQuizAnswers(dbQuizAnswers);
    },
    [roomId]
  );

  const getReflectionResponses = useCallback(
    async () => {
      const dbReflectionResponses = await getDbReflectionResponses(roomId);
      setReflectionResponses(dbReflectionResponses);
    },
    [roomId]
  );

  useEffect(getRoom, []);
  useEffect(getSavedStates, []);
  useEffect(getQuizAnswers, []);
  useEffect(getReflectionResponses, []);

  return (
    <div>
      <h3>Room</h3>
      {
        room
          ? (<div>
            <p>Name: {room.name}</p>
            <p>Code: {room.code}</p>
            <p>Instructions: {room.instructions}</p>
            <p>Number of participants: {room.participantIds.length}</p>
            <p>Date: {JSON.stringify(room.date)}</p>
            <p>All facilitator IDs: {JSON.stringify(room.facilitatorIds)}</p>
            <p>Chapter ID: {room.chapterId}</p>
            <p>Reflection IDs: {JSON.stringify(room.reflectionIds)}</p>
            <QRCode value={getGameUrl(room.code)}/>
          </div>)
          : null
      }
      <h3>Saved States</h3>
      <p>{JSON.stringify(savedStates)}</p>
      <h3>Quiz Answers</h3>
      <p>{JSON.stringify(quizAnswers)}</p>
      <h3>Reflection Responses</h3>
      <p>{JSON.stringify(reflectionResponses)}</p>
    </div>
  );
};

export default Room;