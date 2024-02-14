import React, { useState, useEffect } from 'react';
import { TreeView } from '@mui/x-tree-view/TreeView';
import { TreeItem } from '@mui/x-tree-view/TreeItem';
import Typography from '@mui/material/Typography';
import FolderOpen from '@mui/icons-material/FolderOpenOutlined';
import SidebarDataClass from './SidebarDataClass.js';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { withRouter } from 'react-router-dom';
import Cookies from 'universal-cookie';
const cookies = new Cookies();

const TreeComponent = ({ history }) => {
  const [expandedNodes, setExpandedNodes] = useState([]);
  const [sidebarData, setSidebarData] = useState([]);

  useEffect(() => {
    const initialExpandedNodes = JSON.parse(localStorage.getItem('expandedNod')) || [];
    setExpandedNodes(initialExpandedNodes);
  
    // Obtener el rol del usuario desde las cookies
    const userRole = cookies.get('Sgm_cRole');
    console.log('UserRole:', userRole);
  
    // Obtener los datos de la barra lateral según el rol del usuario
    const sidebarData = SidebarDataClass.getSidebarData(userRole);
    console.log('SidebarData:', sidebarData);
  
    // Ordenar los datos de la barra lateral por el orden de la pestaña
    const sortedSidebarData = sidebarData.sort((a, b) => (a.tabOrder > b.tabOrder ? 1 : -1));
  
    setSidebarData(sortedSidebarData);
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
      icon={nodes.subNav && expandedNodes.includes(nodes.title) ? FolderOpen : FolderOpen}
      fontSize="14px"
      onClick={() => {
        if (!nodes.subNav || nodes.subNav.length === 0) {
          handleNodeClick(nodes.path);
        }
      }}
    >
      {Array.isArray(nodes.subNav)
        ? nodes.subNav.map((node) => renderTree(node))
        : <MyTreeItem key={nodes.title} label={nodes.title} icon={FolderOpen} fontSize="14px" />}
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
