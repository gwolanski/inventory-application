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
    const result = await pool.query(`SELECT items.item_name, items.item_price, item_category.category_name FROM items
        JOIN item_category ON items.category_id = item_category.category_id`);
    return result.rows.map(row => ({
        name: row.item_name,
        price: row.item_price,
        category: row.category_name
    }));
};

async function getAllCategories() {
    const categories = await pool.query("SELECT * FROM item_category");
    return categories.rows.map(row => ({
        id: row.category_id,
        name: row.category_name
    }));
};

async function getCategoryItems(categoryId) {
    const result = await pool.query(
        "SELECT * FROM items WHERE category_id = $1", [categoryId]
    );
    return result
};

async function addNewCategory(category) {
    const result = await pool.query(
        "INSERT INTO item_category (category_name) VALUES ($1) RETURNING *", [category]
    );
    return result.rows[0].category_name;
};

async function deleteCategory(category) {
    const categoryId = await getCategoryId(category);
    await pool.query(
        "DELETE FROM item_category WHERE category_id = $1", [categoryId]
    )
};

async function editCategory(category, updatedCategory) {
    const categoryId = await getCategoryId(category);
    await pool.query(
        "UPDATE item_category SET category_name = $1 WHERE category_id = $2", [updatedCategory, categoryId]
    )
}

async function addNewItem(itemName, itemPrice, itemCategory) {
    // console.log("itemName: ", itemName);
    console.log("itemCategory: ", itemCategory);
    // console.log("itemPrice: ", itemPrice);
    await pool.query(
        "INSERT INTO items (item_name, item_price, category_id) VALUES ($1, $2, $3)", [itemName, itemPrice, itemCategory]
    );
};

async function deleteItem(item) {
    console.log("item: ", item);
};

async function getCategoryId(category) {
    const result = await pool.query("SELECT category_id FROM item_category WHERE LOWER(category_name) = LOWER($1)", [category]);

    if (result.rows.length > 0) {
        return result.rows[0].category_id;
    } else {
        return null;
    }
};



module.exports = {
    getAllItems,
    getCategoryItems,
    addNewCategory,
    addNewItem,
    deleteCategory,
    deleteItem,
    getCategoryId,
    getAllCategories,
    editCategory
};