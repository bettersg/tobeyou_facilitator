import { functions } from '../firebase';

export const getCoFacilitatorEmailsForRoom = functions.httpsCallable(
  'getCoFacilitatorEmailsForRoom'
);
export const getParticipantIdsToEmailsForRoom = functions.httpsCallable(
  'getParticipantIdsToEmailsForRoom'
);
export const inviteUserToBeCofacilitatorForRoom = functions.httpsCallable(
  'inviteUserToBeCofacilitatorForRoom'
);
