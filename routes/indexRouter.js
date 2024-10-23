const express = require("express");
const router = express.Router();
const inventoryController = require("../controllers/inventoryController");

//home page route
router.get("/", inventoryController.renderIndexPage);

//add, edit, or delete item
router.post("/", inventoryController.manageItem);

//category management page route
router.get("/categories", inventoryController.renderCategoryManager);

//add, edit, or delete category in category manager
router.post("/categories", inventoryController.manageCategory);

//view items by category
router.get("/:category", inventoryController.renderItemsByCategory);

//edit or delete items while on specified category page
router.post("/:category", inventoryController.manageItem);


module.exports = router;