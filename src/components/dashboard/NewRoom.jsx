import React, { useCallback, useState } from 'react';
import { useNavigate } from 'react-router';
import { Box, Button, FormControl, InputLabel, MenuItem, Select, TextField } from '@material-ui/core';
import { createRoomIfNotExists } from '../../models/roomModel';
import { useAuth } from '../../contexts/AuthContext';

const NewRoom = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    room: '',
    chapter: null,
    code: '',
  });
  const chapterIdMap = {
    1: 'Aman 1',
    2: 'Nadia 1',
    3: 'Nadia 2',
    4: 'Nadia 3',
  };

  const generateCode = () => {
    // credits: https://stackoverflow.com/questions/1349404/generate-random-string-characters-in-javascript
    const CODE_LENGTH = 6;
    let code = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    for (let i=0; i<CODE_LENGTH; i++) {
      code += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    setFormData({ ...formData, code });
  };

  const handleChange = (event) => {
    setFormData({ ...formData, [event.target.name]: event.target.value.trim() });
  };

  const handleSubmit = useCallback(
    async (event) => {
      event.preventDefault();
      setIsLoading(true);

      // TODO: validate data
      const roomId = formData.code;
      const roomName = formData.room;
      const chapterId = parseInt(formData.chapter);
      const teacherId = currentUser.id;

      try {
        await createRoomIfNotExists(roomId, roomName, chapterId, teacherId);
        navigate('/');
      } catch (error) {
        alert(error);
      } finally {
        setIsLoading(false);
      }
    },
    [navigate, currentUser, formData]
  );

  return (
    <Box>
      <h1>Add a new active room</h1>
      <form onSubmit={handleSubmit}>
        <Box style={{ display: 'flex', flexDirection: 'column' }}>
          <TextField
            name='room'
            label='Room'
            variant='filled'
            onChange={handleChange}
            disabled={isLoading}
          />
          <FormControl variant='filled'>
            <InputLabel id='chapter-label'>Chapter</InputLabel>
            <Select
              id='chapter'
              labelId='chapter-label'
              name='chapter'
              label='Chapter'
              variant='filled'
              onChange={handleChange}
              disabled={isLoading}
            >
                {
                  Object.keys(chapterIdMap).map(chapterId => {
                    const chapterName = chapterIdMap[chapterId];
                    return <MenuItem value={chapterId}>{chapterName}</MenuItem>;
                  })
                }
            </Select>
          </FormControl>
          <Box style={{ display: 'flex', alignItems: 'stretch', justifyContent: 'space-around' }}>
            <TextField
              name='code'
              label='Code'
              variant='filled'
              onChange={handleChange}
              disabled={isLoading}
              value={formData.code}
              style={{ flex: 4 }}
            />
            <Button
              name='generate-code'
              variant='filled'
              onClick={generateCode}
              disabled={isLoading}
              style={{ flex: 1 }}
            >
              Generate Code
            </Button>
          </Box>
          <Button
            type='submit'
            variant='contained'
            color='primary'
            onClick={handleSubmit}
            disabled={isLoading}
            style={{ marginTop: 10 }}
          >
            Add
          </Button>
        </Box>
      </form>
    </Box>
  );
};

export default NewRoom;
