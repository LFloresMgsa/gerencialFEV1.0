import React from 'react';
import { AiFillHome } from 'react-icons/ai';
import { IoIosPaper } from 'react-icons/io';
import { RiArrowDownSFill, RiArrowUpSFill } from 'react-icons/ri';

class SidebarDataClass {
    static getSidebarData(userRole) {
        const sidebarData = [
            {
                title: 'Inicio',
                path: '/gerencial',
                icon: <AiFillHome />,
                cName: '',
                className: 'MenuOption',
                iconClosed: '',
                iconOpened: '',
                role: 'Root, Administrator, User, All',
                tabOrder: 1,
                subNav: []
            },
            {
                title: 'Reportes',
                path: '/reportes',
                icon: <IoIosPaper />,
                cName: '',
                className: '',
                iconClosed: <RiArrowDownSFill />,
                iconOpened: <RiArrowUpSFill />,
                role: 'Root, Administrator ',
                tabOrder: 2,
                subNav: []
            },
            {
                title: 'Avances',
                path: '/avances',
                icon: <IoIosPaper />,
                cName: '',
                className: '',
                iconClosed: <RiArrowDownSFill />,
                iconOpened: <RiArrowUpSFill />,
                role: 'Administrator',
                tabOrder: 3,
                subNav: []
            },
        ];

        if (userRole && userRole !== 'All') {
            // Si el usuario está autenticado y su rol no es 'All', filtramos las opciones
            return sidebarData.filter(item => item.role.includes(userRole));
        }

        // Si el usuario no está autenticado o su rol es 'All', mostramos todas las opciones
        return sidebarData.filter(item => item.role.includes('All'));
    }
}

export default SidebarDataClass;
