import express from 'express';
import cors from 'cors';
import Database from 'better-sqlite3';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import dotenv from 'dotenv';
import process from 'process';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(cors({
    origin: "http://localhost:5173"
}));
app.use('/uploads', express.static('uploads'));

app.use(express.json());

const db = new Database('database.db');
const upload = multer({ dest: 'uploads/' });

// Drop and recreate table with age column
db.exec('DROP TABLE IF EXISTS products');
db.exec('CREATE TABLE IF NOT EXISTS products (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, description TEXT, price INTEGER, age TEXT, image TEXT)');
console.log('Database initialized');

app.listen(3000, () => console.log("Server started on port 3000"));

app.post('/api/products', upload.single('image'), (req, res) => {
    try {
        const product = req.body;
        console.log(product);
        const imageurl = req.file ? `http://localhost:3000/uploads/${req.file.filename}` : null;    
         
        const stmt = db.prepare('INSERT INTO products (name, description, price, age, image) VALUES (?, ?, ?, ?, ?)');
        const result = stmt.run(product.name, product.description, product.price, product.age, imageurl);
        
        console.log(`Product added: ${product.name}`);
        res.send({ success: true, id: result.lastInsertRowid });
    } catch (error) {
        console.error('Error adding product:', error);
        res.status(500).send({ error: 'Failed to add product' });
    }
});

app.get('/api/products', (req, res) => {
    try {
        const stmt = db.prepare('SELECT * FROM products');
        const products = stmt.all();
        console.log(products);
        console.log(`Fetched ${products.length} products`);
        res.send(products);
    } catch (error) {
        console.error('Error fetching products:', error);
        res.status(500).send({ error: 'Failed to fetch products' });
    }
});

// NOUVELLE ROUTE: Récupérer un produit par ID
app.get('/api/products/:id', (req, res) => {
    try {
        const stmt = db.prepare('SELECT * FROM products WHERE id = ?');
        const product = stmt.get(req.params.id);
        if (!product) {
            return res.status(404).send({ error: 'Product not found' });
        }
        res.send(product);
    } catch (error) {
        console.error('Error fetching product:', error);
        res.status(500).send({ error: 'Failed to fetch product' });
    }
});

// NOUVELLE ROUTE: Modifier un produit
app.put('/api/products/:id', upload.single('image'), (req, res) => {
    try {
        const productId = req.params.id;
        const { name, description, price, age } = req.body;
        
        // Récupérer le produit existant
        const getStmt = db.prepare('SELECT * FROM products WHERE id = ?');
        const existingProduct = getStmt.get(productId);
        
        if (!existingProduct) {
            return res.status(404).send({ error: 'Product not found' });
        }
        
        let imageurl = existingProduct.image;
        
        // Si une nouvelle image est uploadée
        if (req.file) {
            // Supprimer l'ancienne image si elle existe
            if (existingProduct.image) {
                const oldImagePath = path.join(__dirname, 'uploads', path.basename(existingProduct.image));
                try {
                    if (fs.existsSync(oldImagePath)) {
                        fs.unlinkSync(oldImagePath);
                    }
                } catch (err) {
                    console.error('Error deleting old image:', err);
                }
            }
            imageurl = `http://localhost:3000/uploads/${req.file.filename}`;
        }
        
        const stmt = db.prepare('UPDATE products SET name = ?, description = ?, price = ?, age = ?, image = ? WHERE id = ?');
        stmt.run(name, description, price, age, imageurl, productId);
        
        console.log(`Product updated: ${name}`);
        res.send({ success: true, id: productId });
    } catch (error) {
        console.error('Error updating product:', error);
        res.status(500).send({ error: 'Failed to update product' });
    }
});

app.delete('/api/products/:id', (req, res) => {
    try {
        const productId = req.params.id;
        
        const getStmt = db.prepare('SELECT * FROM products WHERE id = ?');
        const product = getStmt.get(productId);
        
        if (!product) {
            return res.status(404).send({ error: 'Product not found' });
        }
        
        // Supprimer l'image
        if (product.image) {
            const imagePath = path.join(__dirname, 'uploads', path.basename(product.image));
            try {
                if (fs.existsSync(imagePath)) {
                    fs.unlinkSync(imagePath);
                }
            } catch (err) {
                console.error('Error deleting image:', err);
            }
        }
        
        const stmt = db.prepare('DELETE FROM products WHERE id = ?');
        stmt.run(productId);
        
        console.log(`Product deleted: ID ${productId}`);
        res.send({ success: true });
    } catch (error) {
        console.error('Error deleting product:', error);
        res.status(500).send({ error: 'Failed to delete product' });
    }
});

// Save or update authorized user
app.post("/api/saveuser", (req, res) => {
    try {
        const { isauthorizeduser } = req.body;
        
        if (!isauthorizeduser) {
            return res.status(400).send({ error: 'Email is required' });
        }
        
        db.exec("CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT, isauthorizeduser TEXT UNIQUE)");
        
        const checkStmt = db.prepare('SELECT * FROM users WHERE isauthorizeduser = ?');
        const existingUser = checkStmt.get(isauthorizeduser);
        
        if (!existingUser) {
            const stmt = db.prepare('INSERT INTO users (isauthorizeduser) VALUES (?)');
            stmt.run(isauthorizeduser);
            console.log(`User saved: ${isauthorizeduser}`);
        } else {
            console.log(`User already exists: ${isauthorizeduser}`);
        }
        
        res.send({ success: true, email: isauthorizeduser });
    } catch (error) {
        console.error('Error saving user:', error);
        res.status(500).send({ error: 'Failed to save user' });
    }
});

app.get("/api/getuser", (req, res) => {
    try {
        const stmt = db.prepare('SELECT * FROM users ORDER BY id DESC LIMIT 1');
        const user = stmt.get();
        
        if (!user) {
            return res.status(404).send({ error: 'No user found' });
        }
        
        console.log(`User fetched: ${user.isauthorizeduser}`);
        res.send(user);
    } catch (error) {
        console.error('Error fetching user:', error);
        res.status(500).send({ error: 'Failed to fetch user' });
    }
});

app.delete("/api/deleteuser", (req, res) => {
    try {
        const stmt = db.prepare('DELETE FROM users');
        stmt.run();
        console.log('User deleted (logged out)');
        res.send({ success: true });
    } catch (error) {
        console.error('Error deleting user:', error);
        res.status(500).send({ error: 'Failed to delete user' });
    }
});

app.get("/api/getclientid" , (req,res)=> {
    const clientid = process.env.GOOGLE_CLIENT_ID;
    res.send(clientid);
})

