import {initializeApp} from "firebase/app"
import {GoogleAuthProvider, getAuth, signInWithPopup, onAuthStateChanged, signOut} from "firebase/auth"
import {getFirestore, collection, getDoc, getDocs, setDoc, doc, deleteDoc, updateDoc, arrayUnion} from "firebase/firestore"
import uniqid from "uniqid"
// import './styles.css';

let userId = ""
let myLibrary = [];

const firebaseConfig = {
  apiKey: "AIzaSyCSJ55bgo1XqUM_skdRzXJdY25SlCj2jmc",
  authDomain: "to-do-app-41067.firebaseapp.com",
  projectId: "to-do-app-41067",
  storageBucket: "to-do-app-41067.appspot.com",
  messagingSenderId: "163156191604",
  appId: "1:163156191604:web:99576d5b97e41b6e85a421"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const provider = new GoogleAuthProvider();

const auth = getAuth();

const db = getFirestore(app);



let firebaseArray = []
let token

async function getFirebaseData(id) {
  try {
  console.log(id)
  const docRef = doc(db, "Users", id)
  const docSnap = await getDoc(docRef);
  const data = docSnap.data()
  myLibrary = JSON.parse(data.Books)
  createCard();

  }
  catch(error) {
    console.log(error)
  }
}





const signIn = document.getElementById('signIn')
const form1 = document.getElementById('form1')
const form2 = document.getElementById('form2')
const main = document.querySelector('main')
const books = document.querySelector('#books')
const addBook = document.getElementById('addBook')

const inputTitle1 = document.getElementById('title1')
const inputAuthor1 = document.getElementById('author1')
const inputYearOfPub1 = document.getElementById('yearOfPublication1')
const inputEdition1 = document.getElementById('edition1')
const inputPublisher1 = document.getElementById('publisher1')
const inputPlaceOfPub1 = document.getElementById('placeOfPublication1')

const inputTitle2 = document.getElementById('title2')
const inputAuthor2 = document.getElementById('author2')
const inputYearOfPub2 = document.getElementById('yearOfPublication2')
const inputEdition2 = document.getElementById('edition2')
const inputPublisher2 = document.getElementById('publisher2')
const inputPlaceOfPub2 = document.getElementById('placeOfPublication2')

const exitBtn1 = document.getElementById('exit1')
const exitBtn2 = document.getElementById('exit2')
const signInBtn = document.createElement('button')
const header = document.querySelector('header')
signInBtn.setAttribute('class', 'login')
signInBtn.setAttribute('id', 'signIn')
signInBtn.textContent = 'Login'
const loggedIn = document.createElement('div')
loggedIn.setAttribute('class', 'loggedIn')
const userPhoto = document.createElement('img')
userPhoto.setAttribute('class', 'userPhoto')

const signOutBtn = document.createElement('div')

signOutBtn.setAttribute('class', 'signOut')
signOutBtn.textContent = "Sign Out"
signOutBtn.addEventListener('click', () => {
    signOut(auth).then(() => {
        // Sign-out successful.
      }).catch((error) => {
        // An error happened.
      });
      while (books.firstChild) {
        books.removeChild(books.firstChild);
    }
})

async function createUserDataInFirebase(uid) {
  try {
    await setDoc(doc(db, "Users", uid), {
      Books : []
    })
  }
  catch {

  }
}

onAuthStateChanged(auth, (user) => {
    if (user) {
      //user is signed in
      const uid = user.uid
      userId = uid
      changeLoginStatus(user)
      const token = user.getIdToken()
      

      getFirebaseData(uid)

    } else {
      // User is signed out
      // ...
      loggedIn.style.display = "none"
      signInBtn.style.display = "block"
      console.log("logged out")
      header.appendChild(signInBtn)
    }
  });

function changeLoginStatus(user) {
  signInBtn.style.background = user.photoUrl
      signInBtn.style.display = 'none'
      userPhoto.src = user.photoURL
      loggedIn.appendChild(userPhoto)
      loggedIn.appendChild(signOutBtn)
      console.log('logged in')
      header.appendChild(loggedIn)
      loggedIn.style.display = "flex"

}

signInBtn.addEventListener('click', () => {
    signInWithPopup(auth, provider)
  .then((result) => {
    // This gives you a Google Access Token. You can use it to access the Google API.
    const credential = GoogleAuthProvider.credentialFromResult(result);
    // The signed-in user info.
    const user = result.user;
    // IdP data available using getAdditionalUserInfo(result)
    // ...
  }).catch((error) => {
    // Handle Errors here.
    const errorCode = error.code;
    const errorMessage = error.message;
    // The email of the user's account used.
    // The AuthCredential type that was used.
    const credential = GoogleAuthProvider.credentialFromError(error);
    // ...
  });

})


exitBtn1.addEventListener('click', (e) => {
    e.preventDefault();
    closeForm1();
})
exitBtn2.addEventListener('click', (e) => {
    e.preventDefault();
    closeForm2();
})
addBook.addEventListener('click', (e) => {
  e.preventDefault();
  openForm();
})
form1.addEventListener('submit', (e) => {
  e.preventDefault();
  addInfo(); closeForm1(); createCard();
})


function openForm() {
    form1.style.display = "block";
    inputTitle1.value = ""
    inputAuthor1.value = ""
    inputYearOfPub1.value = ""
    inputEdition1.value = ""
    inputPublisher1.value = ""
    inputPlaceOfPub1.value = ""
    inputTitle1.focus()
}

function addBookToLibrary (n) {
    myLibrary.unshift(n)
}

function closeForm1() {
    form1.style.display = "none";
}

function closeForm2() {
    form2.style.display = "none";
}


class createBook1 {
    constructor (inputTitle1, inputAuthor1, inputYearOfPub1, inputEdition1, inputPublisher1, inputPlaceOfPub1, id) {
        this.title = inputTitle1
        this.author = inputAuthor1
        this.year = inputYearOfPub1
        this.edition = inputEdition1
        this.publisher = inputPublisher1
        this.place = inputPlaceOfPub1
        this.id = id
    }
}



async function addInfo () {
    
  const id = uniqid()
  const newBook1 = new createBook1(inputTitle1.value, inputAuthor1.value, inputYearOfPub1.value, inputEdition1.value, inputPublisher1.value, inputPlaceOfPub1.value, id)

  addBookToLibrary(newBook1)
  await updateDoc(doc(db, "Users", userId), {
    Books: arrayUnion(JSON.stringify(myLibrary))
  });
}
    
function createCard() {

    while (books.firstChild) {
        books.removeChild(books.firstChild);
    }

    for(let i = 0; i < myLibrary.length; i++) {
    const book = document.createElement('div')
    book.classList.add("book","animate__animated", "animate__backInLeft" )
    book.setAttribute('data-number', `${[i]}`)
    book.setAttribute('data-id', `${[myLibrary[i].id]}`)
 
    const titleItalics = document.createElement('i')
    const title = document.createElement('div')
    title.setAttribute('class','title')
    title.appendChild(titleItalics)
    titleItalics.textContent = myLibrary[i].title

    const author = document.createElement('div')
    author.setAttribute('class','author')
    author.textContent = myLibrary[i].author

    const yearOfPub = document.createElement('div')
    yearOfPub.setAttribute('class','yearOfPublication')
    yearOfPub.textContent = myLibrary[i].year

    const edition = document.createElement('div')
    edition.setAttribute('class','edition')
    edition.textContent = myLibrary[i].edition

    const publisher = document.createElement('div')
    publisher.setAttribute('class','publisher')
    publisher.textContent = myLibrary[i].publisher

    const placeOfPub = document.createElement('div')
    placeOfPub.setAttribute('class','placeOfPublication')
    placeOfPub.textContent = myLibrary[i].place

    const btns = document.createElement('div')
    btns.setAttribute('class', 'btns')

    const deleteCardBtn = document.createElement('button')
    deleteCardBtn.addEventListener('click', (e) => {
      deleteCard(e);
    })
    deleteCardBtn.setAttribute('class', 'btn delete')
    deleteCardBtn.setAttribute('id', 'delete')
    deleteCardBtn.setAttribute('data-attribute', `${[i]}`)

    
    

    const citation = document.createElement('button')
    citation.textContent = 'C';
    citation.setAttribute('class', 'btn cite')
    citation.addEventListener('click', (e) => {
      citeThis(e);
    })

    const edit = document.createElement('button')
    edit.textContent = 'E';
    edit.setAttribute('class', 'btn edit')
    edit.addEventListener('click', (e) => {
      openEdit(e);
    })
    
    
    btns.appendChild(deleteCardBtn)
    btns.appendChild(citation)
    btns.appendChild(edit)

    book.appendChild(btns)
    book.appendChild(title)
    book.appendChild(author)
    book.appendChild(yearOfPub)
    book.appendChild(edition)
    book.appendChild(publisher)
    book.appendChild(placeOfPub)

    books.appendChild(book)
    
    
    }
}


async function deleteCard(event){

const deletebtn = event.currentTarget.parentNode.parentNode
deletebtn.remove()
myLibrary.splice(deletebtn.dataset.number, 1)
await deleteDoc(doc(db, "Books", deletebtn.dataset.id))
createCard()
}


function citeThis(event) {
   const bookDiv =  event.currentTarget.parentNode.parentNode
   let bookTitle = bookDiv.querySelector('.title').innerHTML
   let bookAuthor = bookDiv.querySelector('.author').textContent
   let bookYearOfPub = bookDiv.querySelector('.yearOfPublication').textContent
   let bookEdition = bookDiv.querySelector('.edition').textContent
   let bookPublisher = bookDiv.querySelector('.publisher').textContent
   let bookPlaceOfPub = bookDiv.querySelector('.placeOfPublication').textContent

   let harvardRefference = "";
   if( bookAuthor != "") {
    harvardRefference = bookAuthor
   }  if(bookYearOfPub != "") {
    harvardRefference = harvardRefference + " (" + bookYearOfPub + ") "
   }  if( bookTitle != "") {
    harvardRefference = harvardRefference + bookTitle + ", "
   }  if(bookEdition != "") {
    harvardRefference = harvardRefference + bookEdition + ", "
   }  if(bookPublisher != "") {
    harvardRefference = harvardRefference + bookPublisher + ", "
   } if(bookPlaceOfPub != ""){
    harvardRefference = harvardRefference + bookPlaceOfPub + "."
   }
    try {
    
    const blobInput = new Blob([harvardRefference], {type: 'text/html'});
    const clipboardItemInput = new ClipboardItem({'text/html' : blobInput});
    navigator.clipboard.write([clipboardItemInput]);
  } catch(e) {
    alert('copy failed!')
    console.log(e);
  } alert('Copied!')
}

class createBook2 {
    constructor (inputTitle2, inputAuthor2, inputYearOfPub2, inputEdition2, inputPublisher2, inputPlaceOfPub2) {
        this.title = inputTitle2
        this.author = inputAuthor2
        this.year = inputYearOfPub2
        this.edition = inputEdition2
        this.publisher = inputPublisher2
        this.place = inputPlaceOfPub2
    }
}

form2.addEventListener('submit', (e) => {
    e.preventDefault();
  })

function openEdit(event) {
    const target = event.currentTarget.parentNode.parentNode
    let bookTitle = target.querySelector('.title').textContent
    let bookAuthor = target.querySelector('.author').textContent
    let bookYearOfPub = target.querySelector('.yearOfPublication').textContent
    let bookEdition = target.querySelector('.edition').textContent
    let bookPublisher = target.querySelector('.publisher').textContent
    let bookPlaceOfPub = target.querySelector('.placeOfPublication').textContent;
 
     form2.style.display = "block";
     inputTitle2.value = bookTitle;
     inputAuthor2.value = bookAuthor;
     inputYearOfPub2.value = bookYearOfPub;
     inputEdition2.value = bookEdition;
     inputPublisher2.value = bookPublisher;
     inputPlaceOfPub2.value = bookPlaceOfPub;
    
     
      form2.addEventListener('submit', () => {
        console.log(target.dataset.number)
        const newBook2 = new createBook2(inputTitle2.value, inputAuthor2.value, inputYearOfPub2.value, inputEdition2.value, inputPublisher2.value, inputPlaceOfPub2.value)
        myLibrary.splice(target.dataset.number, 1, newBook2);
        editInfo(target.dataset.id)
        createCard();
        closeEditForm();
      },{once: true})
 }
 async function editInfo(id) {
  await setDoc(doc(db, "Books", id), {
    title: inputTitle2.value,
    author: inputAuthor2.value,
    year: inputYearOfPub2.value,
    edition: inputEdition2.value,
    publisher: inputPublisher2.value,
    place: inputPlaceOfPub2.value,
    id:id
  })
 }
 function closeEditForm() {
    form2.style.display = 'none'
 }

    

    


   

    

