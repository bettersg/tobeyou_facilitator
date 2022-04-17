import React, { useCallback, useEffect, useState } from "react";
import moment from "moment";
import { ToggleButton, Typography, Box, Grid, Paper, MenuItem } from "@mui/material";
import { useAuth } from "../contexts/AuthContext";
import { deleteDbRoom, getDbRooms, updateDbRoom } from "../models/roomModel";
import RoomCard from "../components/RoomCard/RoomCard";
import NewRoomModal from "../components/dashboard/NewRoomModal";
import {
  FlexBoxSpaceBetween,
  FlexBoxCenter, 
  FlexBoxCenterColumnAlign, 
} from "../components/styled/general";
import { GeneralButton } from "../components/GeneralButton/GeneralButton";
import { HomeToggleButtonGroup } from "../components/HomeToggleButtonGroup/HomeToggleButtonGroup";
import { GeneralSelect } from "../components/GeneralSelect/GeneralSelect";

const Home = () => {
  const { currentUser } = useAuth();
  const [rooms, setRooms] = useState(null);
  const [filters, setFilters] = useState(() => ['all']);
  const [isNewRoomModalOpen, setIsNewRoomModalOpen] = useState(false);

  // const [roomFilter, setRoomFilter] = useState({none: "Filter"})
  

  // const handleChange = (event) => {
  //   setRoomFilter({ [event.target.value]: filterOptions[event.target.value] });
  // };

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
        variant='special'
        onClick={() => setIsNewRoomModalOpen(true)}
        sx={{maxWidth: "360px"}}
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
        <FlexBoxCenterColumnAlign mt={"200px"}>
          <Typography variant="h4" mb={2}>No classes yet</Typography>
          <Typography mb={2}>Get started by starting a class!</Typography>
          <AddClassButton/>
        </FlexBoxCenterColumnAlign>
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
                roomStatus={room.isActive}
              />
            </Grid>
          ))}
        </Grid>
      );
    }
  };

  return (
    <Box sx={{height: "100%"}}>
      <Paper sx={{position: "absolute", left: 0, right: 0, padding: "20px 68px"}}>
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
      <Box sx={{ padding: '68px', paddingTop: "140px", background: (theme) => theme.palette.lapis[10], height: "calc(100vh - 120px)" }}>
        <Box>
          <Rooms />
        </Box>
        <NewRoomModal
          isNewRoomModalOpen={isNewRoomModalOpen}
          setIsNewRoomModalOpen={setIsNewRoomModalOpen}
          loadRooms={loadRooms}
        />
      </Box>

    </Box>
  );
};

export default Home;
