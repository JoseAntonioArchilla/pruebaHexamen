import { getAuth } from "firebase/auth";
import { getFirestore, collection, getDocs, query, where, runTransaction, DocumentReference, deleteDoc } from "firebase/firestore";
import { deleteObject, getDownloadURL, getStorage, ref } from "firebase/storage";
import { useEffect, useState } from "react";

const Productos = ({ Mias }) => {
    console.log(Mias)
    const [Productos, setProductos] = useState([])
    const [descripcion, setDescripcion] = useState("")
    const [hashtags, setHashtags] = useState("")

    const cargarProductos = () => {
        setProductos([])
        const db = getFirestore()
        getDocs(Mias ? query(collection(db, "productos"), where("autor", "==", getAuth().currentUser.uid)) : query(collection(db, "productos"))).then(snapshot => {
            const storage = getStorage()
            snapshot.docs.filter((doc) =>
                ((descripcion == "") || doc.data().descripcion.includes(descripcion)) &&
                ((hashtags == "") || hashtags.split(" ").every((item) => doc.data().descripcion.includes("#" + item)))
            ).map((doc) => {
                getDownloadURL(ref(storage, doc.id)).then((url) => {
                    setProductos((old) => [...old, { ...doc.data(), url: url, id: doc.id, ref: doc.ref }].sort((a, b) => b.likes - a.likes))
                })
            })
        }).catch(e => console.error(e))
    }

    useEffect(cargarProductos, [Mias])

    return (
        <>
            <input placeholder="Texto" value={descripcion} onChange={(e) => setDescripcion(e.target.value)}></input>
            <input placeholder="Hashtags separados por espacios" value={hashtags} onChange={(e) => setHashtags(e.target.value)}></input>
            <button onClick={cargarProductos}>Buscar</button>
            {
                Productos != null && Productos.map((elem, idx) => {
                    return (
                        <div key={idx}>
                            <img src={elem.url}></img>
                            {
                                getAuth().currentUser.uid == elem.autor ?
                                    <input value={Productos[idx].descripcion} onChange={(e) => {
                                        Productos[idx].descripcion = e.target.value
                                        setProductos([...Productos])
                                    }}></input> :
                                    <p>{elem.descripcion}</p>
                            }
                            <p>Likes {elem.likes}</p>
                            <button onClick={() => {
                                runTransaction(getFirestore(), async (transaction) => {
                                    const doc = await transaction.get(elem.ref)
                                    transaction.update(elem.ref, { likes: doc.data().likes + 1 })
                                }).then(cargarProductos)
                            }
                            }>❤️</button>
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