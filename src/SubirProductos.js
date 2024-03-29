import { getAuth } from "firebase/auth";
import { getStorage, ref, uploadBytes } from "firebase/storage";
import { useState } from "react";
import { getFirestore, collection, addDoc, Timestamp  } from "firebase/firestore";

const SubirProducto = ({ setVentana }) => {

    const [file, setFile] = useState(null)
    const [imageLink, setImageLink] = useState(null)
    const [descripcion, setDescripcion] = useState("")
    const [precio, setPrecio] = useState(0)

    const uploadProducto = (e) => {

        const db = getFirestore()
        var id = ""
        addDoc(collection(db, "articulos"), {
            vendedor: getAuth().currentUser.email,
            descripcion: descripcion,
            precioSalida: precio,
            comprador: ""
        }).then((docRef) => {
            const storage = getStorage();
            id = docRef.id;
            const storageRef = ref(storage, id);

            uploadBytes(storageRef, file).then((snapshot) => {
                console.log('Se ha subido el articulo! ', snapshot.metadata.fullPath);
                setVentana("MisProductos")
            }).catch((e) => console.error(e));
        }).catch((e) => console.error(e))

        addDoc(collection(db, "pujas"),{
            identificador: id,
            cantidad: 0,
            comprador: getAuth().currentUser.email,
            timeStamp: Timestamp.fromDate(new Date())
        })
    }

    return (
        <>
            <input type="text" placeholder="Descripcion" value={descripcion} onChange={(e) => setDescripcion(e.target.value)}></input>
            <input type="file" onChange={(e) => {
                const f = e.target.files[0]
                setFile(f)
                if (f) {
                    const fr = new FileReader();
                    fr.onload = () => {
                        setImageLink(fr.result);
                    }
                    fr.readAsDataURL(f);
                } else {
                    setImageLink(null);
                }

            }
            }></input>
            {imageLink != null && <img src={imageLink}></img>}
            <button onClick={uploadProducto}>Subir</button>
        </>
    )
}

export default SubirProducto