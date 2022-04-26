import React from 'react';
import QRCode from 'react-qr-code';
import { Box, Modal } from '@mui/material';
import { getGameUrl } from '../../utils';

const QrModal = (props) => {
  const { isModalOpen, setIsModalOpen, room } = props;
  const handleCloseModal = () => {
    setIsModalOpen(false);
  };
  const gameUrl = getGameUrl(room?.code);

  return (
    <Modal
      open={isModalOpen}
      onClose={handleCloseModal}
      aria-labelledby='qr-modal'
    >
      <Box>
        <QRCode value={gameUrl} />
      </Box>
    </Modal>
  );
};
export default QrModal;
