import React, { useState } from 'react'
import { Grid, Container, Paper, Avatar, Typography, TextField, Button, CssBaseline } from '@material-ui/core'
import { makeStyles } from '@mui/styles';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { eventoService } from '../services/evento.service';
import md5 from 'md5';
import Cookies from 'universal-cookie';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

import { storage } from "../storage.js";

import Autocomplete from '@mui/material/Autocomplete';

const cookies = new Cookies();

const useStyles = makeStyles(theme => ({
	root: {

	},
	container: {
		opacity: '1',
		height: '50%',

		marginTop: theme.spacing(0),
		[theme.breakpoints.down(400 + theme.spacing(0) + 0)]: {
			marginTop: 0,
			width: '100%',
			height: '100%'
		}
	},
	div: {

		marginTop: theme.spacing(0),
		display: 'flex',
		flexDirection: 'column',
		alignItems: 'center'
	},





	avatar: {
		margin: theme.spacing(0),
		backgroundColor: theme.palette.primary.main
	},
	form: {
		width: '100%',
		marginTop: theme.spacing(0)
	},
	button: {
		margin: theme.spacing(0, 0, 0)

	}
}))

const Login = () => {
	const [body, setBody] = useState({ nickname: '', password: '' })
	const classes = useStyles()
	const [username, setUsername] = useState('');
	const [password, setPassword] = useState('');
	const [logeo, setLogeo] = useState('');
	const [error, setError] = useState('');
	const [Token, setToken] = useState('');

	const [selEmpCodigo, setEmpCodigo] = useState('');
	const [selPanAnio, setPanAnio] = useState('');


	const [showPassword, setShowPassword] = useState(false);

	const [empresas, setEmpresas] = useState([]);
	const [anios, setAnios] = useState([]);

	const Emp_cCodigo = storage.GetStorage('Emp_cCodigo');
	const soft_cCodSoft = storage.GetStorage('soft_cCodSoft');


	let IsLogedIni = cookies.get('IsLogedIni');
	let IsLoged = cookies.get('IsLoged');

	const BuscarToken = async () => {
		try {
			let _body = { Accion: "SEL_ALL", usu_cCodUsuario: username, usu_cClave: password };
	
			// obtenemos el token
			const token = await eventoService.obtenerToken(_body);
			if (token) {
				cookies.set('token', token, { path: "/" });
				setToken(token);
				setError('');
			}
		} catch (error) {
			console.error('An error occurred while trying to login - token:', error);
			setError('An error occurred while trying to login - token');
		}
	};


	const handleConect = async () => {
		try {
			// genera un token
			await BuscarToken();
	
			// valida si encontro el token
			if (!cookies.get('token')) {
				throw "Error: Token no existe";
			}
	
			let _body = {
				Accion: "LOGIN",
				usu_cCodUsuario: username,
				usu_cClave: password,
				Emp_cCodigo: '',
				soft_cCodSoft: soft_cCodSoft
			};
			let _result;
	
			console.log(_body);
			// si encontro el token ingresa el login
			await eventoService.obtenerUsuario(_body).then(
				(res) => {
					setLogeo(res);
					_result = res;
				},
				(error) => {
					console.log(error);
				}
			);
	
			if (_result.usuario === username && _result.respuesta === "1") {
				cookies.set('Sgm_cUsuario', _result.usuario, { path: "/" });
				cookies.set('Sgm_cNombre', _result.nombre, { path: "/" });
				cookies.set('Sgm_cRole', _result.role, { path: "/" });
				cookies.set('IsLoged', false, { path: "/" });
				cookies.set('IsLogedIni', true, { path: "/" });
	
				setError('');
	
				if (cookies.get('token')) {
					IsLogedIni = true;
					await BuscarEmpresas();
				}
				toast.success("Conectado exitoso.");
			} else {
				// Si el inicio de sesión falla, muestra una alerta de error
				//toast.error("El usuario y la contraseña no coinciden.");
				//alert("El usuario y la contraseña no coinciden.");
			}
		} catch (error) {
			console.error('Error en el inicio de sesión:', error);
			setError('Error en el inicio de sesión: ' + error);
		}
	};


	const BuscarEmpresas = async () => {



		try {




			if (!cookies.get('token')) {
				throw "Error: Token no existe";
			}


			let _body = {
				Accion: "EMPRESA", usu_cCodUsuario: username, usu_cClave: password, Emp_cCodigo: '', soft_cCodSoft: soft_cCodSoft
			}




			await eventoService.obtenerEmpresas(_body).then(

				(res) => {




					setEmpresas(res);

				},
				(error) => {
					console.log(error);
				}
			);

		} catch (error) {
			setError('');
		}
	};

	const BuscarAnios = async (empresa) => {

		try {

			if (!cookies.get('token')) {
				throw "Error: Token no existe";
			}

			let _body = {
				Accion: "ANIOS", usu_cCodUsuario: username, usu_cClave: password, Emp_cCodigo: empresa, soft_cCodSoft: soft_cCodSoft
			}

			await eventoService.obtenerAnios(_body).then(

				(res) => {

					setAnios(res);

				},
				(error) => {
					console.log(error);
				}
			);

		} catch (error) {
			setError('');
		}
	};


	const handleCancel = async () => {

		try {
			cookies.set('IsLogedIni', false, { path: "/" });
			window.location.href = "../../gestcon";



			cookies.remove('Sgm_cUsuario', { path: "/" });
			cookies.remove('Sgm_cRole', { path: "/" });
			cookies.remove('Sgm_cNombre', { path: "/" });
			cookies.remove('usu_cClave', { path: "/" });
			//cookies.remove('Sgm_cObservaciones', { path: "/" });
			cookies.remove('token', { path: "/" });
			cookies.remove('IsLoged', { path: "/" });
			cookies.remove('IsLogedIni', { path: "/" });

			storage.DelStorage('Emp_cCodigo', "")
			storage.DelStorage('Pan_cAnio', "")


		} catch (error) {
			setError('');
		}
	};

	const handleLogin = async () => {


		try {

			// valida si encontro el token

			if (!cookies.get('token')) {
				throw "Error: Token no existe";
			}

			cookies.set('IsLoged', true, { path: "/" });
			cookies.set('IsLogedIni', true, { path: "/" });


			setError('');

			if (cookies.get('token')) {

				IsLoged = true;

				window.location.href = "./gestcon";
				//console.log(soft_cCodSoft);
				//console.log(cookies.get('Sgm_cRole'));
			}

		} catch (error) {
			setError('');
		}
	};


	const handleSelectionChangeEmpresa = async (event, value) => {
		if (value !== null) {
			setEmpCodigo(value.emp_cCodigo);
			localStorage.setItem('Emp_cCodigo', value.emp_cCodigo); // Guarda emp_cCodigo en localStorage

			//console.log(value.emp_cCodigo);
			await BuscarAnios(value.emp_cCodigo);

			if (!anios) {
				setAnios([]);
			}
		}
	};

	const handleSelectionChangeAnio = async (event, value) => {
		if (value !== null) {
			setPanAnio(value.pan_cAnio);
			localStorage.setItem('Pan_cAnio', value.pan_cAnio); // Guarda pan_cAnio en localStorage

			//console.log(value.pan_cAnio);
		}
	};


	return (
		<Container component="main" maxWidth="xs" style={{ border: '1.5px solid #8b0000', borderRadius: '5px', padding: '16px' }}>
			<Paper elevation={0}>
				<form>
					<label style={{ fontWeight: 'bold', fontSize: '1.2em', textAlign: 'center', color: 'darkred' }}>Ingreso al Sistema</label>
					<div>.</div>
					<div style={{ marginBottom: '10px', display: 'flex', flexDirection: 'column', textAlign: 'left', fontWeight: 'bold' }}>
						<label htmlFor="username">Usuario:</label>
						<TextField
							id="username"
							autoFocus
							variant="outlined"
							margin="normal"
							style={{ width: '200px' }}
							value={username}
							onChange={(e) => setUsername(e.target.value.toUpperCase())}
							onKeyDown={(e) => {
								if (e.key === 'Tab') {
									e.preventDefault();
									document.getElementById('password').focus();
								}
								if (e.key === 'Enter') {
									e.preventDefault();
									handleConect();
								}
							}}
							autoComplete="username"
							disabled={IsLogedIni} // Deshabilitar si el usuario ya está conectado
						/>
					</div>
					{/* Etiqueta y campo de Contraseña */}
					<div>.</div>
					<div style={{ marginBottom: '10px', display: 'flex', flexDirection: 'column', textAlign: 'left', marginTop: '-20px', fontWeight: 'bold' }}>
						<label htmlFor="username">Contraseña:</label>
						<TextField
							id="password"
							type={showPassword ? 'text' : 'password'}
							variant="outlined"
							margin="normal"
							style={{ width: '200px' }}
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							onKeyPress={(e) => {
								if (e.key === 'Enter') {
									e.preventDefault();
									handleConect();
								}
							}}
							autoComplete="current-password"
							InputProps={{
								endAdornment: (
									<Button
										onClick={() => setShowPassword(!showPassword)}
										style={{ padding: 0, minWidth: 0 }}
										disableRipple
										disabled={IsLogedIni} // Deshabilitar si el usuario ya está conectado
									>
										{showPassword ? <Visibility /> : <VisibilityOff />}
									</Button>
								),
							}}
							disabled={IsLogedIni} // Deshabilitar si el usuario ya está conectado
						/>
					</div>

					{/* Botón de Ingresar */}
					<Button variant="contained" style={{ backgroundColor: '#8b0000', color: 'white' }} fullWidth onClick={handleConect} disabled={IsLogedIni}>
						Conectar
					</Button>

					<div>.</div>
					{IsLogedIni &&
						<Grid container spacing={1} style={{ marginBottom: '10px', display: 'flex', flexDirection: 'column', textAlign: 'left', fontWeight: 'bold' }}>
							<Grid item xs={12} lg={12}>
								<Typography variant='subtitle1' style={{ marginBottom: '5px', fontWeight: 'bold', fontSize: '15px' }}>Empresa:</Typography>
								<Autocomplete
									disablePortal
									id="combo-empresas"
									options={empresas}
									onChange={handleSelectionChangeEmpresa}
									getOptionLabel={(option) => `${option.emp_cCodigo} - ${option.emp_cNombreLargo}`}
									renderInput={(params) => <TextField {...params} variant="outlined" />}
									renderOption={(props, option, state) => (
										<li
											{...props}
											style={{ background: state.selected ? 'lightblue' : 'white' }}
										>
											{option.emp_cCodigo} - {option.emp_cNombreLargo}
										</li>
									)}
								/>
							</Grid>
							<Grid item xs={12} lg={12}>
								<Typography variant='subtitle1' style={{ marginBottom: '5px', fontWeight: 'bold', fontSize: '15px' }}>Año:</Typography>
								<Autocomplete
									disablePortal
									id="combo-anios"
									options={anios}
									onChange={handleSelectionChangeAnio}
									getOptionLabel={(option) => `${option.pan_cAnio}`}
									renderInput={(params) => <TextField {...params} variant="outlined" />}
									renderOption={(props, option, state) => (
										<li
											{...props}
											style={{ background: state.selected ? 'lightblue' : 'white' }}
										>
											{option.pan_cAnio}
										</li>
									)}
								/>
							</Grid>
							<Grid item xs={12} lg={12}>
								<Button
									fullWidth
									variant='contained'
									style={{ backgroundColor: '#8b0000', color: 'white', marginTop: '10px' }}
									onClick={handleLogin}
								>
									Ingresar
								</Button>
							</Grid>
							<Grid item xs={12} lg={12}>
								<Button
									fullWidth
									variant='contained'
									style={{ backgroundColor: '#8b0000', color: 'white', marginTop: '10px' }}
									onClick={handleCancel}
								>
									Cancelar
								</Button>
							</Grid>
						</Grid>
					}

				</form>
			</Paper>

			{/* ToastContainer para mostrar notificaciones */}
			<ToastContainer />
		</Container>
	);


};

export default Login
