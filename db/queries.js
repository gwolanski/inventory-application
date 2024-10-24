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
    try {
        const result = await pool.query(`SELECT items.item_name, items.item_price, item_category.category_name FROM items
            JOIN item_category ON items.category_id = item_category.category_id ORDER BY items.item_name ASC`);
        return result.rows.map(row => ({
            name: row.item_name,
            price: row.item_price,
            category: row.category_name
        }));
    } catch (error) {
        console.error("Error getting items: ", error);
    }
};

async function getAllCategories() {
    try {
        const categories = await pool.query("SELECT * FROM item_category ORDER BY category_name ASC");
        return categories.rows.map(row => ({
            id: row.category_id,
            name: row.category_name
        }));
    } catch (error) {
        console.error("Error getting categories: ", error);
    }
};

async function getCategoryItems(categoryId) {
    try {
        const result = await pool.query(
            "SELECT * FROM items WHERE category_id = $1 ORDER BY item_name ASC", [categoryId]
        );
        return result.rows.map(row => ({
            name: row.item_name,
            price: row.item_price,
            category: row.category_name
        }));
    } catch (error) {
        console.error("Error getting category items: ", error);
    }
};

async function addNewCategory(category) {
    try {
        const result = await pool.query(
            "INSERT INTO item_category (category_name) VALUES ($1) RETURNING *", [category]
        );
        return result.rows[0].category_name;
    } catch (error) {
        console.error("Error adding new category: ", error);
    }
};

async function deleteCategory(category) {
    try {
        const categoryId = await getCategoryId(category);
        await pool.query(
            "DELETE FROM item_category WHERE category_id = $1", [categoryId]
        );
    } catch (error) {
        console.error("Error deleting category: ", error);
    }
};

async function editCategory(category, updatedCategory) {
    try {
        const categoryId = await getCategoryId(category);
        await pool.query(
            "UPDATE item_category SET category_name = $1 WHERE category_id = $2", [updatedCategory, categoryId]
        );
    } catch (error) {
        console.error("Error editing category: ", error);
    }
};

async function addNewItem(itemName, itemPrice, itemCategory) {
    try {
        await pool.query(
            "INSERT INTO items (item_name, item_price, category_id) VALUES ($1, $2, $3)", [itemName, itemPrice, itemCategory]
        );
    } catch (error) {
        console.error("Error adding new item: ", error);
    }
};

async function deleteItem(item) {
    try {
        const itemId = await getItemId(item);
        await pool.query(
            "DELETE FROM items WHERE item_id = $1", [itemId]
        );
    } catch (error) {
        console.error("Error deleting item: ", error);
    }
};

async function editItem(itemName, updatedItemName, updatedItemPrice, updatedItemCategory) {
    try {
        const itemPriceFloat = parseFloat(updatedItemPrice);
        const itemId = await getItemId(itemName);

        await pool.query(
            "UPDATE items SET item_name = $1, item_price = $2, category_id = $3 WHERE item_id = $4", [updatedItemName, itemPriceFloat, updatedItemCategory, itemId]
        );
    } catch (error) {
        console.error("Error editing item: ", error);
    }
};

async function getCategoryId(category) {
    try {
        const result = await pool.query(
            "SELECT category_id FROM item_category WHERE LOWER(category_name) = LOWER($1)", [category]
        );

        if (result.rows.length > 0) {
            return result.rows[0].category_id;
        } else {
            return null;
        }
    } catch (error) {
        console.error("Error getting categoryId: ", error);
    }
};

async function getItemId(item) {
    try {
        const result = await pool.query(
            "SELECT item_id FROM items WHERE LOWER(item_name) = LOWER($1)", [item]
        );

        if (result.rows.length > 0) {
            return result.rows[0].item_id;
        } else {
            return null;
        }
    } catch (error) {
        console.error("Error getting item ID: ", error);
    }
};

async function itemExists(itemName) {
    const result = await pool.query("SELECT 1 FROM items WHERE LOWER(item_name) = LOWER($1)", [itemName]);
    return result.rowCount > 0;
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
    editCategory,
    editItem,
    getItemId,
    itemExists
};