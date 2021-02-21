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

import { Request, Response } from 'express';

import {
  searchRecipes,
  getRecipeInformation,
  getIngredientById,
  convertAmount
} from './core';
import {
  getIdParameter,
  getNumberFromRequest,
  getFloatFromRequest,
  getParameterFromRequest,
} from './helper';

import {
  isError
} from './types'

export const recipe = async (req: Request, res: Response) => {
  const query = getParameterFromRequest(req, 'q')   ;
  const diet = getParameterFromRequest(req, 'diet') ;
  const n = getNumberFromRequest(req, 'n')          ;
  const offset = getNumberFromRequest(req, 'offset');
  let error_msg = "";
  if (query===undefined){
    error_msg = "parameter q is required."
  } else if (diet===undefined){
    error_msg = "parameter diet is required."
  } else if (isNaN(n)){
    error_msg = "parameter n must be an integer."
  } else if (isNaN(offset)){
    error_msg = "parameter offset must be an integer."
  }
  if (error_msg){
    res.status(400);
    res.send({error : error_msg});
  } else {
    let recipes = await searchRecipes(query, diet, n, offset);
    if (isError(recipes)){
      res.status(400);
    }
    res.send(recipes);
  }
};

export const recipeInformation = async (req: Request, res: Response) => {
  let id = getIdParameter(req);
  if (isNaN(id)) {
    res.status(400);
    res.send({ error: 'id must be an integer.' });
  } else {
    let recipe = await getRecipeInformation(id);
    if (isError(recipe)){
      res.status(400);
    }
    res.send(recipe);
  }
};

export const ingredient = async (req: Request, res: Response) => {
  let id = getIdParameter(req);
  if (isNaN(id)) {
    res.status(400);
    res.send({ error: 'id must be an integer' });
  } else {
    res.send(await getIngredientById(id));
  }
};

export const convert = async (req: Request, res: Response) => {
  const ingredientName = getParameterFromRequest(req, 'ingredientName');
  const sourceAmount = getFloatFromRequest(req, 'sourceAmount');
  const sourceUnit = getParameterFromRequest(req, 'sourceUnit') ;
  const targetUnit = getParameterFromRequest(req, 'targetUnit') ;
  let error_msg = "";
  if (ingredientName===undefined){
    error_msg = "parameter ingredientName is required."
  } else if (isNaN(sourceAmount)){
    error_msg = "parameter sourceAmount must be an integer."
  } else if (sourceUnit === undefined){
    error_msg = "parameter sourceUnit is required."
  } else if (targetUnit === undefined){
    error_msg = "parameter targetUnit is required."
  }
  if (error_msg){
    res.status(400);
    res.send({error : error_msg});
  } else {
    let amount = await convertAmount(ingredientName, sourceAmount, sourceUnit, targetUnit);
    if (isError(amount)){
      res.status(400);
    }
    res.send(amount);
  }
};