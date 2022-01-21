import { getFirestore, collection, addDoc } from "firebase/firestore";

// https://firebase.google.com/docs/firestore/query-data/queries

const FireStoreExample = () => {

	return (
		<div>
			Hola mundo!
			<button onClick={async () => {
				const db = getFirestore()
				try {
					const docRef = await addDoc(collection(db, "prueba"), {
						first: "Ada",
						last: "Lovelace",
						born: 1815
					});
					console.log("Document written with ID: ", docRef.id);
				} catch (e) {
					console.error("Error adding document: ", e);
				}
			}}>
				Subir
			</button>
		</div>
	);
}

export default FireStoreExample