import { getAuth } from "firebase/auth";
import { getFirestore, collection, getDocs, query, where, runTransaction, DocumentReference, deleteDoc } from "firebase/firestore";
import { deleteObject, getDownloadURL, getStorage, ref } from "firebase/storage";
import { useEffect, useState } from "react";

const Productos = () => {
    const [Productos, setProductos] = useState([])
    const [descripcion, setDescripcion] = useState("")
    const [pujas, setPujas] = useState([])

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

    const cargarPujas = () => {
        setPujas([])
        const db = getFirestore()
        getDocs(query(collection(db, "pujas"))).then(snapshot => {
            const storage = getStorage()
            snapshot.docs.map((doc) => {
                getDownloadURL(ref(storage, doc.id)).then((url) => {
                    setProductos((old) => [...old, { ...doc.data(), url: url, id: doc.id, ref: doc.ref }])
                })
            })
        }).catch(e => console.error(e))
    }
    useEffect(cargarProductos)
    useEffect(cargarPujas)

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
                            {getAuth().currentUser.uid == elem.autor &&
                                <input type="number" ></input> &&
                                <button onClick={async () => {
                                    runTransaction(getFirestore(), async (transaction) => {
                                        transaction.update(elem.ref, { descripcion: elem.descripcion })
                                    })
                                }}>Guardar cambios</button>}


                            <input type="number" ></input>
                            <p>Puja {elem.likes}</p>
                            <button onClick={() => {
                                runTransaction(getFirestore(), async (transaction) => {
                                    const doc = await transaction.get(elem.ref)
                                    transaction.update(elem.ref, { likes: doc.data().likes + 1 })
                                }).then(cargarProductos)
                            }
                            }>Pujar</button>
                            {getAuth().currentUser.uid == elem.autor &&
                                <button onClick={async () => {
                                    await deleteDoc(elem.ref);
                                    await deleteObject(ref(getStorage(), elem.id))
                                    cargarProductos()
                                }}>X</button>}
                            {getAuth().currentUser.uid == elem.autor &&
                                <button onClick={async () => {
                                    runTransaction(getFirestore(), async (transaction) => {
                                        transaction.update(elem.ref, { descripcion: elem.descripcion })
                                    })
                                }}>Guardar cambios</button>}

                        </div>
                    )
                })
            }
        </>
    )
}

export default Productos