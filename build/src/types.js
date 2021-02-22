"use strict";
/*********
 * Type definitions
 *   TypeScript interfaces and types should be defined here!
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.Ingredient = exports.Recipe = exports.RecipeIngredient = exports.Measure = exports.isError = void 0;
const isError = (arg) => {
    return arg && arg.error;
};
exports.isError = isError;
class Measure {
    constructor(measure) {
        this.amount = measure.amount;
        this.unitLong = measure.unitLong;
        this.unitShort = measure.unitShort;
    }
}
exports.Measure = Measure;
class RecipeIngredient {
    constructor(rec_ingredient) {
        this.id = rec_ingredient.id;
        this.name = rec_ingredient.name;
        this.measures = {
            metric: new Measure(rec_ingredient.measures.metric)
        };
    }
}
exports.RecipeIngredient = RecipeIngredient;
class Recipe {
    constructor(recipe) {
        this.recipe_id = recipe.id;
        this.title = recipe.title;
        this.image = recipe.image;
        this.imageType = recipe.imageType;
        this.summary = recipe.summary;
        this.sourceUrl = recipe.sourceUrl;
        this.servings = recipe.servings;
        this.readyInMinutes = recipe.readyInMinutes;
        this.pricePerServing = recipe.pricePerServing;
        this.glutenFree = recipe.glutenFree;
        this.vegan = recipe.vegan;
        this.vegetarian = recipe.vegetarian;
        this.instructions = recipe.instructions;
        this.ingredients = [];
        if (recipe.extendedIngredients !== undefined) {
            for (const ingredient of recipe.extendedIngredients) {
                this.ingredients.push(new RecipeIngredient(ingredient));
            }
        }
        this.calories = 0.0;
        let nutrients = recipe.nutrition.nutrients;
        for (let nutrient of nutrients) {
            if (nutrient.name == "Calories") {
                this.calories = nutrient.amount;
            }
        }
    }
}
exports.Recipe = Recipe;
class Ingredient {
    constructor(ingredient) {
        this.id = ingredient.id;
        this.name = ingredient.name;
        this.categoryPath = ingredient.categoryPath;
    }
}
exports.Ingredient = Ingredient;
