
// https://firebase.google.com/docs/web/setup#available-libraries

import { useState } from "react";
import Barra from "./Barra";
import Login from "./Login";
import SubirProducto from "./SubirProductos";
import MisProductos from "./MisProductos";
import Productos from "./Productos";
const App = () => {

  const [ventana, setVentana] = useState("Login")

  return (
    <>
      {
        (ventana !== "Login") && <Barra setVentana={setVentana} ></Barra>
      }
      {
        ventana === "Login" ? <Login setVentana={setVentana}></Login> :
          ventana === "Productos" ? <Productos></Productos> :
            ventana === "MisProductos" ? <MisProductos></MisProductos> :
              ventana === "SubirProductos" ? <SubirProducto setVentana={setVentana}></SubirProducto> :
                "No se ha encontrado la pestaña"
      }
    </>
  );
}

export default App