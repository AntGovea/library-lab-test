
import "dotenv/config";
import { bookService } from "../services/book.service.js";

// Libros iniciales de NEXORA.
// No incluimos "id": bookService.create() lo genera automáticamente.

const books = [
    {
        title: "Cien años de soledad",
        author: "Gabriel García Márquez",
        genre: "Realismo mágico",
        isbn: "9780307474728",
        publisher: "Vintage Español",
        publication_year: 1967,
        description: "La historia de la familia Buendía en Macondo.",
        pages: 471,
        language: "Español",
        price: 299.00,
        stock_quantity: 10,
        image_url: "https://covers.openlibrary.org/b/isbn/9780307474728-L.jpg"
    },
    {
        title: "La divina comedia",
        author: "Dante Alighieri",
        genre: "Poesía clásica",
        isbn: "9788424936270",
        publisher: "Gredos",
        publication_year: 1321,
        description: "Un viaje literario por el Infierno, el Purgatorio y el Paraíso.",
        pages: 800,
        language: "Español",
        price: 350.00,
        stock_quantity: 6,
        image_url: "https://covers.openlibrary.org/b/isbn/9788424936270-L.jpg"
    },
    {
        title: "Pedro Páramo",
        author: "Juan Rulfo",
        genre: "Novela",
        isbn: "9788437604572",
        publisher: "Cátedra",
        publication_year: 1955,
        description: "Juan Preciado llega a Comala buscando a su padre.",
        pages: 160,
        language: "Español",
        price: 189.00,
        stock_quantity: 12,
        image_url: "https://covers.openlibrary.org/b/isbn/9788437604572-L.jpg"
    },
    {
        title: "El principito",
        author: "Antoine de Saint-Exupéry",
        genre: "Fábula",
        isbn: "9780156012195",
        publisher: "Harcourt",
        publication_year: 1943,
        description: "Un pequeño príncipe descubre el valor de la amistad.",
        pages: 96,
        language: "Español",
        price: 149.00,
        stock_quantity: 15,
        image_url: "https://covers.openlibrary.org/b/isbn/9780156012195-L.jpg"
    },
    {
        title: "Don Quijote de la Mancha",
        author: "Miguel de Cervantes",
        genre: "Clásico",
        isbn: "9788420412146",
        publisher: "Alfaguara",
        publication_year: 1605,
        description: "Las aventuras de Don Quijote y su compañero Sancho Panza.",
        pages: 863,
        language: "Español",
        price: 320.00,
        stock_quantity: 8,
        image_url: "https://covers.openlibrary.org/b/isbn/9788420412146-L.jpg"
    },
    {
        title: "Las batallas en el desierto",
        author: "José Emilio Pacheco",
        genre: "Novela",
        isbn: "9786071614845",
        publisher: "Ediciones Era",
        publication_year: 1981,
        description: "Una historia de infancia y nostalgia en la Ciudad de México.",
        pages: 68,
        language: "Español",
        price: 129.00,
        stock_quantity: 9,
        image_url: "https://covers.openlibrary.org/b/isbn/9786071614845-L.jpg"
    },
    {
        title: "El amor en los tiempos del cólera",
        author: "Gabriel García Márquez",
        genre: "Romance",
        isbn: "9780307389732",
        publisher: "Vintage Español",
        publication_year: 1985,
        description: "Una historia de amor que atraviesa varias décadas.",
        pages: 368,
        language: "Español",
        price: 279.00,
        stock_quantity: 7,
        image_url: "https://covers.openlibrary.org/b/isbn/9780307389732-L.jpg"
    },
    {
        title: "Harry Potter y la piedra filosofal",
        author: "J. K. Rowling",
        genre: "Fantasía",
        isbn: "9788478884452",
        publisher: "Salamandra",
        publication_year: 1997,
        description: "Harry descubre un mundo de magia y su lugar en él.",
        pages: 256,
        language: "Español",
        price: 249.00,
        stock_quantity: 11,
        image_url: "https://covers.openlibrary.org/b/isbn/9788478884452-L.jpg"
    },
    {
        title: "La metamorfosis",
        author: "Franz Kafka",
        genre: "Ficción",
        isbn: "9788237604572",
        publisher: "Clásicos",
        publication_year: 1915,
        description: "Gregor Samsa despierta transformado en una criatura extraña.",
        pages: 128,
        language: "Español",
        price: 119.00,
        stock_quantity: 13,
        image_url: "https://covers.openlibrary.org/b/isbn/9788420633375-L.jpg"
    },
    {
        title: "Los cuatro acuerdos",
        author: "Don Miguel Ruiz",
        genre: "Desarrollo personal",
        isbn: "9781878424310",
        publisher: "Amber-Allen",
        publication_year: 1997,
        description: "Cuatro principios para vivir con mayor libertad personal.",
        pages: 160,
        language: "Español",
        price: 199.00,
        stock_quantity: 10,
        image_url: "https://covers.openlibrary.org/b/isbn/9781878424310-L.jpg"
    }
];

// Inserta los libros uno por uno usando el servicio.
async function seed() {
    let inserted = 0;
    let failed = 0;

    for (const book of books) {
        try {
            const createdBook = await bookService.create(book);

            console.log(
                `Libro creado: ${createdBook.title} (ID: ${createdBook.id})`
            );

            inserted++;
        } catch (error) {
            console.error(
                `No se pudo crear "${book.title}": ${error.message}`
            );

            failed++;
        }
    }

    console.log("\nCarga inicial finalizada.");
    console.log(`Libros insertados: ${inserted}`);
    console.log(`Libros con error: ${failed}`);

    if (failed > 0) {
        process.exitCode = 1;
    }
}

seed();
