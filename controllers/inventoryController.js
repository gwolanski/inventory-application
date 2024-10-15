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
    try {
        const items = await getAllItems();
        const categories = await getAllCategories();
        res.render("index", { items: items || [], categories: categories || [] });
    } catch (error) {
        console.error("Error getting items and categories:", error);
        res.status(500).send("Internal Server Error");
    }
};

//get items by category
exports.getItemsByCategory = async (req, res) => {
    try {
        //in the items table, category should be the category_id from item_category table
        //when the nav bar link is pressed for a certain category, we want to run a query where
        //it finds the category_id based off of the category_name and then SELECTS
        //all items that have the same category and returns those items
        // *I NEED TO MAKE SURE THAT WHEN AN ITEM IS ADDED, THE CATEGORY SELECTED RETURNS THE ID AS THE VALUE 
        //RATHER THAN THE CATEGORY NAME

        const { category } = req.params;
        console.log("category:", category)
        const categoryId = await getCategoryId(category);
        const items = await getCategoryItems(categoryId);
        res.render("filteredItems", { category: category, items: items || [] })
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
