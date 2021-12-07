import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { useAuth } from '../../contexts/AuthContext';
import { getDbRoom } from '../../models/roomModel';
import { getDbUser } from '../../models/userModel';

const CompletionRate = () => {
  const { roomId, reflectionId } = useParams();
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const [completionRate, setCompletionRate] = useState(null);

  const reflectionIdToCharacterChapterIdMap = {  // TODO: refactor?
    1: [2, 1],  // aman 1
    2: [1, 1],  // nadia 1
    3: [1, 2],  // nadia 2
    4: [1, 3],  // nadia 3
    5: [2, 2],  // aman 2
    6: [2, 3],  // aman 3
  };

  async function getData() {
    function hasParticipantCompleted(participant) {
      const [characterId, chapterId] = reflectionIdToCharacterChapterIdMap[reflectionId];
      const participantAchievement = participant.achievements?.find(achievement =>
        achievement.chapter === chapterId && achievement.character === characterId
      );
      return !!participantAchievement;
    }

    const dbRoom = await getDbRoom(roomId);
    if (!dbRoom || !dbRoom.facilitatorIds.includes(currentUser.id)) {
      navigate('/');  // redirect if the room does not exist, or facilitator is unauthorised to access it
    }

    const participants = await Promise.all(dbRoom.participantIds.map(participantId => getDbUser(participantId)));
    const participantsCount = participants.length;
    const completionCount = participants.filter(hasParticipantCompleted).length;
    setCompletionRate((completionCount / participantsCount * 100).toFixed(0));
  }

  useEffect(() => getData(), []);

  return (
    <div>
      <p>{ completionRate ? `Completion rate: ${completionRate}%` : null }</p>
    </div>
  );
};

export default CompletionRate;
