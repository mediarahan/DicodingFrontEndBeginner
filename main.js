//fitur menambahkan data buku
//buat object buku
function createBook(title, author, year, isComplete) {
    return {
        id: +new Date(),
        title,
        author,
        year,
        isComplete,
    };
}

//untuk pembuatan card baru ketika input
function createBookElement(book) {
    const bookElement = document.createElement('article');
    bookElement.classList.add('book_item');

    const title = document.createElement('h3');
    title.textContent = book.title;
    bookElement.appendChild(title);

    const author = document.createElement('p');
    author.textContent = `Penulis: ${book.author}`;
    bookElement.appendChild(author);

    const year = document.createElement('p');
    year.textContent = `Tahun: ${book.year}`;
    bookElement.appendChild(year);

    const actionDiv = document.createElement('div');
    actionDiv.className = 'action';

    const toggleCompleteButton = document.createElement('button');
    toggleCompleteButton.className = 'green';
    toggleCompleteButton.textContent = book.isComplete ? 'Belum selesai dibaca' : 'Selesai dibaca';
    toggleCompleteButton.addEventListener('click', function () {
        toggleBookStatus(book);
    });
    actionDiv.appendChild(toggleCompleteButton);

    const deleteButton = document.createElement('button');
    deleteButton.className = 'red';
    deleteButton.textContent = 'Hapus buku';
    deleteButton.addEventListener('click', function () {
        deleteBook(book);
    });
    actionDiv.appendChild(deleteButton);

    bookElement.appendChild(actionDiv);

    return bookElement;
}


//ambil input dari field
const bookInput = document.getElementById('inputBook')

bookInput.addEventListener('submit', function (event) {
    event.preventDefault();

    const titleInput = document.getElementById('inputBookTitle').value;
    const authorInput = document.getElementById('inputBookAuthor').value;
    const yearInput = parseInt(document.getElementById('inputBookYear').value);
    const isCompleteInput = document.getElementById('inputBookIsComplete').checked;

    const bookObject = createBook(titleInput, authorInput, yearInput, isCompleteInput)
    books.push(bookObject);
    displayBook(bookObject);
    saveBooks();
});


//fitur 2 rak buku
const incompleteBookshelf = document.getElementById('incompleteBookshelfList');
const completeBookshelf = document.getElementById('completeBookshelfList');

let books = [];

function displayBook(book) {
    const bookElement = createBookElement(book);
    if (book.isComplete) {
        completeBookshelf.appendChild(bookElement);
    } else {
        incompleteBookshelf.appendChild(bookElement);
    }
}

//fitur menambahkan buku antar rak
function toggleBookStatus(book) {
    book.isComplete = !book.isComplete;
    saveBooks();
    updateBookDisplay();
}

//fitur menghapus data buku
function deleteBook(book) {
    if (confirm(`Are you sure you want to delete "${book.title}" by ${book.author}?`)) {
        for (let i = 0; i < books.length; i++) {
            if (books[i].id === book.id) {
                books.splice(i, 1);
                break;
            }
        }
        saveBooks();
        updateBookDisplay();
    }
}

//local storage
function isStorageAvailable() {
    if (typeof (Storage) === undefined) {
        alert('Browser Anda tidak mendukung local storage.');
        return false;
    }
    return true;
}

function initializeBooks() {
    books = getBooksFromStorage();
    updateBookDisplay();
}

function updateBookDisplay() {
    incompleteBookshelf.innerHTML = '';
    completeBookshelf.innerHTML = '';
    books.forEach(book => displayBook(book));
}

function saveBooks() {
    if (isStorageAvailable('localStorage')) {
        localStorage.setItem('books', JSON.stringify(books));
    }
}

function getBooksFromStorage() {
    if (isStorageAvailable('localStorage')) {
        const storedBooks = localStorage.getItem('books');
        return storedBooks ? JSON.parse(storedBooks) : [];
    }
    return [];
}

//fitur search
const searchInput = document.getElementById('searchBook');

searchInput.addEventListener('submit', function (event) {
    event.preventDefault();

    const searchQuery = document.getElementById('searchBookTitle').value;
    const filteredBooks = [];

    for (let i = 0; i < books.length; i++) {
        const book = books[i];
        if (book.title.toLowerCase().includes(searchQuery)) {
            filteredBooks.push(book);
        }
    }

    incompleteBookshelf.innerHTML = '';
    completeBookshelf.innerHTML = '';
    filteredBooks.forEach(book => displayBook(book));
});

document.addEventListener('DOMContentLoaded', initializeBooks);
