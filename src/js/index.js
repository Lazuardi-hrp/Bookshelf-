import { 
   getBookFromLocal, addBookToLocal, deleteBook, changeBookStatusById, renderBooksByStatus, addToast, searchBookFromLocal } from "./book.js";

// Elemen yang sering digunakan
const bookListContainer = document.getElementById("book-list");
const addBookButton = document.getElementById("add-book-button");
const unreadTab = document.getElementById("unread");
const readTab = document.getElementById("read");
const bookForm = document.getElementById("book-form");
const modal = document.getElementById("exampleModal");
const searchInput = document.querySelector(".form-control.rounded-pill");

// Fungsi untuk memuat buku berdasarkan tab yang dipilih
const loadBooks = (keyword = "") => {
   const isComplete = readTab.checked;
   const books = keyword 
      ? searchBookFromLocal(keyword, isComplete)
      : getBookFromLocal().filter(book => book.isComplete === isComplete);
   renderBooksByStatus(isComplete, bookListContainer, books);
};

// Fungsi untuk mereset form modal
const resetForm = () => {
   bookForm.reset();
   document.getElementById("new-book-unread").checked = true;
};

// Event Listener untuk tombol tambah buku
addBookButton.addEventListener("click", () => {
   const title = document.getElementById("book-title").value;
   const author = document.getElementById("book-author").value;
   const year = document.getElementById("book-year").value;
   const isComplete = document.getElementById("new-book-read").checked;

   if (title && author && year) {
      const newBook = {
         id: +new Date(),
         title,
         author,
         year,
         isComplete,
      };

      addBookToLocal(newBook);
      loadBooks();
      addToast("success", "Buku berhasil ditambahkan!");

      // Tutup modal dan reset form
      const bootstrapModal = bootstrap.Modal.getInstance(modal);
      bootstrapModal.hide();
      resetForm();
   } else {
      addToast("warn", "Mohon lengkapi semua data buku!");
   }
});

// Event Listener untuk tab (status buku)
unreadTab.addEventListener("change", () => loadBooks(searchInput.value));
readTab.addEventListener("change", () => loadBooks(searchInput.value));

// Event Listener untuk tombol pada elemen buku
bookListContainer.addEventListener("click", (e) => {
   const deleteButton = e.target.closest(".delete-button");
   const switchButton = e.target.closest(".switch-button");

   if (deleteButton) {
      const id = parseInt(deleteButton.dataset.id, 10);
      deleteBook(id);
      loadBooks(searchInput.value);
      addToast("success", "Buku berhasil dihapus!");
   }

   if (switchButton) {
      const id = parseInt(switchButton.dataset.id, 10);
      changeBookStatusById(id);
      loadBooks(searchInput.value);
      addToast("success", "Status buku berhasil diubah!");
   }
});

// Event Listener untuk pencarian buku
searchInput.addEventListener("keyup", () => loadBooks(searchInput.value));

// Event Listener untuk menutup modal dan reset form
modal.addEventListener('hidden.bs.modal', resetForm);

// Load awal
loadBooks();