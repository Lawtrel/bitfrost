import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { getFirestore, doc, updateDoc } from "firebase/firestore";
import {app} from "./firebase"; // usa a mesma inicialização que você já tem

const storage = getStorage(app);
const db = getFirestore(app);

export async function uploadArquivo(file: File, valeId: string) {
  // Caminho do arquivo dentro do Storage
  const storageRef = ref(storage, `vales/${valeId}/${file.name}`);

  // Upload do arquivo
  await uploadBytes(storageRef, file);

  // Pega a URL pública
  const url = await getDownloadURL(storageRef);

  // Atualiza o Firestore adicionando a URL no documento do vale
  const valeRef = doc(db, "vales", valeId);
  await updateDoc(valeRef, { arquivoUrl: url });

  return url;
}
