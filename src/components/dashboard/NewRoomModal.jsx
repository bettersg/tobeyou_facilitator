import React, { useCallback, useState } from 'react';
import moment from 'moment';
import { Box, Button, FormControl, InputLabel, MenuItem, Modal, Select, Step, Stepper, StepLabel, TextField, Typography } from '@material-ui/core';
import { createDbRoomIfNotExists } from '../../models/roomModel';
import { getDbUser, getDbUserFromEmail } from '../../models/userModel';
import { useAuth } from '../../contexts/AuthContext';

const newRoomModalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 800,
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
};

const steps = ['Add a new room', 'Message for participants'];

const NewRoomModal = (props) => {
  const { isNewRoomModalOpen, setIsNewRoomModalOpen, loadRooms } = props;

  const { currentUser } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    chapter: null,
    coFacilitatorEmails: '',
    date: moment().format('YYYY-MM-DD'),
    instructions: '',
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
    return code;
  };

  const handleChange = (event) => {
    setFormData({ ...formData, [event.target.name]: event.target.value.trim() });
  };

  const handleSubmit = useCallback(
    async (event) => {
      event.preventDefault();
      setIsLoading(true);
      const user = await getDbUser(currentUser.id);

      const name = formData.name;  // TODO: validate
      const code = generateCode();  // TODO: this might fail
      const date = formData.date;
      const instructions = formData.instructions;
      const chapterId = parseInt(formData.chapter);
      const organisation = user.organisation;
      const coFacilitatorEmails = formData.coFacilitatorEmails.split(',')
      // TODO: what if co-facilitator emails are wrong?
      const coFacilitators = await Promise.all(coFacilitatorEmails.map(email => getDbUserFromEmail(email)));
      const coFacilitatorIds = coFacilitators.map(user => user.id);
      const facilitatorIds = [currentUser.id, ...coFacilitatorIds];
      const isActive = true;

      const room = { name, code, organisation, chapterId, facilitatorIds, isActive, date, instructions };

      try {
        await createDbRoomIfNotExists(room);
        await loadRooms();
      } catch (error) {
        alert(error);  // TODO: how to deal with errors?
      } finally {
        setIsLoading(false);
      }
    },
    [currentUser, formData, loadRooms]
  );

  return (
    <Modal
      open={isNewRoomModalOpen}
      onClose={() => setIsNewRoomModalOpen(false)}
      aria-labelledby='modal-modal-title'
    >
      <Box sx={newRoomModalStyle}>
        <Typography id='modal-modal-title' variant="h6" component="h2">
          Add a new room
        </Typography>
        <form onSubmit={handleSubmit}>
          <Box style={{ display: 'flex', flexDirection: 'column' }}>
            <TextField
              name='name'
              label='Room name'
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
                      return <MenuItem key={chapterId} value={chapterId}>{chapterName}</MenuItem>;
                    })
                  }
              </Select>
            </FormControl>
            <TextField
              name='coFacilitatorEmails'
              label='Co-facilitator emails'
              variant='filled'
              onChange={handleChange}
              disabled={isLoading}
            />
            <TextField
              name='date'
              label='Date'
              variant='filled'
              type='date'
              defaultValue={formData.date}
              onChange={handleChange}
              disabled={isLoading}
            />
            <TextField
              multiline
              name='instructions'
              label='Instructions'
              variant='filled'
              minRows={3}
              maxRows={7}
              onChange={handleChange}
              disabled={isLoading}
            />
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
    </Modal>
  );
}

export default NewRoomModal;
