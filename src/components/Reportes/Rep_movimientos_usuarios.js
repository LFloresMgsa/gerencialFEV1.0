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
import swal from 'sweetalert';
import Cookies from 'universal-cookie';
import { set } from 'lodash';
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
  const [searchTermEmpresa, setsearchTermEmpresa] = useState('');
  const [searchTermAnio, setsearchTermAnio] = useState('');

  const [searchTermUsuario, setsearchTermUsuario] = useState('');

  const [searchTermPeriodo, setsearchTermPeriodo] = useState('');

  const [searchTermLibro, setsearchTermLibro] = useState('');

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(50);

  const [empresas, setEmpresa] = useState([]);
  const [anios, setAnios] = useState([]);

  const [usuar, setUsuarios] = useState([]);
  const [periodos, setPeriodos] = useState([]);

  const [libros, setLibros] = useState([]);
  const [permitirBusqueda, setPermitirBusqueda] = useState(false);
  const [selectedEmpresaCodigo, setSelectedEmpresaCodigo] = useState('');

  const _Usuario = cookies.get('Sgm_cUsuario');

  const [empresaLibros, setEmpresaLibros] = useState([]);

  useEffect(() => {
    const fetchEmpresasLibros = async () => {
      try {
        const empresaLibros = await listarEmpresa();
        setEmpresaLibros(empresaLibros);
      } catch (error) {
        console.error("Error al obtener empresaLibros:", error);
      }
    };

    fetchEmpresasLibros();
  }, []);
  // Estado para almacenar los años

  // Cargar al inicio de la página
  useEffect(() => {
    listar();
    listarAnio();
    //listarEmpresa();
    listarUsuarios();
    //listarLibros();
    //listarPeriodos();
  }, []);

  useEffect(() => {
    if (searchTermAnio) {
      listarPeriodos();
      //listarLibros();
    }
  }, [searchTermAnio]);


  useEffect(() => {
    if (searchTermEmpresa && searchTermAnio) {
      listarLibros();
    }
  }, [searchTermEmpresa, searchTermAnio]);



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




  const handleEmpresaChange = async (event, empresaLibros) => {
    // Obtener el valor seleccionado del ComboBox
    const selectedEmpresa = event.target.value;

    // Obtener el código de la empresa correspondiente al valor seleccionado
    const nombEmpresa = empresaLibros.find(emp => emp.emp_cNombreLargo === selectedEmpresa);

    console.log(selectedEmpresa);

    if (nombEmpresa) {
      const codigoEmpresa = nombEmpresa.emp_cCodigo;

      console.log(codigoEmpresa);
      setSelectedEmpresaCodigo(codigoEmpresa);
      setsearchTermEmpresa(selectedEmpresa); // Actualizar el término de búsqueda de empresa
    }
  };



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
        //console.log(empresaNom);
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

  const listarLibros = async () => {
    let _body = {
      Accion: "MOV_LIBROS",
      Emp_cCodigo: selectedEmpresaCodigo,
      Pan_cAnio: searchTermAnio,
    };

    try {
      const res = await eventoService.obtenerMovimientoUsuario(_body);
      if (res && Array.isArray(res)) { // Verifica si res es un array
        const libros = res.map(item => item.lib_cDescripcion); // Extrae solo los valores de Pan_cAnio
        setLibros(libros); // Almacena los años en el estado
        //console.log(libros);
      } else {
        console.error("Error: No se obtuvieron datos de años o los datos están en un formato incorrecto.");
      }
    } catch (error) {
      console.error("Error al obtener datos de años:", error);
    }
  };


  const listarPeriodos = async () => {
    let _body = {
      Accion: "MOV_PERIODOS",
      Pan_cAnio: searchTermAnio,
    };

    try {
      const res = await eventoService.obtenerMovimientoUsuario(_body);
      if (res && Array.isArray(res)) { // Verifica si res es un array
        const periodos = res.map(item => item.per_cDescripPeriodo); // Extrae solo los valores de Pan_cAnio
        setPeriodos(periodos); // Almacena los años en el estado
        //console.log(periodos);
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




  const listarUsuarios = async () => {
    let _body = {
      Accion: "MOV_USUARIOS",
      soft_cCodSoft: '001'
    };

    try {
      const res = await eventoService.obtenerMovimientoUsuario(_body);
      if (res && Array.isArray(res)) { // Verifica si res es un array
        const usuariosCont = res.map(item => item.usu_cCodUsuario);
        setUsuarios(usuariosCont);
        //console.log(usuariosCont);
        return res;
      } else {
        console.error("Error: No se obtuvieron datos o los datos están en un formato incorrecto.");
        return []; // Retorna 
      }
    } catch (error) {
      console.error("Error al obtener datos:", error);
      return []; // Retorna un arreglo vacío en caso de error
    }
  };



  const listar = async (anioSeleccionado) => {
    try {
      // Obtener las empresas asociadas al usuario actual
      const mostrarEmpresa = await listarEmpresa();
      //console.log(mostrarEmpresa);


      // Filtrar los datos por las empresas del usuario actual y el año seleccionado
      const codigoEmpresaConLlaves = mostrarEmpresa.map(emp => emp.emp_cCodigo);
      //console.log(codigoEmpresaConLlaves);
      const empresaSeleccionadaString = codigoEmpresaConLlaves.join(',');
      //console.log(empresaSeleccionadaString);

      const _body = {
        Accion: "MOV_USUARIO",
        Emp_cCodigo: empresaSeleccionadaString, // Usar los códigos de las empresas del usuario actual
        Pan_cAnio: anioSeleccionado, // Usar el año seleccionado en el cuerpo de la solicitud
        Per_cperiodo: '',
        Lib_cTipoLibro: '',
      };

      const res = await eventoService.obtenerMovimientoUsuario(_body);

      //console.log(res);
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

  // console.log(searchTermUsuario);


  const filteredData = (data || []).filter((item) => {
    const nombreLargoMatch = item?.emp_cNombreLargo?.toLowerCase().includes(searchTermEmpresa.toLowerCase());
    const anioMatch = item?.pan_cAnio === searchTermAnio; // Verifica si el año coincide
    const libroDes  = item?.lib_cDescripcion?.toLowerCase().includes(searchTermLibro.toLowerCase());
    const periodoDes  = item?.per_cDescripPeriodo?.toLowerCase().includes(searchTermPeriodo.toLowerCase());
   
    const usuariosDes = item?.ase_cUserCrea?.toLowerCase().includes(searchTermUsuario.toLowerCase());
    // //const usuariosDes = searchTermUsuario !== '' ? (item && item.ase_cUserCrea && item.ase_cUserCrea.toLowerCase().includes(searchTermUsuario.toLowerCase())) : true;

    // console.log(searchTermUsuario);
    // console.log(usuariosDes);
    return nombreLargoMatch && anioMatch && libroDes && periodoDes && usuariosDes; // Devuelve true si tanto el nombre como el año coinciden
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
    setsearchTermEmpresa('');
    setsearchTermAnio('');
    setsearchTermPeriodo('');
    setsearchTermLibro('');
    setsearchTermUsuario('');
    setLibros([]); // Reiniciar el estado de libros
    setPeriodos([]); // Reiniciar el estado de periodos
  };


  return (
    <div style={{ ...fondoStyle, marginTop: '35px' }}>
      <Paper sx={{ p: 2, margin: 1, maxWidth: '100%', flexGrow: 1, backgroundColor: (theme) => theme.palette.mode === 'dark' ? '#1A2027' : '#fff' }}>
        <Box>
          <Typography variant="h5" color="black" align="center" fontWeight="bold" gutterBottom>
            MOVIMIENTOS POR USUARIOS
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', marginBottom: '10px' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
              <Typography sx={{ marginRight: '10px', fontWeight: 'bold' }}>Empresa:</Typography>
              <Select
                value={searchTermEmpresa}
                onChange={(e) => handleEmpresaChange(e, empresaLibros)}
                variant="outlined"
                size="small"
                sx={{ width: '100%' }}
              >
                {empresas.map((empresaNom) => (
                  <MenuItem key={empresaNom} value={empresaNom}>{empresaNom}</MenuItem>
                ))}
              </Select>
            </Box>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: '10px', alignItems: 'center' }}>
              <Box sx={{ minWidth: 150 }}>
                <Typography sx={{ fontWeight: 'bold' }}>Año:</Typography>
                <Select
                  value={searchTermAnio}
                  onChange={(e) => setsearchTermAnio(e.target.value)}
                  variant="outlined"
                  size="small"
                  fullWidth
                >
                  {anios.map((anio) => (
                    <MenuItem key={anio} value={anio}>{anio}</MenuItem>
                  ))}
                </Select>
              </Box>
              <Box sx={{ minWidth: 200 }}>
                <Typography sx={{ fontWeight: 'bold' }}>Libro:</Typography>
                <Select
                  value={searchTermLibro}
                  onChange={(e) => setsearchTermLibro(e.target.value)}
                  variant="outlined"
                  size="small"
                  fullWidth
                >
                  {libros.map((libro) => (
                    <MenuItem key={libro} value={libro}>{libro}</MenuItem>
                  ))}
                </Select>
              </Box>
              <Box sx={{ minWidth: 150 }}>
                <Typography sx={{ fontWeight: 'bold' }}>Periodos:</Typography>
                <Select
                  value={searchTermPeriodo}
                  onChange={(e) => setsearchTermPeriodo(e.target.value)}
                  variant="outlined"
                  size="small"
                  fullWidth
                >
                  {periodos.map((periodo) => (
                    <MenuItem key={periodo} value={periodo}>{periodo}</MenuItem>
                  ))}
                </Select>
              </Box>
              <Box sx={{ minWidth: 200 }}>
                <Typography sx={{ fontWeight: 'bold' }}>Usuarios:</Typography>
                <Select
                  value={searchTermUsuario}
                  onChange={(e) => setsearchTermUsuario(e.target.value)}
                  variant="outlined"
                  size="small"
                  fullWidth
                >
                  {usuar.map((usuario) => (
                    <MenuItem key={usuario} value={usuario}>{usuario}</MenuItem>
                    
                  ))}
                </Select>
              </Box>
            </Box>
          </Box>

          <Button
            variant="contained"
            onClick={() => {
              listar(searchTermAnio);
              // Verificar si se ha seleccionado un año antes de llamar a la función listar
              // if (!searchTermTipo) {
              //   swal("Seleccione el año", "", "error");
              //   return; // Detener la ejecución si no se ha seleccionado un año
              // }
              // // Llamar a la función listar con el valor seleccionado del ComboBox

            }}
            sx={{ backgroundColor: 'darkgreen', color: 'white', mb: 2 }}
          >
            Buscar
          </Button>

          <Button
            variant="contained"
            onClick={limpiarcampos}
            sx={{ backgroundColor: 'darkred', color: 'white', ml: 'auto', mb: 2 }}
          >
            Limpiar Campos
          </Button>

          <TableContainer component={Paper}>
            <Table aria-label="customized table">
              <TableHead>
                <TableRow>
                  <TableCell align="left" sx={{ backgroundColor: 'darkred', color: 'white', fontWeight: 'bold' }}>Codigo</TableCell>
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
              sx={{ color: 'black', backgroundColor: '', fontWeight: 'bold', '&:hover': { backgroundColor: '' }, marginRight: '5px' }}
            >
              <NavigateBeforeIcon />
            </Button>
            <Button
              disabled={indexOfLastItem >= filteredData.length}
              onClick={() => handlePageChange(currentPage + 1)}
              sx={{ color: 'black', backgroundColor: '', fontWeight: 'bold', '&:hover': { backgroundColor: '' }, marginRight: '5px' }}
            >
              <NavigateNextIcon />
            </Button>
          </Box>
        </Box>
      </Paper>
      <Box sx={{ mt: 2 }}>
        <Divider />
        <Box sx={{ p: 2, textAlign: 'center' }}>
          <Typography variant="body2" sx={{ fontWeight: 'bold', fontSize: '10px' }}>
            Copyright© 2024 - Management Group S.A.
          </Typography>
        </Box>
      </Box>
      <Divider />
    </div>
  );
}

export default Rep_movimientos_usuarios;