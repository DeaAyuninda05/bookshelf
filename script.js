const bookSubmit = [];
const RENDER_EVENT = 'render-book';
const STORAGE_KEY = 'BOOK_APPS';
const BOOK_ITEMID = 'itemId';
const SAVED_EVENT = "saved-book";

document.addEventListener('DOMContentLoaded', function () {
  const submitForm = document.getElementById('inputBook');
  submitForm.addEventListener('submit', function (event) {
      event.preventDefault();
      inputBook();
  });
  if (isStorageExist()) {
      loadDataFromStorage();
  }
});

function isStorageExist() {
  if (typeof (Storage) === undefined) {
      alert('Browser kamu tidak mendukung local storage');
      return false;
  }
  return true;
}

function saveData() {
  if (isStorageExist()) {
      const parsed = JSON.stringify(bookSubmit);
      localStorage.setItem(STORAGE_KEY, parsed);
      document.dispatchEvent(new Event(SAVED_EVENT));
  }
}
document.addEventListener(SAVED_EVENT, function(){
  console.log(localStorage.getItem(STORAGE_KEY));
});

function loadDataFromStorage(){
  const serializeData = localStorage.getItem(STORAGE_KEY);
  let data = JSON.parse(serializeData);

  if(data !== null){
      for(const book of data ){
          bookSubmit.push(book);
      }
  }
  document.dispatchEvent(new Event(RENDER_EVENT));
}

function inputBook() {
  const judulBuku = document.getElementById('inputBookTitle').value;
  const penulisBuku = document.getElementById('inputBookAuthor').value;
  const tahunTerbit = document.getElementById('inputBookYear').value;
  const isCompleted = document.getElementById('inputBookIsComplete').checked;
  const generatedID = generateId();
  const bookObject = generateBookObject(generatedID, judulBuku, penulisBuku, tahunTerbit, isCompleted);
  bookSubmit.push(bookObject);
 
  document.dispatchEvent(new Event(RENDER_EVENT));
}

function generateId() {
  return +new Date();
}
 
function generateBookObject(id, title, author, year, isCompleted) {
  return {
    id,
    title,
    author,
    year,
    isCompleted
  }
}
document.addEventListener(RENDER_EVENT, function (){
  console.log(bookSubmit);
});

function makeBook(book_shelf) {
  const {id, title, author, year, isCompleted} = book_shelf;

  const textTitle = document.createElement('h3');
  textTitle.innerHTML = title;
 
  const textAuthor = document.createElement('p');
  textAuthor.innerHTML = "Penulis : " + author;

  const textYear = document.createElement('p');
  textYear.innerHTML = "Tahun terbit : " + year;

  const textContainer = document.createElement("div");
  textContainer.classList.add("container");
  textContainer.append(textTitle, textAuthor, textYear);
  const bookContainer = document.createElement("section");
  bookContainer.setAttribute('id', `book-${id}`);
  bookContainer.append(textContainer);
 
  if(isCompleted){

    const undoButton = document.createElement('button');
    undoButton.innerText = "Belum Selesai Dibaca";
    undoButton.classList.add('Green');
    undoButton.addEventListener('click', function(){
        undoBookIsCompleted(id);
    });

    const removeButton = document.createElement('button');
    removeButton.innerText = "Hapus Buku";
    removeButton.classList.add('Red');
    removeButton.addEventListener('click', function(){
        removeBookIsCompleted(id);
    });
    bookContainer.append(undoButton,removeButton);
  }
  else{
    const completeButton = document.createElement('button');
    completeButton.innerText = "Selesai Dibaca";
    completeButton.classList.add('Green');
    completeButton.addEventListener('click', function(){
        addBookIsCompleted(id);
    });

    const removeButton = document.createElement('button');
    removeButton.innerText = "Hapus Buku";
    removeButton.classList.add('Red');
    removeButton.addEventListener('click', function(){
        removeBookIsCompleted(id);
    });    
    bookContainer.append(completeButton,removeButton);
  }
  return bookContainer;
  }

document.addEventListener(RENDER_EVENT, function () {
  const incompleteBook = document.getElementById('incompleteBookshelfList');
  incompleteBook.innerHTML = '';
  const completeBook = document.getElementById('completeBookshelfList');
  completeBook.innerHTML = '';

  for (const book_shelf of bookSubmit) {
    const bookElement = makeBook(book_shelf);
    if (book_shelf.isCompleted) {
      completeBook.append(bookElement);
    } else {
      incompleteBook.append(bookElement);
    }
  }
  return 1

});

function addBookIsCompleted (bookId) {
  const bookTarget = findBook(bookId);
 
  if (bookTarget == null) return;
 
  bookTarget.isCompleted = true;
 
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData(bookSubmit);
}
 
function findBook(bookId) {
  for (const makeBook of bookSubmit) {
    if (makeBook.id === bookId) {
      return makeBook;
    }
  }
  return null;
}
 
function removeBookIsCompleted(bookId) {
  const bookTarget = findBookIndex(bookId);
 
  if (bookTarget === -1) return;
 
  bookSubmit.splice(bookTarget, 1);
 
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}
 
function undoBookIsCompleted(bookId) {
  const bookTarget = findBook(bookId);
 
  if (bookTarget == null) return;
 
  bookTarget.isCompleted = false;
 
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}
 
function findBookIndex(bookId) {
  for (const index in bookSubmit) {
    if (bookSubmit[index].id === bookId) {
      return index;
    }
  }
 
  return -1;
}
 
incompleteBookshelfList.innerHTML = '';
completeBookshelfList.innerHTML = '';

const INCOMPLETED_LIST_BOOK_ID = 'incompleteBookshelfList';
const COMPLETED_LIST_BOOK_ID = 'completeBookshelfList';

document.getElementById('searchBook').addEventListener("submit", function (event){
  event.preventDefault();
  const searchBook = document.getElementById('searchBookTitle').value.toLowerCase();
  const bookList = document.querySelectorAll('.container > h3');
  for (book of bookList) {
    if (book.innerText.toLowerCase().includes(searchBook)) {
  book.parentElement.parentElement.style.display = "block";
  } 
  else {
  book.parentElement.parentElement.style.display = "none";
  }
  }
  })
