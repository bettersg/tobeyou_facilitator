import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { useAuth } from '../../contexts/AuthContext';
import { getDbRoom } from '../../models/roomModel';
import { getDbUser } from '../../models/userModel';
import REFLECTION_ID_MAP from '../../models/reflectionIdMap';

const CompletionRate = () => {
  const { roomId, reflectionId } = useParams();
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const [completionRate, setCompletionRate] = useState(null);

  async function getData() {
    function hasParticipantCompleted(participant) {
      const { characterId, chapterId } = REFLECTION_ID_MAP[reflectionId];
      const participantAchievement = participant.achievements?.find(
        (achievement) =>
          achievement.chapter === chapterId &&
          achievement.character === characterId
      );
      return !!participantAchievement;
    }

    const dbRoom = await getDbRoom(roomId);
    if (!dbRoom || !dbRoom.facilitatorIds.includes(currentUser.id)) {
      navigate('/'); // redirect if the room does not exist, or facilitator is unauthorised to access it
    }

    const participants = await Promise.all(
      dbRoom.participantIds.map((participantId) => getDbUser(participantId))
    );
    const completedParticipants = participants.filter(hasParticipantCompleted);
    // TODO: remove these console.logs
    console.log('IDs of participants who have completed the chapter: ');
    console.log(completedParticipants.map((x) => x.id));
    const participantsCount = participants.length;
    const completionCount = completedParticipants.length;
    setCompletionRate(((completionCount / participantsCount) * 100).toFixed(0));
  }

  useEffect(() => getData(), []);

  return (
    <div>
      <p>{completionRate ? `Completion rate: ${completionRate}%` : null}</p>
    </div>
  );
};

export default CompletionRate;
