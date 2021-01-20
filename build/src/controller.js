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
const recipe = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const query = helper_1.getParameterFromRequest(req, 'q') || "";
    const diet = helper_1.getParameterFromRequest(req, 'diet') || "omni";
    const n = helper_1.getNumberFromRequest(req, 'n') || 1;
    const offset = helper_1.getNumberFromRequest(req, 'offset') || 0;
    res.send(yield core_1.searchRecipes(query, diet, n, offset));
});
exports.recipe = recipe;
const recipeInformation = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let id = helper_1.getIdParameter(req);
    if (id !== false) {
        res.send(yield core_1.getRecipeInformation(id));
    }
    else {
        res.status(400);
        res.send({ error: 'Invalid ID format!' });
    }
});
exports.recipeInformation = recipeInformation;
const ingredient = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let id = helper_1.getIdParameter(req);
    if (id !== false) {
        res.send(yield core_1.getIngredientById(id));
    }
    else {
        res.status(400);
        res.send({ error: 'Invalid ID format!' });
    }
});
exports.ingredient = ingredient;
const convert = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const ingredientName = helper_1.getParameterFromRequest(req, 'ingredientName') || "";
    const sourceAmount = helper_1.getNumberFromRequest(req, 'sourceAmount') || 1;
    const sourceUnit = helper_1.getParameterFromRequest(req, 'sourceUnit') || "g";
    const targetUnit = helper_1.getParameterFromRequest(req, 'targetUnit') || "g";
    const response = yield core_1.convertAmount(ingredientName, sourceAmount, sourceUnit, targetUnit);
    if (response instanceof Error) {
        res.status(400);
    }
    res.send(response);
});
exports.convert = convert;
