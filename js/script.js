/**
 * [
 *    {
 *      id: <int>
 *      judul: <string>
 *      penulis: <string>
 *      isCompleted: <boolean>
 *    }
 * ]
 */

const books = [];
const RENDER_EVENT = "render-book";

function generateId() {
  return;
}

function generateBookObject(id, judul, penulis, isCompleted) {
  return {
    id,
    judul,
    penulis,
    isCompleted,
  };
}

function findBook(bookid) {
  for (bookitem of books) {
    if (bookitem.id === bookid) {
      return bookitem;
    }
  }
  return null;
}

function findBookIndex(bookid) {
  for (index in books) {
    if (books[index].id === bookid) {
      return index;
    }
  }
  return -1;
}

function makeBook(bookObject) {
  const { id, judul, penulis, isCompleted } = bookObject;

  const textTitle = document.createElement("h2");
  textTitle.innerText = judul;

  const textAuthor = document.createElement("h4");
  textAuthor.innerText = penulis;

  const textContainer = document.createElement("div");
  textContainer.classList.add("inner");
  textContainer.append(textTitle, textAuthor);

  const container = document.createElement("div");
  container.classList.add("item", "shadow");
  container.append(textContainer);
  container.setAttribute("id", `book-${id}`);

  if (isCompleted) {
    const undoButton = document.createElement("button");
    undoButton.classList.add("undo-button");
    undoButton.addEventListener("click", function () {
      undoJudulFromCompleted(id);
    });

    const trashButton = document.createElement("button");
    trashButton.classList.add("trash-button");
    trashButton.addEventListener("click", function () {
      removeJudulFromCompleted(id);
    });

    container.append(undoButton, trashButton);
  } else {
    const checkButton = document.createElement("button");
    checkButton.classList.add("check-button");
    checkButton.addEventListener("click", function () {
      addJudulToCompleted(id);
    });

    container.append(checkButton);
  }

  return container;
}

function addBook() {
  const textBook = document.getElementById("title").value;
  const textJudul = document.getElementById("author").value;

  const generatedID = generateId();
  const bookObject = generateBookObject(generatedID, textBook, textJudul, false);
  books.push(bookObject);

  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

function addJudulToCompleted(bookid /* HTMLELement */) {
  const bookTarget = findBook(bookid);
  if (bookTarget == null) return;

  bookTarget.isCompleted = true;
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

function removeJudulFromCompleted(bookid /* HTMLELement */) {
  const bookTarget = findBookIndex(bookid);
  if (bookTarget === -1) return;
  books.splice(bookTarget, 1);

  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

function undoJudulFromCompleted(bookid /* HTMLELement */) {
  const bookTarget = findBook(bookid);
  if (bookTarget == null) return;

  bookTarget.isCompleted = false;
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

document.addEventListener("DOMContentLoaded", function () {
  const simpanForm /* HTMLFormElement */ = document.getElementById("form");

  simpanForm.addEventListener("submit", function (event) {
    event.preventDefault();
    addBook();
  });
});

document.addEventListener(RENDER_EVENT, function () {
  const uncompletedBOOKList = document.getElementById("books");
  const listCompleted = document.getElementById("completed-books");

  // clearing list item
  uncompletedBOOKList.innerHTML = "";
  listCompleted.innerHTML = "";

  for (bookitem of books) {
    const bookElement = makeBook(bookitem);
    if (bookitem.isCompleted) {
      listCompleted.append(bookElement);
    } else {
      uncompletedBOOKList.append(bookElement);
    }
  }
});

function saveData() {
  if (isStorageExist()) {
    const parsed = JSON.stringify(books);
    localStorage.setItem(STORAGE_KEY, parsed);
    document.dispatchEvent(new Event(SAVED_EVENT));
  }
}

const SAVED_EVENT = "saved-book";
const STORAGE_KEY = "BOOK_APPS";

function isStorageExist() /* boolean */ {
  if (typeof Storage === undefined) {
    alert("Browser kamu tidak mendukung local storage");
    return false;
  }
  return true;
}

document.addEventListener(SAVED_EVENT, function () {
  console.log(localStorage.getItem(STORAGE_KEY));
});

function loadDataFromStorage() {
  const serializedData = localStorage.getItem(STORAGE_KEY);
  let data = JSON.parse(serializedData);

  if (data !== null) {
    for (const book of data) {
      books.push(book);
    }
  }

  document.dispatchEvent(new Event(RENDER_EVENT));
}

document.addEventListener("DOMContentLoaded", function () {
  // ...
  if (isStorageExist()) {
    loadDataFromStorage();
  }
});
