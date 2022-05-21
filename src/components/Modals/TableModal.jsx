import React from 'react';
import {
  Modal,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  TableHead,
} from '@mui/material';
import { ArrowForwardIos } from '@mui/icons-material';
import { ModalBox } from './StyledRoomModalComponents';
import { FlexBoxSpaceBetween } from '../styled/general';
import { useNavigate } from 'react-router';

const TableModal = (props) => {
  let { isModalOpen, setIsModalOpen, label, headers, rows, links } = props;

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const navigate = useNavigate();

  const tableRowCells = (row, rowIdx) => {
    return row.map((cell, cellIdx) => {
      return (
        <TableCell key={`${rowIdx}-${cellIdx}`}>
          {links && cellIdx === row.length - 1 ? (
            <FlexBoxSpaceBetween>
              <Typography>{cell}</Typography>
              <ArrowForwardIos
                sx={{
                  color: (theme) => theme.palette.lapis[100],
                }}
              />
            </FlexBoxSpaceBetween>
          ) : (
            <Typography>{cell}</Typography>
          )}
        </TableCell>
      );
    });
  };

  return (
    <Modal
      open={isModalOpen}
      onClose={handleCloseModal}
      aria-labelledby='modal-modal-title'
    >
      <ModalBox sx={{ alignItems: 'unset' }}>
        <Typography variant='h3' sx={{ mb: 2, ml: 1 }}>
          {label}
        </Typography>
        <TableContainer sx={{ maxHeight: '80%' }}>
          <Table sx={{ minWidth: 650 }} aria-label='simple table'>
            <TableHead>
              <TableRow>
                {headers?.map((header) => (
                  <TableCell
                    key={header}
                    sx={{ color: (theme) => theme.palette.lapis[80] }}
                  >
                    <Typography>{header}</Typography>
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map((row, rowIdx) => {
                return links ? (
                  <TableRow
                    key={rowIdx}
                    sx={{ '&: hover': { cursor: 'pointer' } }}
                    onClick={() => navigate(links[rowIdx])}
                  >
                    {tableRowCells(row, rowIdx)}
                  </TableRow>
                ) : (
                  <TableRow key={rowIdx}>{tableRowCells(row, rowIdx)}</TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </ModalBox>
    </Modal>
  );
};

export default TableModal;
