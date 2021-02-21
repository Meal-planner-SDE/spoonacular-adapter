"use strict";
/*********
 * Main controller
 *   Here you can define all the processing logics of your endpoints.
 *   It's a good approach to keep in here only the elaboration of the inputs
 *   and outputs, with complex logics inside other functions to improve
 *   reusability and maintainability. In this case, we've defined the complex
 *   logics inside the core.ts file!
 *   In a huge project, you should have multiple controllers, divided
 *   by the domain of the operation.
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.convert = exports.ingredient = exports.recipeInformation = exports.recipe = void 0;
const core_1 = require("./core");
const helper_1 = require("./helper");
const types_1 = require("./types");
const recipe = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const query = helper_1.getParameterFromRequest(req, 'q');
    const diet = helper_1.getParameterFromRequest(req, 'diet');
    const n = helper_1.getNumberFromRequest(req, 'n');
    const offset = helper_1.getNumberFromRequest(req, 'offset');
    let error_msg = "";
    if (query === undefined) {
        error_msg = "parameter q is required.";
    }
    else if (diet === undefined) {
        error_msg = "parameter diet is required.";
    }
    else if (isNaN(n)) {
        error_msg = "parameter n must be an integer.";
    }
    else if (isNaN(offset)) {
        error_msg = "parameter offset must be an integer.";
    }
    if (error_msg) {
        res.status(400);
        res.send({ error: error_msg });
    }
    else {
        let recipes = yield core_1.searchRecipes(query, diet, n, offset);
        if (types_1.isError(recipes)) {
            res.status(400);
        }
        res.send(recipes);
    }
});
exports.recipe = recipe;
const recipeInformation = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let id = helper_1.getIdParameter(req);
    if (isNaN(id)) {
        res.status(400);
        res.send({ error: 'id must be an integer.' });
    }
    else {
        let recipe = yield core_1.getRecipeInformation(id);
        if (types_1.isError(recipe)) {
            res.status(400);
        }
        res.send(recipe);
    }
});
exports.recipeInformation = recipeInformation;
const ingredient = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let id = helper_1.getIdParameter(req);
    if (isNaN(id)) {
        res.status(400);
        res.send({ error: 'id must be an integer' });
    }
    else {
        res.send(yield core_1.getIngredientById(id));
    }
});
exports.ingredient = ingredient;
const convert = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const ingredientName = helper_1.getParameterFromRequest(req, 'ingredientName');
    const sourceAmount = helper_1.getFloatFromRequest(req, 'sourceAmount');
    const sourceUnit = helper_1.getParameterFromRequest(req, 'sourceUnit');
    const targetUnit = helper_1.getParameterFromRequest(req, 'targetUnit');
    let error_msg = "";
    if (ingredientName === undefined) {
        error_msg = "parameter ingredientName is required.";
    }
    else if (isNaN(sourceAmount)) {
        error_msg = "parameter sourceAmount must be an integer.";
    }
    else if (sourceUnit === undefined) {
        error_msg = "parameter sourceUnit is required.";
    }
    else if (targetUnit === undefined) {
        error_msg = "parameter targetUnit is required.";
    }
    if (error_msg) {
        res.status(400);
        res.send({ error: error_msg });
    }
    else {
        let amount = yield core_1.convertAmount(ingredientName, sourceAmount, sourceUnit, targetUnit);
        if (types_1.isError(amount)) {
            res.status(400);
        }
        res.send(amount);
    }
});
exports.convert = convert;
