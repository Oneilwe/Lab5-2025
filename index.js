const express = require('express');
const app = express ();
app.use(express.json());


const PORT = process.env.PORT || 3000;

let books = [];

app.get("/", (req, res) => {
    res.send("Welcome to the Book API!"); // You can customize this message
});
app.get("/status", (request, response) => {
    const status = {
       "Status": "Running"
    };
    
    response.send(status);
 });

app.get("/whoami", (request, response) =>{
    response.json({studentNumber: "2117099"});
});

app.get("/books", (req, res)=>{
    res.json(books);
})

app.get("/books/:id", (req, res) => {
    const book = books.find(b => b.id === req.params.id);
    if (!book){
        return res.status(404).json({error:"404 Not Found", message: "Book does not exist."});
    }
    res.json(book);
})

app.post("/books", (req, res) => {
    const {title, details} = req.body;
    if (!title || typeof title !== "string" || !details || !Array.isArray(details)){
        return res.status(400).json({error:"Missing required book details"})
    }
    const newBook = {
        id: String(books.length + 1),
        title,
        details: Array.isArray(details) ? details: []
    };
    books.push(newBook);
    res.status(201).json(newBook);
});

app.put("/books/:id", (req, res) =>{
    const bookId = req.params.id;
    const book = books.find(b => b.id === bookId);
    if (!book){
        return res.status(404).json({error: "404 Not Found", message: "Book does not exit."});
    }

    const {title, details} = req.body;
    if (!title || typeof title !== "string" || !details || !Array.isArray(details)){
        return res.status(400).json({error:"400 Bad Request"})
    }

    const updatedBook = {
        ...book,
        title: title !== undefined ? title: book.title,
        details: details !== undefined ? details: book.details
    };
    const bookIndex = books.findIndex(b => b.id === bookId);
    books[bookIndex]= updatedBook;
    res.json(updatedBook);
})

app.delete("/books/:id", (req, res) => {
    const bookId = req.params.id;
    const bookIndex = books.findIndex (b => b.id === bookId);

    if (bookIndex === -1){
        return res.status(404).json({error: "404 Not Found", message: "Book does not exit."})
    }
    books.splice(bookIndex, 1);
    res.status(204).send();

})

app.post("/books/:id/details", (req, res) => {
    const bookId = req.params.id;
    const {author, genre, publicationYear} = req.body;

    const book = books.find(b => b.id === bookId);
    if (!book){
        return res.status(404).json({error: "404 Not Found", message: "Book does not exit."});
    }

    if (!author || typeof author !== "string" || !genre || typeof genre !== "string" || !publicationYear || typeof publicationYear !== "number"){
        return res.status(400).json({error:"400 Bad Request"})
    }

    const newDetail = {
        id: String(book.details.length + 1),
        author,
        genre,
        publicationYear
    };
    book.details.push(newDetail);
    res.status(201).json(book);
})

app.delete("/books/:id/details/:detailId", (req, res) => {
    const bookId = req.params.id;
    const detailId = req.params.detailId;

    const book = books.find(b => b.id === bookId);

    if (!book) {
        return res.status(404).json({ error: "404 Not Found", message: "Book does not exist." });
    }

    const detailIndex = book.details.findIndex(d => d.id === detailId);
    if (detailIndex === -1) {
        return res.status(404).json({ error: "404 Not Found", message: "Detail does not exist." });
    }

    book.details.splice(detailIndex, 1);
    res.status(204).send(); 
})

app.listen(PORT, () => {
    console.log("Server Listening on PORT:", PORT);
  });
