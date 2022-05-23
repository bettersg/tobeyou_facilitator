import { useEffect, useRef } from 'react';
import { send } from '@emailjs/browser';

export const getGameUrl = (code) => {
  return `https://game.tobeyou.sg/room/${code}`;
};

// Hook. Source: https://usehooks.com/useEventListener/
export function useEventListener(eventName, handler, element = window) {
  // Create a ref that stores handler
  const savedHandler = useRef();

  // Update ref.current value if handler changes.
  // This allows our effect below to always get latest handler ...
  // ... without us needing to pass it in effect deps array ...
  // ... and potentially cause effect to re-run every render.
  useEffect(() => {
    savedHandler.current = handler;
  }, [handler]);

  useEffect(
    () => {
      // Make sure element supports addEventListener
      // On
      const isSupported = element && element.addEventListener;
      if (!isSupported) return;

      // Create event listener that calls handler function stored in ref
      const eventListener = (event) => savedHandler.current(event);

      // Add event listener
      element.addEventListener(eventName, eventListener);

      // Remove event listener on cleanup
      return () => {
        element.removeEventListener(eventName, eventListener);
      };
    },
    [eventName, element] // Re-run if eventName or element changes
  );
}

export function breakIntoLines(labels) {
  const maxCharCount = Math.round(1000 / labels.length / 16);
  const result = labels.map((label) => {
    let descriptionSplit = [];
    let end = maxCharCount;
    let start = 0;
    while (end < label.length) {
      let hasDash = false;
      if (label[end - 1] !== ' ' && label[end] !== ' ' && end < label.length) {
        hasDash = true;
      }
      descriptionSplit.push(label.slice(start, end) + `${hasDash ? '-' : ''}`);
      start = end;
      end = start + maxCharCount;
    }
    if (end > start) {
      descriptionSplit.push(label.slice(start, end));
    }
    return descriptionSplit;
  });

  return result;
}

export function sendFacilitatorEmail(roomCode, toEmail, message) {
  const templateParams = {
    room_code: roomCode,
    to_email: toEmail,
    message: message,
  };

  send(
    'service_q3gnqrp',
    'template_6oavgta',
    templateParams,
    'user_kmfKhjRSSwoovXNarQivp'
  );
}
