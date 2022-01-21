import { getAuth } from "firebase/auth";
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";
import { useEffect, useState } from "react";

const ImageUploader = () => {

	const [imageLink, setImageLink] = useState(null)

	useEffect(() => {
		loadImage()
	})

	const loadImage = () => {
		const storage = getStorage();
		getDownloadURL(ref(storage, 'foto_de_' + getAuth().currentUser.uid)).then((url) => {
			setImageLink(url)
		}).catch((e) => console.error(e))
	}

	const uploadImage = (e) => {
		const file = e.target.files[0]

		const storage = getStorage();
		
		const storageRef = ref(storage, 'foto_de_' + getAuth().currentUser.uid);

		uploadBytes(storageRef, file).then((snapshot) => {			
			console.log('Uploaded a blob or file! ', snapshot.metadata.fullPath);
			loadImage()
		}).catch((e) => console.error(e));		
	}

	return (
		<>
		<input type="file" onChange={uploadImage}></input>
		{ imageLink != null && <img src={imageLink}></img> }
		</>
	)
}

export default ImageUploader