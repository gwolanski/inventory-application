require('dotenv').config();

const { Pool } = require("pg");

const pool = new Pool({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME,
    ssl: {
        require: true,
    },
});

async function getAllItems() {
    const result = await pool.query("SELECT * FROM items");
    console.log("getAllItems result: ", result);
    return result
};

async function getCategoryItems(category) {
    const categoryId = getCategoryId(category);
    console.log("categoryId: ", categoryId);
};

async function addNewCategory(category) {
    const result = await pool.query(
        'INSERT INTO item_category (category_name) VALUES ($1) RETURNING *', [category]
    );
    console.log("category: ", result.rows[0]);
    return result.rows[0].category_name;
};

async function addNewItem(item) {
    console.log("item: ", item);
};

async function deleteCategory(category) {
    console.log("category: ", category);
};

async function deleteItem(item) {
    console.log("item: ", item);
};

async function getCategoryId(category) {
    const result = await pool.query("SELECT category_id FROM item_category WHERE category_name = $1", [category]);
    return result.rows[0].category_id;
};

async function getAllCategories() {
    const categories = await pool.query("SELECT category_name FROM item_category");
    return categories.rows.map(row => row.category_name);
}

module.exports = {
    getAllItems,
    getCategoryItems,
    addNewCategory,
    addNewItem,
    deleteCategory,
    deleteItem,
    getCategoryId,
    getAllCategories
};