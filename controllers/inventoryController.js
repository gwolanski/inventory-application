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
exports.addCategory = async (req, res) => {
    const { newCategory } = req.body;

    try {
        await addNewCategory(newCategory);
        const categories = await getAllCategories();
        res.render("categoryManager", { categories: categories });
    } catch (error) {
        console.error("Error adding new category:", error);
        res.status(500).send("Internal Server Error");
    }
};

//delete cateory in category manager
exports.deleteCategory = async (req, res) => {
    const { category } = req.body;

    try {
        await deleteCategory(category);
        const categories = await getAllCategories();
        res.render("categoryManager", { categories: categories });
    } catch (error) {
        console.error("Error deleting category:", error);
        res.status(500).send("Internal Server Error");
    }
}

exports.manageCategory = async (req, res) => {
    const { action, newCategory, category } = req.body;

    try {
        if (action === "add") {
            await addNewCategory(newCategory);
        } else if (action === "delete") {
            await deleteCategory(category);
        }

        const categories = await getAllCategories();
        res.render("categoryManager", { categories });
    } catch (error) {
        console.error("Error managing category:", error);
        res.status(500).send("Internal Server Error");
    }
};
