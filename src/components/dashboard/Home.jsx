import React, { useCallback, useEffect, useState } from "react";
import moment from "moment";
import { ToggleButton, Typography, Box, Grid } from "@mui/material";
import { Add } from "@mui/icons-material";
import { useAuth } from "../../contexts/AuthContext";
import { deleteDbRoom, getDbRooms, updateDbRoom } from "../../models/roomModel";
import RoomCard from "./RoomCard";
import NewRoomModal from "./NewRoomModal";
import {
  FlexBoxSpaceBetween,
} from "../styled/general";
import { GeneralButton } from "../components/GeneralButton/GeneralButton";
import { HomeToggleButtonGroup } from "../styled/Dashboard/home";

const Home = () => {
  const { currentUser } = useAuth();
  const [rooms, setRooms] = useState(null);
  const [filters, setFilters] = useState(() => ['all']);
  const [isNewRoomModalOpen, setIsNewRoomModalOpen] = useState(false);

  async function handleDeleteRoom(id) {
    await deleteDbRoom(id);
    setRooms(rooms.filter((room) => room.id !== id));
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

  const loadRooms = useCallback(async () => {
    const facilitatorId = currentUser.id;
    const rooms = await getDbRooms(facilitatorId);
    setRooms(rooms);
  }, [currentUser]);

  useEffect(loadRooms, []);

  const AddClassButton = () => {
    return (
      <GeneralButton
        variant='contained'
        onClick={() => setIsNewRoomModalOpen(true)}
      >
        <Add />
        Add new class / chapter access
      </GeneralButton>
    );
  };

  const Rooms = () => {
    if (rooms === null) {
      return '';
    } else if (rooms.length === 0) {
      return (
        <Box>
          <Typography>No classes yet</Typography>
          <Typography>Get started by creating a class!</Typography>
          <AddClassButton />
        </Box>
      );
    } else {
      const filteredRooms = rooms.filter((room) => {
        if (filters === 'upcoming') {
          return moment(room.date) - moment() > 0;
        } else if (filters === 'active') {
          return room.isActive;
        } else if (filters === 'archived') {
          return !room.isActive;
        }
        return true;
      });
      return (
        <Grid container spacing={2}>
          {filteredRooms.map((room) => (
            <Grid item key={room.id} xs={4}>
              <RoomCard
                room={room}
                toggleIsActive={() => toggleIsActiveRoom(room.id)}
                handleDelete={() => handleDeleteRoom(room.id)}
              />
            </Grid>
          ))}
        </Grid>
      );
    }
  };

  return (
    <Box sx={{ padding: '12px' }}>
      <FlexBoxSpaceBetween>
        <Box>
          <Typography variant='h5' sx={{ marginBottom: '12px' }}>
            Class / Chapter Access
          </Typography>
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
        </Box>
        <AddClassButton />
      </FlexBoxSpaceBetween>
      <Box>
        <Rooms />
      </Box>
      <NewRoomModal
        isNewRoomModalOpen={isNewRoomModalOpen}
        setIsNewRoomModalOpen={setIsNewRoomModalOpen}
        loadRooms={loadRooms}
      />
    </Box>
  );
};

export default Home;
