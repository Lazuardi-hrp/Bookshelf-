const LOCAL_BOOK = "book_list"; // Kunci localStorage untuk menyimpan daftar buku

/**
 * Mendapatkan daftar buku dari localStorage.
 * @returns {Array} Daftar buku dalam format JSON.
 */
export const getBookFromLocal = () => {
   return JSON.parse(localStorage.getItem(LOCAL_BOOK)) || [];
};

export const searchBookFromLocal = (word, isComplete) => {
   const bookData = getBookFromLocal();
   const keyword = word.toLowerCase();
   return bookData.filter(book => 
      book.title.toLowerCase().includes(keyword) && book.isComplete === isComplete
   );
};

// Fungsi Toast
export const addToast = (status, message, duration = 3000) => {
   const statusClass = (status === "warn") ? "bg-danger" : "bg-success";

   const toastElement = `
      <li class="mb-1 animate-rightToLeft">
         <div class="px-5 py-3 ${statusClass} text-white rounded shadow-lg w-60 text-sm">
            ${message}
         </div>
      </li>
   `;

   const toastList = document.getElementById("toast-list");
   toastList.insertAdjacentHTML("beforeend", toastElement);

   const toast = toastList.lastElementChild;

   setTimeout(() => {
      toast.remove();
   }, duration);
};

/**
 * Menyimpan daftar buku ke localStorage.
 * @param {Array} data Data buku yang akan disimpan.
 */
export const setBookToLocal = (data) => {
   localStorage.setItem(LOCAL_BOOK, JSON.stringify(data));
};

/**
 * Menambahkan buku baru ke localStorage.
 * @param {Object} data Buku yang akan ditambahkan.
 */
export const addBookToLocal = (data) => {
   const books = getBookFromLocal();
   books.push(data);
   setBookToLocal(books);
};

/**
 * Menghapus buku berdasarkan ID.
 * @param {number} id ID buku yang akan dihapus.
 */
export const deleteBook = (id) => {
   const books = getBookFromLocal().filter(book => book.id !== id);
   setBookToLocal(books);
};

/**
 * Mengubah status buku (sudah dibaca atau belum) berdasarkan ID.
 * @param {number} id ID buku yang akan diubah statusnya.
 */
export const changeBookStatusById = (id) => {
   const books = getBookFromLocal();
   const updatedBooks = books.map(book => {
      if (book.id === id) {
         book.isComplete = !book.isComplete;
      }
      return book;
   });
   setBookToLocal(updatedBooks);
};

/**
 * Membuat elemen buku dalam format HTML.
 * @param {Object} book Objek buku.
 * @returns {string} Elemen HTML untuk buku.
 */
export const createBookElement = (book) => {
   return `
      <li class="my-3" data-bookid="${book.id}" data-testid="bookItem">
         <div class="p-3 shadow-sm rounded w-50 d-flex justify-content-between align-items-center bg-white" style="margin-left: 252px; height:80px">
            <div>
               <h5 class="mb-1 text-dark" data-testid="bookItemTitle">${book.title}</h5>
               <p class="mb-0 text-secondary" data-testid="bookItemAuthor">${book.author}</p>
               <p class="mb-0 text-secondary" data-testid="bookItemYear">${book.year}</p>
            </div>
            <div>
               <button data-id="${book.id}" class="btn btn-sm btn-outline-success me-2 switch-button" data-testid="bookItemIsCompleteButton">
                  ${book.isComplete ? "Belum Dibaca" : "Sudah Dibaca"}
               </button>
               <button data-id="${book.id}" class="btn btn-sm btn-danger delete-button" data-testid="bookItemDeleteButton">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                     <path fill="#fff" fill-rule="evenodd" d="m6.774 6.4l.812 13.648a.8.8 0 0 0 .798.752h7.232a.8.8 0 0 0 .798-.752L17.226 6.4zm11.655 0l-.817 13.719A2 2 0 0 1 15.616 22H8.384a2 2 0 0 1-1.996-1.881L5.571 6.4H3.5v-.7a.5.5 0 0 1 .5-.5h16a.5.5 0 0 1 .5.5v.7zM14 3a.5.5 0 0 1 .5.5v.7h-5v-.7A.5.5 0 0 1 10 3zM9.5 9h1.2l.5 9H10zm3.8 0h1.2l-.5 9h-1.2z" />
                  </svg>
               </button>
            </div>
         </div>
      </li>`;
};

/**
 * Menampilkan pesan "tidak ada data".
 * @returns {string} Elemen HTML untuk pesan tidak ada data.
 */
export const notFoundElement = () => {
   return `
         <div class="text-center mt-5">
            <img src="./src/assets/images/emojione-v1--books.svg" alt="No data" class="img-fluid" style="max-width: 200px;">
            <p class="mt-2 text-muted">Tidak ada data buku yang ditemukan</p>
         </div>`;
};

/**
 * Fungsi untuk menampilkan daftar buku sesuai status (belum dibaca/sudah dibaca).
 * @param {boolean} isComplete Status buku yang ingin ditampilkan.
 * @param {HTMLElement} container Elemen HTML tempat daftar buku ditampilkan.
 */
export const renderBooksByStatus = (isComplete, container, books = null) => {
   const filteredBooks = books || getBookFromLocal().filter(book => book.isComplete === isComplete);

   container.innerHTML = "";
   if (filteredBooks.length > 0) {
      filteredBooks.forEach(book => {
         container.innerHTML += createBookElement(book);
      });
   } else {
      container.innerHTML = notFoundElement();
   }
};
