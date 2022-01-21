import { getAuth } from "firebase/auth"

const Barra = ({ setVentana }) => {
	return (
		<div>
			<p>Usuario {getAuth().currentUser.uid}</p>
			<button onClick={() => {
				getAuth().signOut()
				setVentana("Login")
			}} >Cerrar sesión</button>
			<button onClick={() => {
				setVentana("Imagenes")
			}} >Todas las imagenes</button>
			<button onClick={() => {
				setVentana("MisImagenes")
			}} >Mis imagenes</button>
			<button onClick={() => {
				setVentana("SubirImagen")
			}} >Subir imagen</button>
		</div>
	)
}

export default Barra