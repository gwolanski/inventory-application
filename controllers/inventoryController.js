const {
    getAllItems,
    getCategoryItems,
    addNewCategory,
    addNewItem,
    deleteCategory,
    deleteItem,
    getCategoryId,
    getAllCategories,
    editCategory } = require("../db/queries");

//get all items and categories for main page
exports.renderIndexPage = async (req, res) => {
    let errorMessage = null;
    try {
        const items = await getAllItems();
        const categories = await getAllCategories();
        res.render("index", { items: items || [], categories: categories || [], errorMessage: errorMessage });
    } catch (error) {
        console.error("Error getting items and categories:", error);
        res.status(500).send("Internal Server Error");
    }
};

//renders a specific category page that only displays items from that category
exports.renderItemsByCategory = async (req, res) => {
    try {
        const { category } = req.params;
        const categoryId = await getCategoryId(category);
        const items = await getCategoryItems(categoryId);
        const categories = await getAllCategories();
        res.render("filteredItems", { category: category, items: items || [], categories: categories })
    } catch (error) {
        console.error("Error getting items by category:", error);
        res.status(500).send("Internal Server Error");
    }
}

//render category manager
exports.renderCategoryManager = async (req, res) => {
    try {
        const categories = await getAllCategories();
        const errorMessage = null;
        res.render("categoryManager", { categories: categories || [], errorMessage: errorMessage });
    } catch (error) {
        console.error("Error loading Category Manager", error);
        res.status(500).send("Internal Server Error");
    }
};

//add or delete category
exports.manageCategory = async (req, res) => {
    const { action, newCategory, category, updatedCategory } = req.body;

    try {
        let errorMessage = null;
        if (action === "add") {
            const categoryId = await getCategoryId(newCategory);
            if (categoryId === null || categoryId === undefined) {
                await addNewCategory(newCategory);
            } else {
                errorMessage = "Category already exists.";
            }
        } else if (action === "delete") {
            await deleteCategory(category);
        } else if (action === "edit") {
            const categoryId = await getCategoryId(updatedCategory);
            if (categoryId === null || categoryId === undefined) {
                await editCategory(category, updatedCategory);
            } else {
                errorMessage = "Category already exists.";
            }
        }

        const categories = await getAllCategories();
        res.render("categoryManager", { categories, errorMessage });
    } catch (error) {
        console.error("Error managing category:", error);
        res.status(500).send("Internal Server Error");
    }
};

exports.postNewItem = async (req, res) => {
    const { newItemName, newItemCategory, newItemPrice } = req.body;

    try {

        await addNewItem(newItemName, newItemPrice, newItemCategory);
        const items = await getAllItems();

        const categories = await getAllCategories();
        res.render("index", { items: items || [], categories: categories || [] });
    } catch (error) {
        console.error("Error adding new item:", error);
        res.status(500).send("Internal Server Error");
    }
};

exports.manageItem = async (req, res) => {
    const { action, newItemName, newItemCategory, newItemPrice, updatedItemName, updatedItemCategory, updatedItemPrice } = req.body;

    const existingItem = await itemExists(newItemName);
    console.log("existingItem: ", existingItem);
    try {
        let errorMessage = null;
        if (action === "add") {
            if (!existingItem) {
                await addNewItem(newItemName, newItemPrice, newItemCategory);
            } else {
                errorMessage = "Item already exists";
            }
        } else if (action === "delete") {
            console.log("delete")
        } else if (action === "edit") {
            console.log("edit")
        }

        const items = await getAllItems();
        const categories = await getAllCategories();
        res.render("index", { items: items || [], categories: categories || [], errorMessage: errorMessage });
    } catch (error) {
        console.error("Error managing item:", error);
        res.status(500).send("Internal Server Error");
    }
};

async function itemExists(itemName) {
    const items = await getAllItems();
    return items.some(item => {
        item.name = itemName
    })
}