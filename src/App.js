import { useState, useEffect } from 'react';
import { db, auth } from "./firebaseConnection";
import { doc, setDoc, collection, addDoc, getDoc, getDocs, updateDoc, deleteDoc, onSnapshot } from 'firebase/firestore';
import './app.css';
import { async } from '@firebase/util';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged } from 'firebase/auth';

function App() {   
  const [idPost, setIdPost] = useState('');
  const [titulo, setTitulo] = useState('');
  const [autor, setAutor] = useState('');
  const [posts, setPosts] = useState([]);
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [user, setUser] = useState(false);
  const [userDetail, setUserDetail] = useState({});

  useEffect(() => {
    async function loadPosts(){
      const unsub = onSnapshot(collection(db, "posts"), (snapshot) => {

        let listaPosts = [];

        snapshot.forEach((doc) => {
            listaPosts.push({
            id: doc.id,
            titulo: doc.data().titulo,
            autor: doc.data().autor,
          })
      })

      setPosts(listaPosts);

      })
    }

    loadPosts();

  }, [])

  useEffect(() => {
    async function checkLogin(){
      onAuthStateChanged(auth, (user) => {
        if(user){
          setUser(true);
          setUserDetail({
            uid: user.uid,
            email: user.email
          })
        }else{
          setUser(false);
          setUserDetail({})
        }
      })
    }
    checkLogin()
  }, [])
  async function handleAdd(){

  //Id gerado de forma injetada:
  //   await setDoc(doc(db, "posts", "12345"), {
  //     titulo: titulo,
  //     autor: autor,
  //   })
  //   .then(() => {
  //     console.log("Dados registrados no Banco")
  //   })
  //   .catch((e) => console.log("Ocorreu erro: ", e))

    await addDoc(collection(db, "posts"), {
      titulo: titulo,
      autor: autor,
    })
    .then(() => {
      console.log("Dados registrados no banco com sucesso.")
      setAutor('')
      setTitulo('')
    })
    .catch((e) => console.log("Falha ao registrar dados no banco...", e))
  }

  async function buscarPost(){
    // const postRef = doc(db, "posts", "mkKI47c0rEAHyn9QpEjh")

    // await getDoc(postRef)
    // .then((snapshot) => {
    //   setAutor(snapshot.data().autor)
    //   setTitulo(snapshot.data().titulo)
    // })
    // .getDoc(() => console.log("Erro ao buscar"))
  
    const postsRef = collection(db, "posts")
    await getDocs(postsRef)
    .then((snapshot) => {

      let lista = [];

      snapshot.forEach((doc) => {
         lista.push({
          id: doc.id,
          titulo: doc.data().titulo,
          autor: doc.data().autor,
         })
      })

      setPosts(lista);
    })
    .catch((error) => {
      console.log("Deu algum erro ao buscar")
    })
  }

  async function editarPost(){
    const docRef = doc(db, "posts", idPost)

    await updateDoc(docRef, {
      titulo: titulo,
      autor: autor,
    })
    .then(() => {
      console.log("post atualizado")
      setIdPost('')
      setTitulo('')
      setAutor('')
    })
    .catch((err) => alert("Não foi possível atualizar este Post, o post não existe na base. " + err))

  }

  async function excluirPost(id){
    const docRef = doc(db, "posts", id)
    await deleteDoc(docRef)
    .then(() => {
      alert("Post deletado com sucesso!")
    })
    .catch((err) => {
      console.log("Não foi possível deletar o Post. " + err)
    })

  }

  async function novoUsuario(){
    await createUserWithEmailAndPassword(auth, email, senha)
    .then((value) => {
      console.log("Cadastrado com sucesso!")
      console.log(value)
      setEmail('')
      setSenha('')

    })
    .catch(() => {
      console.log("Erro ao cadastrar o usuário...")
    })
  }

  async function logarUsuario(){
    await signInWithEmailAndPassword(auth, email, senha)
    .then((value) => {
      console.log("Usuário logado com sucesso!")
      
      setUserDetail({
        uid: value.user.uid,
        email: value.user.email,
      })
      setUser(true);

      setEmail('')
      setSenha('')
    })
    .catch(() => {
      console.log("Erro ao fazer o login")
    })
  }

  async function fazerLogout(){

    await signOut(auth)
    .then(() => {
      setUser(false);
      setUserDetail({})
    })
    
  }

  return (
    <div>
      <h1>React js + Firebase :)</h1>

      {user && (
        <div>
          <strong>Seja bem vindo(a) (Você está logado(a)!)</strong>
          <br/>
          <span>ID: {userDetail.uid}</span>
          <br/>
          <span>E-mail: {userDetail.email}</span>
          <br/>
          <button onClick={fazerLogout}>Sair da conta</button>
          <br/>
          <br/>
        </div>
      )}

      <div className='container'>
        <h2>Usuários</h2>

          <label>Email: </label>
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Digite o seu e-mail..."
          />
          <br/><br/>
          <label>senha: </label>
          <input
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            placeholder="Informe a sua senha..."
          />
          <button onClick={novoUsuario}>Cadastrar</button>
          <button onClick={logarUsuario}>Fazer login</button>
      </div>

      <br/><br/>
      <hr/>

      <div className="container">
        <h2>Posts</h2>

        <label>Id do post:</label>
        <input 
          placeholder='Digite o id do post'
          value={idPost}
          onChange={ (e) => setIdPost(e.target.value)}/>
        <br></br>
        <label>Título:</label>
        <textarea 
          type="text"
          placeholder="digite o título"
          value={titulo}
          onChange={(e) => setTitulo(e.target.value)}
        />

        <label>Autor:</label>
        <input 
          type="text" 
          placeholder="Autor do post"
          value={autor}
          onChange={(e) => setAutor(e.target.value)}
        />

        <button onClick={handleAdd}>Cadastrar</button>

        <button onClick={buscarPost}>Buscar post</button>

        <button onClick={editarPost}>Atualizar post</button>
        <ul>
          {posts.map( (post) => {
            return(
              <li key={post.id}>
                <strong>ID: {post.id}</strong><br/>
                <span>Titulo: {post.titulo}</span><br/>
                <span>Autor: {post.autor}</span><br/>
                <button onClick={() => excluirPost(post.id)}>Excluir</button><br/><br/>
              </li>
            )
          })}
        </ul>
      </div>
    </div>
  );
}

export default App;
