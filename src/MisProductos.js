import { getAuth } from "firebase/auth";
import { getFirestore, collection, getDocs, query, where, runTransaction, DocumentReference, deleteDoc } from "firebase/firestore";
import { deleteObject, getDownloadURL, getStorage, ref } from "firebase/storage";
import { useEffect, useState } from "react";
//const db = getFirestore()
//const PujasRef = collection(db, "pujas");

const MisProductos = () => {
    const [MisProductos, setProductos] = useState([])
    const [descripcion, setDescripcion] = useState("")
    const [precio, setPrecio] = useState(0)
    const [pujas, setPujas] = useState(null)
    const key = function (obj) {
        // Some unique object-dependent key
        return obj.totallyUniqueEmployeeIdKey; // Just an example
    };
    const cargarProductos = () => {
        setProductos([])
        const db = getFirestore()
        getDocs(query(collection(db, "articulos"), where("vendedor", "==", getAuth().currentUser.email))).then(snapshot => {
            const storage = getStorage()
            snapshot.docs.map((doc) => {
                getDownloadURL(ref(storage, doc.id)).then((url) => {
                    setProductos((old) => [...old, { ...doc.data(), url: url, id: doc.id, ref: doc.ref }])
                })
            })
        }).catch(e => console.error(e))
    }
    const cargarPujas = async () => {
        var dict = {};
        const db = getFirestore()
        const querySnapshot = await getDocs(collection(db, "pujas"));
        querySnapshot.forEach((doc) => {
            dict[key(doc.data().identificador)] = {cantidad: doc.data().cantidad, comprador: doc.data().comprador}
        });
        setPujas(dict)
    }
    
    
    useEffect(cargarProductos, [])
 

    return (
        <>
            <input placeholder="Texto" value={descripcion} onChange={(e) => setDescripcion(e.target.value)}></input>
            <input type="number" readOnly placeholder="Precio salida" value={precio} onChange={(e) => setPrecio(e.target.value)}></input>
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
                           
                                <button onClick={async () => {
                                    runTransaction(getFirestore(), async (transaction) => {
                                        transaction.update(elem.ref, { comprador: elem.descripcion })
                                    })
                                }}>Adjudicar puja</button>

                        </div>
                    )
                })
            }
        </>
    )
}

export default MisProductos