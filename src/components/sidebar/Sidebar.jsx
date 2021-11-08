import './sidebar.css'
import { LineStyle, Add } from '@material-ui/icons';
import { useNavigate } from 'react-router';

const Sidebar = () => {
  // TODO: convert to SwipeableDrawer
  const navigate = useNavigate();

  return (
    <div className='sidebar'>
      <div className='sidebarWrapper'>
        <div className='sidebarMenu'>
          <ul className='sidebarList'>
            <li className='sidebarListItem' onClick={() => navigate('/')}>
              <LineStyle className='sidebarIcon'/>
              Home
            </li>
            <li className='sidebarListItem' onClick={() => navigate('/newroom')}>
              <Add className='sidebarIcon'/>
              New Room
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
