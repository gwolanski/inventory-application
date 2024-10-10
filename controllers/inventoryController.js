const {
    getAllItems,
    getCategoryItems,
    addNewCategory,
    addNewItem,
    deleteCategory,
    deleteItem,
    getCategoryId,
    getAllCategories } = require("../db/queries");

//get all items and categories for main page
exports.getAllItemsAndCategories = async (req, res) => {
    try {
        const items = await getAllItems();
        const categories = await getAllCategories();
        res.render("index", { items: items || [], categories: categories || [] });
    } catch (error) {
        console.error("Error getting items and categories:", error);
        res.status(500).send("Internal Server Error");
    }
};

//get all categories for category manager
exports.getAllCategories = async (req, res) => {
    try {
        const categories = await getAllCategories();
        res.render("categoryManager", { categories: categories || [] });
    } catch (error) {
        console.error("Error loading Category Manager", error);
        res.status(500).send("Internal Server Error");
    }
};

//add new category in category manager
exports.addNewCategory = async (req, res) => {
    const { newCategory } = req.body;

    try {
        console.log("newCategory:", newCategory)
        await addNewCategory(newCategory);
        const categories = await getAllCategories();
        res.render("categoryManager", { categories: categories });
    } catch (error) {
        console.error("Error adding new category:", error);
        res.status(500).send("Internal Server Error");
    }
};