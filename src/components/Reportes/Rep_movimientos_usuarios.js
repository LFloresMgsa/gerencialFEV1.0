import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { eventoService } from '../../services/evento.service';
import md5 from 'md5'; // Importa la función md5 si aún no lo has hecho
import { storage } from "../../storage.js";
import {
  Paper, Table, TableBody, TableCell, TableContainer, TableHead,
  TableRow, Box, Typography, Divider, TextField, InputAdornment,
  Button, CircularProgress
} from '@mui/material';
import AppFooter from '../../components/layout/AppFooter.js';
import SearchIcon from '@mui/icons-material/Search';
import { styled, css } from '@mui/system';
import IconButton from '@mui/material/IconButton';
import EditNoteOutlinedIcon from '@mui/icons-material/EditNoteOutlined';
import DeleteForeverOutlinedIcon from '@mui/icons-material/DeleteForeverOutlined';
import AddCircleOutlineOutlinedIcon from '@mui/icons-material/AddCircleOutlineOutlined';
import fondo from '../../imagenes/fondotodos.png'
import NavigateBeforeIcon from '@material-ui/icons/NavigateBefore';
import NavigateNextIcon from '@material-ui/icons/NavigateNext';
import Swal from 'sweetalert2';
import { parseISO, format } from 'date-fns';

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
  const [itemsPerPage] = useState(10);



  // Cargar al inicio de la página
  useEffect(() => {
    listar();
  }, []);


  const listar = async () => {
    let _body = {
      Accion: "MOV_USUARIO", Emp_cCodigo: '', Pan_cAnio: '2024', Per_cperiodo: '',
      Lib_cTipoLibro: ''
    };

    console.log(_body);
    try {
      const res = await eventoService.obtenerMovimientoUsuario(_body);

      console.log("Respuesta de la API:", res);

      if (res) {
        setData(res);
        console.log("setData", res); // Convertimos el objeto en un array con un solo elemento
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

  console.log("Data:", data);
  console.log("Search term:", searchTermRestriccion);
  const filteredData = (data || []).filter((item) => {
    console.log("Item:", item); // Puedes agregar esto para ver cada elemento
    return item?.emp_cNombreLargo?.toLowerCase().includes(searchTermRestriccion.toLowerCase())
  });
  console.log("Filtered Data:", filteredData);

  console.log("Tipo de currentData:", typeof currentData);
  console.log("Contenido de currentData:", currentData);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  console.log("Filtered Data:", filteredData);
  const currentData = filteredData.slice(indexOfFirstItem, indexOfLastItem);
  console.log("Current Data:", currentData);
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
  }



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



          <Box sx={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
            <TextField
              label="Buscar por Url"
              variant="outlined"
              size="small"
              value={searchTermRestriccion}
              onChange={(e) => setSearchTermRestriccion(e.target.value)}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <SearchIcon style={{ color: '#8b0000' }} />
                  </InputAdornment>
                ),
              }}
              sx={{ marginRight: '20px' }}
            />

            <TextField
              label="Buscar por Usuario"
              variant="outlined"
              size="small"
              value={searchTermTipo}
              onChange={(e) => setSearchTermTipo(e.target.value)}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <SearchIcon style={{ color: '#8b0000' }} />
                  </InputAdornment>
                ),
              }}
            />
          </Box>
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
                  <TableCell align="left"
                    sx={{ backgroundColor: 'darkred', color: 'white', fontWeight: 'bold' }}
                  >Emp_cCodigo</TableCell>

                  <TableCell align="left"
                    sx={{ backgroundColor: 'darkred', color: 'white', fontWeight: 'bold' }}
                  >Empresa</TableCell>
                  <TableCell align="center"
                    sx={{ backgroundColor: 'darkred', color: 'white', fontWeight: 'bold' }}
                  >RUC</TableCell>
                  <TableCell align="left"
                    sx={{ backgroundColor: 'darkred', color: 'white', fontWeight: 'bold' }}
                  >Año</TableCell>
                  <TableCell align="left"
                    sx={{ backgroundColor: 'darkred', color: 'white', fontWeight: 'bold' }}
                  >Periodo</TableCell>
                  <TableCell align="left"
                    sx={{ backgroundColor: 'darkred', color: 'white', fontWeight: 'bold' }}
                  >Desc.Periodo</TableCell>
                  <TableCell align="left"
                    sx={{ backgroundColor: 'darkred', color: 'white', fontWeight: 'bold' }}
                  >Usuario</TableCell>
                  <TableCell align="center"
                    sx={{ backgroundColor: 'darkred', color: 'white', fontWeight: 'bold' }}
                  >Tipo de Libro</TableCell>
                  <TableCell align="left"
                    sx={{ backgroundColor: 'darkred', color: 'white', fontWeight: 'bold' }}
                  >Descripcion</TableCell>
                  <TableCell align="left"
                    sx={{ backgroundColor: 'darkred', color: 'white', fontWeight: 'bold' }}
                  >Registros</TableCell>
                  <TableCell align="left"
                    sx={{ backgroundColor: 'darkred', color: 'white', fontWeight: 'bold' }}
                  >Fecha de Creación</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {console.log("Current Data:", currentData)}
                {currentData.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell align="left">{item.emp_cCodigo}</TableCell>
                    <TableCell align="left">{item.emp_cNombreLargo}</TableCell>
                    <TableCell align="left">{item.emp_cNumRuc}</TableCell>
                    <TableCell align="left">{item.pan_cAnio}</TableCell>
                    <TableCell align="left">{item.per_cPeriodo}</TableCell>
                    <TableCell align="left">{item.per_cDescripPeriodo}</TableCell>
                    <TableCell align="left">{item.ase_cUserCrea}</TableCell>
                    <TableCell align="center">{item.lib_cTipoLibro}</TableCell>
                    <TableCell align="left">{item.lib_cDescripcion}</TableCell>
                    <TableCell align="left">{item.registros}</TableCell>
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