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
    // Returns whether a participant has completed any ending of the current chapter after the given date
    // If date is falsy, don't check for ending being completed after the date
    function hasParticipantCompleted(participant, date) {
      const { characterId, chapterId } = REFLECTION_ID_MAP[reflectionId];
      const participantAchievement = participant.achievements?.find(
        (achievement) =>
          achievement.chapter === chapterId &&
          achievement.character === characterId &&
          achievement.endings.length > 0 &&
          (!date ||
            achievement.endings.find(
              (ending) => new Date(ending.completedAt) > date
            ))
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
    const completedParticipants = participants.filter((participant) =>
      hasParticipantCompleted(participant, dbRoom.createdAt)
    );
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
