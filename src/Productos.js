import { getAuth } from "firebase/auth";
import { getFirestore, collection, getDocs, query, where, runTransaction, DocumentReference, deleteDoc } from "firebase/firestore";
import { deleteObject, getDownloadURL, getStorage, ref } from "firebase/storage";
import { useEffect, useState } from "react";

const Productos = () => {
    const [Productos, setProductos] = useState([])
    const [descripcion, setDescripcion] = useState("")
    const [pujas, setPujas] = useState(null)

    const cargarProductos = () => {
        setProductos([])
        const db = getFirestore()
        getDocs(query(collection(db, "articulos"))).then(snapshot => {
            const storage = getStorage()
            snapshot.docs.filter((doc) =>
                ((descripcion == "") || doc.data().descripcion.includes(descripcion))
            ).map((doc) => {
                getDownloadURL(ref(storage, doc.id)).then((url) => {
                    setProductos((old) => [...old, { ...doc.data(), url: url, id: doc.id, ref: doc.ref }])
                })
            })
            
        }).catch(e => console.error(e))
    }
    const key = function (obj) {
        // Some unique object-dependent key
        return obj.totallyUniqueEmployeeIdKey; // Just an example
    };
   const cargarPujas = async () => {
        var dict = {};
        const db = getFirestore()
       const querySnapshot = getDocs(query(collection(db, "pujas"))).then(snapshot => {
           console.log(snapshot.docs)
           snapshot.docs.map((doc) => {
               dict[key(doc.data().identificador)] = doc.data().cantidad
           })  
       });
        setPujas(dict)
    }

    useEffect(cargarProductos, [])
    useEffect(cargarPujas, [])
    return (
        <>
            <input placeholder="Filtrar por descripcion" value={descripcion} onChange={(e) => setDescripcion(e.target.value)}></input>
            <button onClick={cargarProductos}>Filtrar</button>
            {
                Productos != null && Productos.map((elem, idx) => {
                    return (
                        <div key={idx}>
                            <img src={elem.url}></img>
                            {
                                    <p>{elem.descripcion}</p>
                            }
                            <input type="number" value={pujas[key(elem.id)]}></input>
                            <p></p>
                            <button onClick={() => {
                                runTransaction(getFirestore(), async (transaction) => {
                                    const doc = await transaction.get(elem.ref)
                                    const db = getFirestore()
                                    transaction.update(collection(db, "pujas"), { cantidad: doc.data().cantidad  + 10, comprador: getAuth().currentUser.email })
                                }).then(cargarPujas)
                            }
                            }>Pujar</button>
                        </div>
                    )
                })
            }
        </>
    )
}

export default Productos