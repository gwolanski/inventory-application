const express = require("express");
const router = express.Router();
const inventoryController = require("../controllers/inventoryController");
const {
    getAllItems,
    getCategoryItems,
    addNewCategory,
    addNewItem,
    deleteCategory,
    deleteItem,
    getCategoryId,
    getAllCategories } = require("../db/queries");


//home page route
router.get("/", inventoryController.renderIndexPage);

//add, edit, or delete item
//**since switching it to manageItem from postNewItem, no longer works. PICK UP HERE!!!
router.post("/", inventoryController.manageItem);

//category management page route
router.get("/categories", inventoryController.renderCategoryManager);

//add, edit, or delete category in category manager
router.post("/categories", inventoryController.manageCategory);

//new item page route
router.get("/new", async (req, res) => {
    res.render("new");
});

//post new item route - probably dont need if i just post to main page**
router.post("/new", async (req, res) => {
    const { name, price, quantity, category } = req.body;

    try {
        await addNewItem(name, price, quantity, category);
        res.redirect("/");
    } catch (error) {
        console.error("Error adding item:", error);
        res.status(500).send("Internal Server Error");
    }
})

//view items by category
router.get("/:category", inventoryController.renderItemsByCategory);


module.exports = router;