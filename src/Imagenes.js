import { getAuth } from "firebase/auth";
import { getFirestore, collection, getDocs, query, where, runTransaction, DocumentReference, deleteDoc } from "firebase/firestore";
import { deleteObject, getDownloadURL, getStorage, ref } from "firebase/storage";
import { useEffect, useState } from "react";

const Imagenes = ({ Mias }) => {
	console.log(Mias)
	const [Imagenes, setImagenes] = useState([])
	const [descripcion, setDescripcion] = useState("")
	const [hashtags, setHashtags] = useState("")

	const cargarImagenes = () => {
		setImagenes([])
		const db = getFirestore()
		getDocs(Mias ? query(collection(db, "imagenes"), where("autor", "==", getAuth().currentUser.uid)) : query(collection(db, "imagenes"))).then(snapshot => {
			const storage = getStorage()
			snapshot.docs.filter((doc) => 			
				((descripcion == "") || doc.data().descripcion.includes(descripcion)) &&
				((hashtags == "") || hashtags.split(" ").every((item) => doc.data().descripcion.includes("#" + item)))
			).map((doc) => {
				getDownloadURL(ref(storage, doc.id)).then((url) => {
					setImagenes((old) => [...old, { ...doc.data(), url: url, id: doc.id, ref: doc.ref }].sort((a, b) => b.likes - a.likes))
				})
			})
		}).catch(e => console.error(e))
	}

	useEffect(cargarImagenes, [Mias])

	return (
		<>
			<input placeholder="Texto" value={descripcion} onChange={(e) => setDescripcion(e.target.value)}></input>
			<input placeholder="Hashtags separados por espacios" value={hashtags} onChange={(e) => setHashtags(e.target.value)}></input>
			<button onClick={cargarImagenes}>Buscar</button>
			{
				Imagenes != null && Imagenes.map((elem, idx) => {
					return (
						<div key={idx}>
							<img src={elem.url}></img>
							{
								getAuth().currentUser.uid == elem.autor ?
									<input value={Imagenes[idx].descripcion} onChange={(e) => {
										Imagenes[idx].descripcion = e.target.value
										setImagenes([...Imagenes])
									}}></input> :
									<p>{ elem.descripcion }</p>
							}
							<p>Likes {elem.likes}</p>
							<button onClick={() => {								 
								runTransaction(getFirestore(), async (transaction) => {
									const doc = await transaction.get(elem.ref)
									transaction.update(elem.ref, { likes: doc.data().likes + 1 })
								}).then(cargarImagenes)
							}
							}>❤️</button>
							{getAuth().currentUser.uid == elem.autor && 
								<button onClick={async () => {
									await deleteDoc(elem.ref);
									await deleteObject(ref(getStorage(), elem.id))
									cargarImagenes()
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

export default Imagenes