import React from 'react';
import QRCode from 'react-qr-code';
import { Link, Modal, Typography } from '@mui/material';
import { getGameUrl } from '../../utils';
import { ModalBox } from '../GeneralRoomModal/StyledRoomModalComponents';

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
      <ModalBox>
        <Typography variant='h4' sx={{ mb: 2, fontWeight: 800 }}>
          Share with your class
        </Typography>
        <QRCode size={256} value={gameUrl} />
        <Typography m='12px 0 18px 0' variant={'h6'}>
          <Link target='_blank' color='inherit' href={gameUrl}>
            {gameUrl}
          </Link>
        </Typography>
      </ModalBox>
    </Modal>
  );
};
export default QrModal;
