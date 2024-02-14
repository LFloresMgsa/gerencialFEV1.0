import React from 'react';
import * as FaIcons from 'react-icons/fa';
import * as AiIcons from 'react-icons/ai';
import * as IoIcons from 'react-icons/io';
import * as RiIcons from 'react-icons/ri';
import LoginIcon from '@mui/icons-material/Login';
import LogoutIcon from '@mui/icons-material/Logout';


class SidebarDataClass {
    static getSidebarData() {
      return [
        {
          title: 'Inicio',
          path: '/gerencial',
          icon: <AiIcons.AiFillHome />,
          cName:'',
          className: 'MenuOption',
          iconClosed: '',
          iconOpened: '',
          role:' Root, Administrator, User, All',
          tabOrder:1,
          subNav: []
        },
        {
          title: 'Reportes',
          path: '/reportes',
          icon: <IoIcons.IoIosPaper />,
          cName:'',
          className: '',
          iconClosed: <RiIcons.RiArrowDownSFill />,
          iconOpened: <RiIcons.RiArrowUpSFill />,
          role:' Root, Administrator, User, All',
          tabOrder:2,
          subNav: []
        },
        {
            title: 'Avances',
            path: '/avances',
            icon: <IoIcons.IoIosPaper />,
            cName:'',
            className: '',
            iconClosed: <RiIcons.RiArrowDownSFill />,
            iconOpened: <RiIcons.RiArrowUpSFill />,
            role:' Administrator ',
            tabOrder:2,
            subNav: []
          },
      ];
    }
  }
  
  export default SidebarDataClass;