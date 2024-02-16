import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { eventoService } from '../../services/evento.service';
import md5 from 'md5'; // Importa la función md5 si aún no lo has hecho
import { storage } from "../../storage.js";
import {
  Paper, Table, TableBody, TableCell, TableContainer, TableHead,
  TableRow, Box, Typography, Divider, TextField, InputAdornment,
  Button, Select, MenuItem
} from '@mui/material';
import AppFooter from '../../components/layout/AppFooter.js';
import SearchIcon from '@mui/icons-material/Search';
import { styled, css } from '@mui/system';

import fondo from '../../imagenes/fondotodos.png'
import NavigateBeforeIcon from '@material-ui/icons/NavigateBefore';
import NavigateNextIcon from '@material-ui/icons/NavigateNext';

import Cookies from 'universal-cookie';
const cookies = new Cookies();

const Rep_movimientos_usuarios = (props) => {

  const fondoStyle = {
    backgroundImage: `linear-gradient(rgba(255,255,255,0.7), rgba(255,255,255,0.7)), url(${fondo})`, // Opacidad agregada con rgba
    backgroundSize: 'cover',
    backgroundRepeat: 'no-repeat',
    height: '100vh',
    // Otras propiedades de estilo según tus necesidades
  };


  const history = useHistory();
  const [data, setData] = useState([]);
  const [searchTermRestriccion, setSearchTermRestriccion] = useState('');
  const [searchTermTipo, setSearchTermTipo] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(50);

  const [anios, setAnios] = useState([]);

  const [usuar, setUsuarios] = useState([]);

  // Estado para almacenar los años
  const [empresas, setEmpresa] = useState([]);
  // Cargar al inicio de la página
  useEffect(() => {
    listar();
    listarAnio();
    //listarEmpresa();
    //listarUsuarios();
  }, []);


  const listarAnio = async () => {
    let _body = {
      Accion: "MOV_ANIOS"
    };

    try {
      const res = await eventoService.obtenerMovimientoUsuario(_body);
      if (res && Array.isArray(res)) { // Verifica si res es un array
        const anios = res.map(item => item.pan_cAnio); // Extrae solo los valores de Pan_cAnio
        setAnios(anios); // Almacena los años en el estado
        //console.log(anios);
      } else {
        console.error("Error: No se obtuvieron datos de años o los datos están en un formato incorrecto.");
      }
    } catch (error) {
      console.error("Error al obtener datos de años:", error);
    }
  };



  const _Usuario = cookies.get('Sgm_cUsuario');

  const listarEmpresa = async () => {
    let _body = {
      Accion: "MOV_EMPRESAS",
      Usuario: _Usuario,
      soft_cCodSoft: '001'
    };

    try {
      const res = await eventoService.obtenerMovimientoUsuario(_body);
      if (res && Array.isArray(res)) { // Verifica si res es un array
        const empresaNom = res.map(item => item.emp_cNombreLargo); // Extrae solo los valores de Pan_cAnio
        setEmpresa(empresaNom); // Almacena los años en el estado
        console.log(empresaNom);
        return res; // Retorna los datos de la empresa
      } else {
        console.error("Error: No se obtuvieron datos o los datos están en un formato incorrecto.");
        return []; // Retorna un arreglo vacío en caso de error
      }
    } catch (error) {
      console.error("Error al obtener datos:", error);
      return []; // Retorna un arreglo vacío en caso de error
    }
  };



  const listar = async (anioSeleccionado) => {
    try {
      // Obtener las empresas asociadas al usuario actual
      const empresasUsuario = await listarEmpresa();

      console.log(empresasUsuario);
      // Filtrar los datos por las empresas del usuario actual y el año seleccionado
      const empresasUsuarioCodigos = empresasUsuario.map(emp => emp.emp_cCodigo);
      const empresasUsuarioCodigosString = empresasUsuarioCodigos.join(',');
      console.log(empresasUsuarioCodigosString);

      const _body = {
        Accion: "MOV_USUARIO",
        Emp_cCodigo: empresasUsuarioCodigosString, // Usar los códigos de las empresas del usuario actual
        Pan_cAnio: anioSeleccionado, // Usar el año seleccionado en el cuerpo de la solicitud
        Per_cperiodo: '',
        Lib_cTipoLibro: '',
      };

      const res = await eventoService.obtenerMovimientoUsuario(_body);

      console.log(res);
      if (res) {
        setData(res);
      } else {
        console.error("Error: No se obtuvieron datos o los datos están en un formato incorrecto.");
      }
    } catch (error) {
      console.error("Error al obtener datos:", error);
    }
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const filteredData = (data || []).filter((item) => {
    const nombreLargoMatch = item?.emp_cNombreLargo?.toLowerCase().includes(searchTermRestriccion.toLowerCase());
    const anioMatch = item?.pan_cAnio === searchTermTipo; // Verifica si el año coincide
    return nombreLargoMatch && anioMatch; // Devuelve true si tanto el nombre como el año coinciden
  });

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentData = filteredData.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  const FooterRoot = styled('footer')(
    ({ theme }) => css`
      margin: 0 auto;
      text-align: center;
      width: 32%;
      margin-top: 30px !important;
  
      & > div:nth-child(1) {
        position: relative;
        display: flex;
        justify-content: space-evenly;
        align-items: end;
        height: 40px;
      }
  
      small {
        color: #5e6c79;
      }
  
      & .MuiBox-root {
        display: flex;
        flex-direction: column;
        align-items: center;
        -webkit-box-align: start;
        margin: 7px;
      }
  
      .MuiDivider-wrapperVertical {
        padding: 0px;
      }
  
      & > .MuiDivider-root:nth-child(2) {
        margin: 5px auto;
      }
  
      .MuiButton-textDefault {
        text-transform: capitalize;
        line-height: 10px;
      }
  
      .legal {
        display: flex;
        font-size: 0.6  rem;
        justify-content: space-between;
      }
    `
  );

  const limpiarcampos = () => {
    setSearchTermRestriccion('');
    setSearchTermTipo('');
    setPermitirBusqueda(false); // Limpiar el estado de permitir búsqueda
  };

  const buscar = () => {
    // Verificar si ambos campos están seleccionados
    if (searchTermRestriccion && searchTermTipo) {
      // Realizar la búsqueda
      listar(searchTermTipo);
    } else {
      console.log("Por favor seleccione la empresa y el año antes de realizar la búsqueda.");
    }
  };

  return (
    <div style={{ ...fondoStyle, marginTop: '35px' }}>
      <Paper
        sx={{
          p: 2,
          margin: 1,
          maxWidth: '100%',
          flexGrow: 1,
          backgroundColor: (theme) =>
            theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
        }}
      >
        <Box>
          <Typography
            variant="h5"
            color="black"
            align="center"
            fontWeight="bold"
            gutterBottom
          >
            MOVIMIENTOS POR USUARIOS
          </Typography>
          <Box sx={{ display: 'row ', justifyContent: 'space-between', marginBottom: '10px' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Typography sx={{ marginRight: '10px', fontWeight: 'bold' }}>Empresa:</Typography>
                <Select
                  value={searchTermRestriccion}
                  onChange={(e) => {
                    setSearchTermRestriccion(e.target.value);
                    //listar(e.target.value);
                  }}
                  variant="outlined"
                  size="small"
                  sx={{ width: 700 }}
                >
                  {empresas.map((empresaNom) => (
                    <MenuItem key={empresaNom} value={empresaNom}>{empresaNom}</MenuItem>
                  ))}
                </Select>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Typography sx={{ marginRight: '10px', fontWeight: 'bold' }}>Año:</Typography>
                <Select
                  value={searchTermTipo}
                  onChange={(e) => {
                    setSearchTermTipo(e.target.value);
                    //listar(e.target.value);
                  }}
                  variant="outlined"
                  size="small"
                  sx={{ width: 150 }}
                >
                  {anios.map((anio) => (
                    <MenuItem key={anio} value={anio}>{anio}</MenuItem>
                  ))}
                </Select>
              </Box>
            </Box>
          </Box>

          <Button
            variant="contained"
            onClick={() => {
              // Llamar a la función listar con el valor seleccionado del ComboBox
              listar(searchTermTipo);
            }}
            style={{ marginLeft: '10px', backgroundColor: 'darkgreen', color: 'white', marginBottom: '10px' }}
          >
            Buscar
          </Button>


          <Button
            variant="contained"
            onClick={limpiarcampos}
            style={{ marginLeft: 'auto', backgroundColor: 'darkred', marginBottom: '10px' }}
          >
            Limpiar Campos
          </Button>

          <TableContainer component={Paper}>
            <Table aria-label="customized table">
              <TableHead>
                <TableRow>
                  <TableCell align="left" sx={{ backgroundColor: 'darkred', color: 'white', fontWeight: 'bold' }}>Emp_cCodigo</TableCell>
                  <TableCell align="left" sx={{ backgroundColor: 'darkred', color: 'white', fontWeight: 'bold' }}>Empresa</TableCell>
                  <TableCell align="center" sx={{ backgroundColor: 'darkred', color: 'white', fontWeight: 'bold' }}>RUC</TableCell>
                  <TableCell align="left" sx={{ backgroundColor: 'darkred', color: 'white', fontWeight: 'bold' }}>Año</TableCell>
                  <TableCell align="center" sx={{ backgroundColor: 'darkred', color: 'white', fontWeight: 'bold' }}>Periodo</TableCell>
                  <TableCell align="left" sx={{ backgroundColor: 'darkred', color: 'white', fontWeight: 'bold' }}>Desc.Periodo</TableCell>
                  <TableCell align="left" sx={{ backgroundColor: 'darkred', color: 'white', fontWeight: 'bold' }}>Usuario</TableCell>
                  <TableCell align="center" sx={{ backgroundColor: 'darkred', color: 'white', fontWeight: 'bold' }}>Tipo de Libro</TableCell>
                  <TableCell align="left" sx={{ backgroundColor: 'darkred', color: 'white', fontWeight: 'bold' }}>Descripcion</TableCell>
                  <TableCell align="center" sx={{ backgroundColor: 'darkred', color: 'white', fontWeight: 'bold' }}>Registros</TableCell>
                  <TableCell align="left" sx={{ backgroundColor: 'darkred', color: 'white', fontWeight: 'bold' }}>Fecha de Creación</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {currentData.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell align="left">{item.emp_cCodigo}</TableCell>
                    <TableCell align="left">{item.emp_cNombreLargo}</TableCell>
                    <TableCell align="left">{item.emp_cNumRuc}</TableCell>
                    <TableCell align="left">{item.pan_cAnio}</TableCell>
                    <TableCell align="center">{item.per_cPeriodo}</TableCell>
                    <TableCell align="left">{item.per_cDescripPeriodo}</TableCell>
                    <TableCell align="left">{item.ase_cUserCrea}</TableCell>
                    <TableCell align="center">{item.lib_cTipoLibro}</TableCell>
                    <TableCell align="left">{item.lib_cDescripcion}</TableCell>
                    <TableCell align="center">{item.registros}</TableCell>
                    <TableCell align="left">{item.creacion}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: '10px', alignItems: 'center' }}>
            <Typography variant="body2" color="textSecondary" sx={{ marginRight: '10px', fontWeight: 'bold' }}>
              Página {currentPage} de {totalPages}
            </Typography>
            <Button
              disabled={currentPage === 1}
              onClick={() => handlePageChange(currentPage - 1)}
              sx={{
                marginRight: '5px',
                color: 'black',
                backgroundColor: '',
                fontWeight: 'bold',
                '&:hover': {
                  backgroundColor: '',
                },
              }}
            >
              <NavigateBeforeIcon />
            </Button>
            <Button
              disabled={indexOfLastItem >= filteredData.length}
              onClick={() => handlePageChange(currentPage + 1)}
              sx={{
                marginRight: '5px',
                color: 'black',
                backgroundColor: '',
                fontWeight: 'bold',
                '&:hover': {
                  backgroundColor: '',
                },
              }}
            >
              <NavigateNextIcon />
            </Button>
          </Box>
        </Box>
      </Paper>
      <FooterRoot>
        <div></div>
        <Divider />
        <div>
          <div style={{ fontWeight: 'bold', fontSize: '10px' }}>Copyright© 2024 - Management Group S.A.</div>
          <div></div>
        </div>
      </FooterRoot>
      <AppFooter />
      <Divider />
    </div>
  );
};

export default Rep_movimientos_usuarios;