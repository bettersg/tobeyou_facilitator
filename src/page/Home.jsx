import React, { useEffect, useState } from 'react';
import moment from 'moment';
import { ToggleButton, Typography, Box, Grid, Paper } from '@mui/material';
import { useAuth } from '../contexts/AuthContext';
import {
  getDbRooms,
  softDeleteDbRoom,
  updateDbRoom,
} from '../models/roomModel';
import { getDbUser } from '../models/userModel';
import RoomCard from '../components/RoomCard/RoomCard';
import NewRoomModal from '../components/GeneralRoomModal/NewRoomModal';
import EditRoomModal from '../components/GeneralRoomModal/EditRoomModal';
import QrModal from '../components/GeneralRoomModal/QrModal';
import {
  FlexBoxSpaceBetween,
  FlexBoxCenter,
  FlexBoxCenterColumnAlign,
} from '../components/styled/general';
import { GeneralButton } from '../components/GeneralButton/GeneralButton';
import { HomeToggleButtonGroup } from '../components/HomeToggleButtonGroup/HomeToggleButtonGroup';
import { GeneralSelect } from '../components/GeneralSelect/GeneralSelect';

const formDataTemplate = {
  name: '',
  organisation: '',
  reflectionIds: [],
  date: moment().format('YYYY-MM-DD'),
  instructions: '',
};

