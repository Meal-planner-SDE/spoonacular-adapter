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

import { Error, Recipe, Ingredient, RecipeRaw, IngredientRaw, Amount, Params} from './types';
import config from '../config';
import qs from 'qs';

import axios, { AxiosResponse } from 'axios';
import { response } from 'express';
import { isError } from 'util';
axios.defaults.paramsSerializer = (params) => {
  return qs.stringify(params, { indices: false });
};

let fresh_keys = config.SPOONACULAR_KEYS

const make_request: <T>(url:string, params : Params) => Promise<AxiosResponse<T> > = 
  async <T>(url: string, params : Params) => {
  let response:AxiosResponse<T> = {} as AxiosResponse<any>;
  let status_code = 402;
  while(status_code == 402 && fresh_keys.length > 0){
    const random_key_index = Math.floor(Math.random() * fresh_keys.length);
    params.apiKey = fresh_keys[random_key_index];
    console.log("selected key:", params.apiKey)
    response = await axios.get(url, {
      params: params
    });
    status_code = response.status;
    if(status_code == 402){
      console.log("key is used:", params.apiKey)
      delete fresh_keys[random_key_index];
    }
  }
  return response;
}

/**
 * Search for recipes matching a certain query
 * @param query the title of the recipes that should be matched
 * @param diet the diet that the recipes have to match
 * @param number the maximum number of recipes returned
 */
export const searchRecipes: (query : string, diet: string, number: number, offset: number) => Promise<Recipe[] | Error> = async (query, diet, number, offset) => {
  try {
    let params = {
      apiKey: "",
      query: query,
      number: number,
      diet: diet,
      offset: offset
    }
    let recipes = await make_request<{results: RecipeRaw[]}>(`${config.SPOONACULAR_API_ENDPOINT}/recipes/complexSearch`, params);

    // const recipess = await axios.get<{results : RecipeRaw[]}>(`${config.SPOONACULAR_API_ENDPOINT}/recipes/complexSearch`);
    return recipes.data.results.map((recipe) => new Recipe(recipe));
  } catch (e) {
    console.error(e);
    return {
      error: e.toString(),
    };
  }
};

/**
 * Get extended information about a recipe, including its ingredients
 * @param id id of the recipe
 */
export const getRecipeInformation: (id : number) => Promise<Recipe| Error> = async (id) => {
  try {
    let params = {
      apiKey: ""
    }
    const response = await make_request<RecipeRaw>(`${config.SPOONACULAR_API_ENDPOINT}/recipes/${id}/information`, params);
    return new Recipe(response.data);
  } catch (e) {
    console.error(e);
    return {
      error: e.toString(),
    };
  }
};

/**
 * Get information about an ingredient with a certain id
 * @param id the id of the ingredient
 * @return information about the ingredient
 */
export const getIngredientById: (id : number) => Promise<Ingredient| Error> = async (id) => {
  try {
    let params = {
      apiKey: ""
    }
    const response = await make_request<IngredientRaw>(`${config.SPOONACULAR_API_ENDPOINT}/food/ingredients/${id}/information`, params);
    return new Ingredient(response.data);
  } catch (e) {
    console.error(e);
    return {
      error: e.toString(),
    };
  }
};

/**
 * Convert amounts from sourceUnit to targetUnit for a certain ingredient
 * @param ingredientName name of the ingredient 
 * @param sourceAmount the amount described in sourceUnit
 * @param sourceUnit source unit
 * @param targetUnit target unit
 * @return an object with a targetAmount described in targetUnit if everything went correctly, otherwise an Error
 */
export const convertAmount: (ingredientName: string, sourceAmount: number, sourceUnit: string, targetUnit: string) => Promise<Object | Error> = async (ingredientName, sourceAmount, sourceUnit, targetUnit) => {
  try {
    let params = {
      apiKey: "",
      ingredientName: ingredientName,
      sourceAmount: sourceAmount,
      sourceUnit: sourceUnit,
      targetUnit: targetUnit
    };
    const response = await make_request<Amount>(`${config.SPOONACULAR_API_ENDPOINT}/recipes/convert`, params);
    if(response.data.hasOwnProperty("status")){
      throw new Error("Cannot convert the amount.");
    }
    return {targetAmount: response.data.targetAmount};
  } catch (e) {
    console.error(e);
    return {
      error: e.toString(),
    };
  }
};