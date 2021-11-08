import React, { useCallback, useState } from 'react';
import { useNavigate } from 'react-router';
import { createRoomIfNotExists } from '../../models/roomModel';
import { useAuth } from '../../contexts/AuthContext';

const NewRoom = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const { currentUser } = useAuth();

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
    document.getElementById('code').value = code;
  };

  const handleCreate = useCallback(
    async (event) => {
      event.preventDefault();
      setIsLoading(true);

      const { room, chapter, code } = event.target.elements;
      const roomId = code.value;
      const roomName = room.value;
      const chapterId = parseInt(chapter.value);
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
    [navigate, currentUser]
  );

  return (
    <div>
      <h1>Add a new active room</h1>
      <form onSubmit={handleCreate}>
        <label>
          Room:
          <br/>
          <input name='room' type='text' placeholder='Enter room name here' disabled={isLoading} />
        </label>
        <br/>
        <label>
          Chapter:
          <br/>
          <select name='chapter' disabled={isLoading}>
            {
              Object.keys(chapterIdMap).map(chapterId => {
                const chapterName = chapterIdMap[chapterId];
                return <option key={chapterId} value={chapterId}>{chapterName}</option>;
              })
            }
          </select>
        </label>
        <br/>
        <label>
          Code:
          <br/>
          <input id='code' name='code' type='text' placeholder='Enter custom code here' disabled={isLoading} />
          <button name='generate-code' type='button' onClick={generateCode} disabled={isLoading}>Generate Code</button>
        </label>
        <br/>
        <button name='add' type='submit' disabled={isLoading}>Add</button>
      </form>
    </div>
  );
};

export default NewRoom;