const Home = () => {
  const { currentUser } = useAuth();
  const [rooms, setRooms] = useState(null);
  const [filters, setFilters] = useState(() => ['all']);
  const [isNewRoomModalOpen, setIsNewRoomModalOpen] = useState(false);
  const [isEditRoomModalOpen, setIsEditRoomModalOpen] = useState(false);
  const [newRoomFormData, setNewRoomFormData] = useState(formDataTemplate);
  const [editRoomFormData, setEditRoomFormData] = useState(formDataTemplate);
  // Used to reset the new room modal's form data after a room is created.
  // Its organisation field will be updated to match user.organisation once it's loaded.
  const [initialRoomFormData, setInitialRoomFormData] =
    useState(formDataTemplate);

  const [isQrModalOpen, setIsQrModalOpen] = useState(false);
  const [qrModalRoom, setQrModalRoom] = useState(null);

  // const [roomFilter, setRoomFilter] = useState({none: "Filter"})

  // const handleChange = (event) => {
  //   setRoomFilter({ [event.target.value]: filterOptions[event.target.value] });
  // };

  async function handleSoftDeleteRoom(id) {
    await softDeleteDbRoom(id);
    setRooms(rooms.filter((room) => room.id !== id));
  }

  async function handleNewRoom() {
    setNewRoomFormData(initialRoomFormData); // This is optional: wipes existing data when we re-open the new room modal
    setIsNewRoomModalOpen(true);
  }

  async function handleEditRoom(id) {
    const room = rooms.find((room) => room.id === id);
    setEditRoomFormData({
      name: room.name,
      organisation: room.organisation,
      reflectionIds: room.reflectionIds,
      date: moment(room.date).format('YYYY-MM-DD'),
      instructions: room.instructions,
      // Also pass in ID into formData, necessary for editing the room
      id: room.id,
    });
    setIsEditRoomModalOpen(true);
  }

  async function handleQrModal(id) {
    const room = rooms.find((room) => room.id === id);
    setQrModalRoom(room);
    setIsQrModalOpen(true);
  }

  async function toggleIsActiveRoom(id) {
    const room = rooms.find((x) => x.id === id);
    const restRooms = rooms.filter((x) => x.id !== id);
    room.isActive = !room.isActive;
    const newRooms = [...restRooms, room];
    await updateDbRoom(room);
    setRooms(newRooms);
  }

  function handleFilters(event, newFilters) {
    setFilters(newFilters);
  }

  const loadRooms = async () => {
    const facilitatorId = currentUser.id;
    const rooms = await getDbRooms(facilitatorId);
    setRooms(rooms);
  };

  const loadUserOrganisation = async () => {
    const dbUser = await getDbUser(currentUser.id);
    // Set the new room's organisation to be user's organisation by default
    setNewRoomFormData({
      ...newRoomFormData,
      organisation: dbUser.organisation,
    });
    setInitialRoomFormData({
      ...initialRoomFormData,
      organisation: dbUser.organisation,
    });
  };

  useEffect(loadRooms, []);
  useEffect(loadUserOrganisation, []);

  const AddClassButton = () => {
    return (
      <GeneralButton
        variant='special'
        onClick={handleNewRoom}
        sx={{ maxWidth: '360px' }}
      >
        Add a class
      </GeneralButton>
    );
  };

  const Rooms = () => {
    if (rooms === null) {
      return '';
    } else if (rooms.length === 0) {
      return (
        <FlexBoxCenterColumnAlign mt={'200px'}>
          <Typography variant='h4' mb={2}>
            No classes yet
          </Typography>
          <Typography mb={2}>Get started by starting a class!</Typography>
          <AddClassButton />
        </FlexBoxCenterColumnAlign>
      );
    } else {
      const filteredRooms = rooms
        .filter((room) => {
          if (filters === 'upcoming') {
            return moment(room.date) - moment() > 0;
          } else if (filters === 'active') {
            return room.isActive;
          } else if (filters === 'archived') {
            return !room.isActive;
          }
          return true;
        })
        .filter((room) => !room.isDeleted);
      filteredRooms.sort((x, y) => x.date - y.date);
      return (
        <Grid container spacing={2}>
          {filteredRooms.map((room) => (
            <Grid item key={room.id} xs={4}>
              <RoomCard
                room={room}
                toggleIsActive={() => toggleIsActiveRoom(room.id)}
                handleSoftDelete={() => handleSoftDeleteRoom(room.id)}
                handleQrModal={() => handleQrModal(room.id)}
                roomStatus={room.isActive}
                handleEdit={() => handleEditRoom(room.id)}
              />
            </Grid>
          ))}
        </Grid>
      );
    }
  };

  return (
    <Box sx={{ height: '100%' }}>
      <Paper
        sx={{ position: 'absolute', left: 0, right: 0, padding: '20px 68px' }}
      >
        <FlexBoxSpaceBetween>
          <Box>
            <Typography variant='h4' sx={{ marginBottom: '12px' }}>
              Your classes
            </Typography>
            <FlexBoxCenter>
              <HomeToggleButtonGroup
                color='primary'
                value={filters}
                exclusive
                onChange={handleFilters}
                aria-label='room filters'
              >
                <ToggleButton value='all' aria-label='all'>
                  ALL
                </ToggleButton>
                <ToggleButton value='upcoming' aria-label='upcoming'>
                  UPCOMING
                </ToggleButton>
                <ToggleButton value='active' aria-label='active'>
                  ACTIVE
                </ToggleButton>
                <ToggleButton value='archived' aria-label='archived'>
                  ARCHIVED
                </ToggleButton>
              </HomeToggleButtonGroup>
              {/* <GeneralSelect
                  name="filter"
                  value={roomFilter.key}
                  onChange={handleChange}
                  variant="filled"
                  label={null}
                >
                  {Object.keys(filterOptions).map((filterValue, idx) => {
                    return (
                      <MenuItem key={filterValue} value={filterValue}>{filterOptions[filterValue]}</MenuItem>
                    )
                  })}
                </GeneralSelect> */}
            </FlexBoxCenter>
          </Box>
          <AddClassButton />
        </FlexBoxSpaceBetween>
      </Paper>
      <Box
        sx={{
          padding: '68px',
          paddingTop: '140px',
          background: (theme) => theme.palette.lapis[10],
          height: 'calc(100vh - 120px)',
        }}
      >
        <Box>
          <Rooms />
        </Box>
        <NewRoomModal
          isModalOpen={isNewRoomModalOpen}
          setIsModalOpen={setIsNewRoomModalOpen}
          formData={newRoomFormData}
          setFormData={setNewRoomFormData}
          initialFormData={initialRoomFormData}
          loadRooms={loadRooms}
        />
        <EditRoomModal
          isModalOpen={isEditRoomModalOpen}
          setIsModalOpen={setIsEditRoomModalOpen}
          formData={editRoomFormData}
          setFormData={setEditRoomFormData}
          initialFormData={initialRoomFormData}
          loadRooms={loadRooms}
        />
        <QrModal
          isModalOpen={isQrModalOpen}
          setIsModalOpen={setIsQrModalOpen}
          room={qrModalRoom}
        />
      </Box>
    </Box>
  );
};

export default Home;
