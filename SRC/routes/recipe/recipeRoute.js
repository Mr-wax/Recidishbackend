import express from "express"
const router = express.Router();
import recipe from "../../models/recipeModel.js";
import recipe from "../../models/recipeModel.js";

// GET /recipes - Retrieve all recipes (with optional filters)
router.get('/recipe', async (req, res) => {
    try {
        let query = {};

        // Handle type filter if provided
        if (req.query.type) {
            query.type = req.query.type;
        }

        // Handle category filter if provided
        if (req.query.category) {
            query.categories = { $in: [req.query.category] };
        }

        const recipe = await recipe.find(query);
        res.json(recipe);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

export default recipeRoute;
