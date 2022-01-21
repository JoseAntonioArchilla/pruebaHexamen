import { getAuth } from "firebase/auth";
import { getFirestore, collection, getDocs, query, where, runTransaction, DocumentReference, deleteDoc } from "firebase/firestore";
import { deleteObject, getDownloadURL, getStorage, ref } from "firebase/storage";
import { useEffect, useState } from "react";

const MisProductos = () => {
    console.log(Mias)
    const [MisProductos, setProductos] = useState([])
    const [descripcion, setDescripcion] = useState("")
    const [precio, setPrecio] = useState(0)

    const cargarProductos = () => {
        setProductos([])
        const db = getFirestore()
        getDocs(query(collection(db, "productos"), where("vendedor", "==", getAuth().currentUser.email))).then(snapshot => {
            const storage = getStorage()
            snapshot.docs.map((doc) => {
                getDownloadURL(ref(storage, doc.id)).then((url) => {
                    setProductos((old) => [...old, { ...doc.data(), url: url, id: doc.id, ref: doc.ref }])
                })
            })
        }).catch(e => console.error(e))
    }

    
    
    useEffect(cargarProductos, [])
 

    return (
        <>
            <input placeholder="Texto" value={descripcion} onChange={(e) => setDescripcion(e.target.value)}></input>
            <input type="number" readonly placeholder="Precio salida" value={precio} onChange={(e) => setPrecio(e.target.value)}></input>
            <button onClick={cargarProductos}>Buscar</button>
            {
                MisProductos != null && MisProductos.map((elem, idx) => {
                    return (
                        <div key={idx}>
                            <img src={elem.url}></img>
                            {
                                    <input value={MisProductos[idx].descripcion} onChange={(e) => {
                                        MisProductos[idx].descripcion = e.target.value
                                        setProductos([...MisProductos])
                                    }}></input>
                                    
                            }
                                <button onClick={async () => {
                                    await deleteDoc(elem.ref);
                                    await deleteObject(ref(getStorage(), elem.id))
                                    cargarProductos()
                                }}>Eliminar Articulo</button>
                            {getAuth().currentUser.uid == elem.autor &&
                                <button onClick={async () => {
                                    runTransaction(getFirestore(), async (transaction) => {
                                        transaction.update(elem.ref, { vendedor: elem.descripcion })
                                    })
                                }}>Adjudicar puja</button>}

                        </div>
                    )
                })
            }
        </>
    )
}

export default MisProductos