import React, { useState, useEffect } from 'react';
import { TreeView } from '@mui/x-tree-view/TreeView';
import { TreeItem } from '@mui/x-tree-view/TreeItem';
import Typography from '@mui/material/Typography';
import FolderOpen from '@mui/icons-material/FolderOpenOutlined';
import Description from '@mui/icons-material/DescriptionOutlined';
import SidebarDataClass from './SidebarDataClass.js';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { withRouter } from 'react-router-dom';
import Cookies from 'universal-cookie';
import { storage } from '../../../storage.js'
const cookies = new Cookies();

const TreeComponent = ({ history }) => {
  const [expandedNodes, setExpandedNodes] = useState([]);
  const [sidebarData, setSidebarData] = useState([]);

  useEffect(() => {
    const initialExpandedNodes = JSON.parse(localStorage.getItem('expandedNod')) || [];
    setExpandedNodes(initialExpandedNodes);

    const rolDesencriptado = cookies.get('_r');
    let userRole;
    //console.log(rolDesencriptado);
    try {
      userRole = atob(rolDesencriptado);
      //console.log(userRole);
    } catch (error) {
      //console.error('Error al decodificar el valor de la cookie:', error);
      // Manejar el error adecuadamente, como establecer un valor predeterminado
    }


    // Verificar si el usuario está autenticado con Emp_cCodigo y tiene un rol asignado
    if (userRole) {
      // Obtener los datos de la barra lateral según el rol del usuario
      const sidebarData = SidebarDataClass.getSidebarData(userRole);
      // console.log('SidebarData:', sidebarData);

      // Ordenar los datos de la barra lateral por el orden de la pestaña
      const sortedSidebarData = sidebarData.sort((a, b) => (a.tabOrder > b.tabOrder ? 1 : -1));

      setSidebarData(sortedSidebarData);
    } else {
      // Si el usuario no está autenticado con Emp_cCodigo o no tiene un rol asignado, mostramos solo la opción "Inicio"
      const homeItem = [
        {
          title: 'Inicio',
          path: '/gerencial',
          icon: null,
          cName: '',
          className: 'MenuOption',
          iconClosed: '',
          iconOpened: '',
          role: '',
          tabOrder: 1,
          subNav: []
        }
      ];
      setSidebarData(homeItem);
    }
  }, []);

  const MyTreeItem = ({ label, icon: Icon, fontSize, ...props }) => {
    return (
      <TreeItem
        label={
          <Typography style={{ fontSize, display: 'flex', alignItems: 'center', whiteSpace: 'nowrap' }}>
            {Icon && <Icon style={{ marginRight: '5px' }} />}
            {label}
          </Typography>
        }
        {...props}
        style={{
          marginTop: '1px',
        }}
      />
    );
  };

  const renderTree = (nodes) => (
    <MyTreeItem
      key={nodes.title}
      nodeId={nodes.title}
      label={nodes.title.toLowerCase()}
      icon={nodes.subNav && nodes.subNav.length > 0 ? FolderOpen : FolderOpen}
      fontSize="14px"
      onClick={() => {
        if (!nodes.subNav || nodes.subNav.length === 0) {
          handleNodeClick(nodes.path);
        }
      }}
    >
      {Array.isArray(nodes.subNav)
        ? nodes.subNav.map((node) => (
            <MyTreeItem
              key={node.title}
              nodeId={node.title}
              label={node.title.toLowerCase()}
              icon={node.subNav && node.subNav.length > 0 ? FolderOpen : Description}
              fontSize="14px"
              onClick={() => {
                if (!node.subNav || node.subNav.length === 0) {
                  handleNodeClick(node.path);
                }
              }}
            >
              {Array.isArray(node.subNav) ? node.subNav.map((childNode) => renderTree(childNode)) : null}
            </MyTreeItem>
          ))
        : null}
    </MyTreeItem>
  );
  

  const handleNodeClick = (path) => {
    history.push(path);
  };

  const handleNodeToggle = (event, nodeIds) => {
    setExpandedNodes(nodeIds);
  };

  return (
    <div style={{ marginTop: '60px' }}>
      <TreeView
        expanded={expandedNodes}
        onNodeToggle={handleNodeToggle}
        defaultCollapseIcon={<ExpandMoreIcon />}
        defaultExpandIcon={<ChevronRightIcon />}
      >
        {sidebarData.map(renderTree)}
      </TreeView>
    </div>
  );
};

export default withRouter(TreeComponent);
