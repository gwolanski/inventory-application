const {
    getAllItems,
    getCategoryItems,
    addNewCategory,
    addNewItem,
    deleteCategory,
    deleteItem,
    getCategoryId,
    getAllCategories,
    editCategory,
    editItem } = require("../db/queries");

//get all items and categories for main page
exports.renderIndexPage = async (req, res) => {
    let errorMessage = null;
    try {
        const items = await getAllItems();
        const categories = await getAllCategories();
        res.render("index", { items: items || [], categories: categories || [], errorMessage: errorMessage || null });
    } catch (error) {
        console.error("Error getting items and categories:", error);
        res.status(500).send("Internal Server Error");
    }
};

//renders a specific category page that only displays items from that category
exports.renderItemsByCategory = async (req, res) => {
    let errorMessage = null;
    try {
        const { category } = req.params;
        const categoryId = await getCategoryId(category);
        const items = await getCategoryItems(categoryId);
        const categories = await getAllCategories();
        res.render("filteredItems", { selectedCategory: category, categoryId: categoryId, items: items || [], categories: categories, errorMessage: errorMessage || null });
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
                const properCaseNewCategory = await changeToProperCase(newCategory);
                await addNewCategory(properCaseNewCategory);
            } else {
                errorMessage = "Category already exists.";
            }
        } else if (action === "delete") {
            const categoryId = await getCategoryId(category);
            const itemsInCategory = await getCategoryItems(categoryId);
            if (itemsInCategory.length > 0) {
                errorMessage = "Cannot delete a category with items."
            } else {
                await deleteCategory(category);
            }
        } else if (action === "edit") {
            const categoryId = await getCategoryId(updatedCategory);
            if (categoryId === null || categoryId === undefined) {
                const properCaseUpdatedCategory = await changeToProperCase(updatedCategory);
                await editCategory(category, properCaseUpdatedCategory);
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

exports.manageItem = async (req, res) => {
    const {
        action,
        newItemName,
        newItemCategory,
        newItemPrice,
        itemName,
        updatedItemName,
        updatedItemCategory,
        updatedItemPrice,
        itemForDelete
    } = req.body;

    const { category } = req.params;

    try {
        let errorMessage = null;
        if (action === "add") {
            const existingItem = await itemExists(newItemName);
            if (!existingItem) {
                if (parseFloat(newItemPrice) > 99999999.99) {
                    errorMessage = "Price exceeds limit of $99,999,999.99.";
                } else {
                    const properCaseNewItemName = await changeToProperCase(newItemName);
                    await addNewItem(properCaseNewItemName, newItemPrice, newItemCategory);
                }
            } else {
                errorMessage = "Item already exists.";
            }
        } else if (action === "delete") {
            await deleteItem(itemForDelete);
        } else if (action === "edit") {
            const existingItem = await itemExists(updatedItemName);
            if (!existingItem) {
                if (parseFloat(updatedItemPrice) > 99999999.99) {
                    errorMessage = "Price exceeds limit of $99,999,999.99.";
                } else {
                    const properCaseUpdatedItemName = await changeToProperCase(updatedItemName);
                    await editItem(itemName, properCaseUpdatedItemName, updatedItemPrice, updatedItemCategory);
                }
            } else {
                if (itemName === updatedItemName) {
                    if (parseFloat(updatedItemPrice) > 99999999.99) {
                        errorMessage = "Price exceeds limit of $99,999,999.99.";
                    } else {
                        const properCaseUpdatedItemName = await changeToProperCase(updatedItemName);
                        await editItem(itemName, properCaseUpdatedItemName, updatedItemPrice, updatedItemCategory);
                    }
                } else {
                    errorMessage = "Item already exists.";
                }
            }
        }

        const items = await getAllItems();
        const categories = await getAllCategories();

        if (category) {
            const categoryId = await getCategoryId(category);
            const categoryItems = await getCategoryItems(categoryId);
            res.render("filteredItems", { selectedCategory: category, categoryId: categoryId, items: categoryItems || [], categories: categories, errorMessage: errorMessage || null })
        } else {
            res.render("index", { items: items || [], categories: categories || [], errorMessage: errorMessage || null });
        }
    } catch (error) {
        console.error("Error managing item:", error);
        res.status(500).send("Internal Server Error");
    }
};

async function itemExists(itemName) {
    const items = await getAllItems();
    return items.some(item => {
        return item.name.toLowerCase() === itemName.toLowerCase();
    })
};

async function changeToProperCase(itemName) {
    return itemName.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(' ');
}