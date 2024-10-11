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
        const errorMessage = null;
        res.render("categoryManager", { categories: categories || [], errorMessage: errorMessage });
    } catch (error) {
        console.error("Error loading Category Manager", error);
        res.status(500).send("Internal Server Error");
    }
};

//add new category in category manager
// exports.addCategory = async (req, res) => {
//     const { newCategory } = req.body;

//     try {
//         await addNewCategory(newCategory);
//         const categories = await getAllCategories();
//         res.render("categoryManager", { categories: categories });
//     } catch (error) {
//         console.error("Error adding new category:", error);
//         res.status(500).send("Internal Server Error");
//     }
// };

//delete cateory in category manager
// exports.deleteCategory = async (req, res) => {
//     const { category } = req.body;

//     try {
//         await deleteCategory(category);
//         const categories = await getAllCategories();
//         res.render("categoryManager", { categories: categories });
//     } catch (error) {
//         console.error("Error deleting category:", error);
//         res.status(500).send("Internal Server Error");
//     }
// }

//add or delete category. MAKE SURE YOU CAN'T ADD EXISTING CATEGORY
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
            await editCategory(category, updatedCategory)
        }

        const categories = await getAllCategories();
        res.render("categoryManager", { categories, errorMessage });
    } catch (error) {
        console.error("Error managing category:", error);
        res.status(500).send("Internal Server Error");
    }
};
