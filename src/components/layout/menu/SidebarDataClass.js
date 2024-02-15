import React from 'react';
import { AiFillHome } from 'react-icons/ai';
import { IoIosPaper } from 'react-icons/io';
import { RiArrowDownSFill, RiArrowUpSFill } from 'react-icons/ri';

class SidebarDataClass {
    static getSidebarData(userRole, empCode) {
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
                subNav: [

                    {
                        title: 'Movimientos por Usuario',
                        path: '/MovUsuario',
                        icon: <IoIosPaper />,
                        cName: 'sub-nav',
                        className: '',
                        iconClosed: <RiArrowDownSFill />,
                        iconOpened: <RiArrowUpSFill />,
                        role:' Administrator, User',
                        tabOrder:3,
                        subNav: []
                      },
                ]
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
                tabOrder: 4,
                subNav: []
            },
        ];

        if (userRole && userRole !== 'All') {
            // Si el usuario está autenticado y su rol no es 'All', filtramos las opciones según el rol
            return sidebarData.filter(item => item.role.includes(userRole));
        }

        // Si el usuario no está autenticado con Emp_cCodigo o su rol es 'All', mostramos todas las opciones
        if (!empCode) {
            return sidebarData.filter(item => item.role.includes('All'));
        }

        return [];
    }
}

export default SidebarDataClass;
