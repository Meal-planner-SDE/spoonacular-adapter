"use strict";
/*********
 * Core functionalities
 *   All the processing logics are defined here. In this way, we leave in the
 *   controller all the input/output filtering and selection, and here we write
 *   the "raw" logics. In this way they're also re-usable! :)
 *   Obviously, in a real project, those functionalities should be divided as well.
 *   "Core" is not a fixed word for this type of file, sometimes
 *   people put those functions in a Utils file, sometimes in a Helper
 *   file, sometimes in a Services folder with different files for every service..
 *   It really depends on your project, style and personal preference :)
 */
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.convertAmount = exports.getIngredientById = exports.getRecipeInformation = exports.searchRecipes = void 0;
const types_1 = require("./types");
const config_1 = __importDefault(require("../config"));
const qs_1 = __importDefault(require("qs"));
const axios_1 = __importDefault(require("axios"));
axios_1.default.defaults.paramsSerializer = (params) => {
    return qs_1.default.stringify(params, { indices: false });
};
/**
 * Search for recipes matching a certain query
 * @param query the title of the recipes that should be matched
 * @param diet the diet that the recipes have to match
 * @param number the maximum number of recipes returned
 */
const searchRecipes = (query, diet, number, offset) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const recipes = yield axios_1.default.get(`${config_1.default.SPOONACULAR_API_ENDPOINT}/recipes/complexSearch`, {
            params: {
                apiKey: config_1.default.SPOONACULAR_KEY,
                query: query,
                number: number,
                diet: diet,
                offset: offset
            }
        });
        return recipes.data.results.map((recipe) => new types_1.Recipe(recipe));
    }
    catch (e) {
        console.error(e);
        return {
            error: e.toString(),
        };
    }
});
exports.searchRecipes = searchRecipes;
/**
 * Get extended information about a recipe, including its ingredients
 * @param id id of the recipe
 */
const getRecipeInformation = (id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const response = yield axios_1.default.get(`${config_1.default.SPOONACULAR_API_ENDPOINT}/recipes/${id}/information`, {
            params: {
                apiKey: config_1.default.SPOONACULAR_KEY
            }
        });
        return new types_1.Recipe(response.data);
    }
    catch (e) {
        console.error(e);
        return {
            error: e.toString(),
        };
    }
});
exports.getRecipeInformation = getRecipeInformation;
/**
 * Get information about an ingredient with a certain id
 * @param id the id of the ingredient
 * @return information about the ingredient
 */
const getIngredientById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const response = yield axios_1.default.get(`${config_1.default.SPOONACULAR_API_ENDPOINT}/food/ingredients/${id}/information`, {
            params: {
                apiKey: config_1.default.SPOONACULAR_KEY
            }
        });
        return new types_1.Ingredient(response.data);
    }
    catch (e) {
        console.error(e);
        return {
            error: e.toString(),
        };
    }
});
exports.getIngredientById = getIngredientById;
/**
 * Convert amounts from sourceUnit to targetUnit for a certain ingredient
 * @param ingredientName name of the ingredient
 * @param sourceAmount the amount described in sourceUnit
 * @param sourceUnit source unit
 * @param targetUnit target unit
 * @return an object with a targetAmount described in targetUnit if everything went correctly, otherwise an Error
 */
const convertAmount = (ingredientName, sourceAmount, sourceUnit, targetUnit) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const response = yield axios_1.default.get(`${config_1.default.SPOONACULAR_API_ENDPOINT}/recipes/convert`, {
            params: {
                apiKey: config_1.default.SPOONACULAR_KEY,
                ingredientName: ingredientName,
                sourceAmount: sourceAmount,
                sourceUnit: sourceUnit,
                targetUnit: targetUnit
            }
        });
        if (response.data.hasOwnProperty("status")) {
            throw new Error("Cannot convert the amount.");
        }
        return { targetAmount: response.data.targetAmount };
    }
    catch (e) {
        console.error(e);
        return {
            error: e.toString(),
        };
    }
});
exports.convertAmount = convertAmount;
