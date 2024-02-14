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
	const [showPassword, setShowPassword] = useState(false);


	const BuscarToken = async () => {

		try {
			let _body = { Accion: "LOGIN", usu_cCodUsuario: username, usu_cClave: password }

			//console.log(_body);

			// obtenemos el token
			await eventoService.obtenerToken(_body).then(
				(res) => {
					setToken(res)
				},
				(error) => {
					console.log(error);
				}
			);

			  console.log('------------**********');
			  console.log(username);
			  console.log(password);
			  console.log(Token);
			  console.log('------------**********');


			if (Token) {
				cookies.set('token', Token, { path: "/" });
				//console.log(Token);
				setError('');
			}
		} catch (error) {
			setError('An error occurred while trying to login - token');
		}
	};


	const handleLogin = async () => {

		try {



			// genera un token
			await BuscarToken();

			const Emp_cCodigo = storage.GetStorage('Emp_cCodigo');
			const soft_cCodSoft = storage.GetStorage('soft_cCodSoft');
			
			if (!cookies.get('token')) {
				throw "Error: Token no existe";
			}

			let _body = {
				Accion: "LOGIN", usu_cCodUsuario: username, usu_cClave: password, Emp_cCodigo: Emp_cCodigo, 
				soft_cCodSoft: soft_cCodSoft
			  }


			let _result;





			// si encontro el token ingresa el login
			await eventoService.obtenerUsuario(_body).then(

				(res) => {
					setLogeo(res);
					_result = res;
					console.log(_result);
				},
				(error) => {
					console.log(error);
				}
			);



			console.log(_result.usuario);

			if (_result.usuario === username && _result.respuesta === "1") {

				cookies.set('Sgm_cUsuario', _result.usuario, { path: "/" });
				//cookies.set('Sgm_cNombre', _result.nombre, { path: "/" });
				//cookies.set('usu_cClave', _result.usu_cClave, { path: "/" });
				//cookies.set('Sgm_cObservaciones', _result.Sgm_cObservaciones, { path: "/" });
				cookies.set('Sgm_cRole', _result.role, { path: "/" });
				cookies.set('IsLoged', true, { path: "/" });


				setError('');

				if (cookies.get('token')) {
					window.location.href = "./inicio";
				}


			}
		} catch (error) {
			setError('');

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
									handleLogin();
								}
							}}
							autoComplete="username"
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
									handleLogin();
								}
							}}
							autoComplete="current-password"
							InputProps={{
								endAdornment: (
									<Button
										onClick={() => setShowPassword(!showPassword)}
										style={{ padding: 0, minWidth: 0 }}
										disableRipple
									>
										{showPassword ? <Visibility /> : <VisibilityOff />}
									</Button>
								),
							}}
						/>
					</div>

					{/* Botón de Ingresar */}
					<Button variant="contained" style={{ backgroundColor: '#8b0000', color: 'white' }} fullWidth onClick={handleLogin}>
						Ingresar
					</Button>
				</form>
			</Paper>

			{/* ToastContainer para mostrar notificaciones */}
			<ToastContainer />
		</Container>
	);
};

export default Login
