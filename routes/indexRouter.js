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
router.get("/", inventoryController.getAllItemsAndCategories);

//category management page route
router.get("/categories", inventoryController.getAllCategories);


//post new category in category manager
router.post("/categories", inventoryController.addNewCategory);


//new item page route
router.get("/new", async (req, res) => {
    res.render("new");
});

//post new item route
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




module.exports = router;