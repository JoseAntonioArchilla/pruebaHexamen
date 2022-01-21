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
				setVentana("Productos")
			}} >Productos Ofertados</button>
			<button onClick={() => {
				setVentana("MisProductos")
			}} >Mis productos subastados</button>
			<button onClick={() => {
				setVentana("SubirProductos")
			}} >Subir imagen</button>
		</div>
	)
}

export default Barra