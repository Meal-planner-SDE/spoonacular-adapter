/*********
 * Type definitions
 *   TypeScript interfaces and types should be defined here!
 */

export interface Error {
  error: any;
}

export const isError = (arg: any): arg is Error => {
  return arg && arg.error;
};

export interface MPUser {
  mp_user_id: number;
  username: string;
  height: number;
  weight: number;
  diet_type: string;
  address: string;
  shopping_list_id: number;
}

export interface MeasureRaw {
  amount: number,
  unitLong: string,
  unitShort: string
}

export class Measure {
  amount: number;
  unitLong: string;
  unitShort: string;

  constructor(measure: MeasureRaw){
    this.amount = measure.amount;
    this.unitLong = measure.unitLong;
    this.unitShort = measure.unitShort;
  }
}

export class RecipeIngredient {
  id: number;
  name: string;
  measures: {
    metric: Measure
  };

  constructor(rec_ingredient: RecipeIngredientRaw){
    this.id = rec_ingredient.id;
    this.name = rec_ingredient.name;
    this.measures = {
      metric : new Measure(rec_ingredient.measures.metric)
    };
  }
}

export interface RecipeIngredientRaw {
  id: number,
  name: string,
  measures: {
    metric: MeasureRaw
  }
}

export interface Params {
  apiKey: string
}

export class Recipe {
  recipe_id: number;
  title: string;
  image: string;
  imageType: string;
  ingredients: RecipeIngredient[];
  summary: string;
  sourceUrl: string;
  servings: number;
  readyInMinutes: number;
  pricePerServing: number;
  glutenFree: boolean;
  vegan: boolean;
  vegetarian: boolean;
  instructions: string;
  calories: number;

  constructor(recipe: RecipeRaw){
    this.recipe_id = recipe.id;
    this.title = recipe.title;
    this.image = recipe.image;
    this.imageType = recipe.imageType;
    this.summary = recipe.summary;
    this.sourceUrl = recipe.sourceUrl;
    this.servings = recipe.servings || 1;
    this.readyInMinutes = recipe.readyInMinutes;
    this.pricePerServing = recipe.pricePerServing;
    this.glutenFree = recipe.glutenFree;
    this.vegan = recipe.vegan;
    this.vegetarian = recipe.vegetarian;
    this.instructions = recipe.instructions;
    this.ingredients = [];
    if(recipe.extendedIngredients !== undefined){
      for (const ingredient of recipe.extendedIngredients){
        this.ingredients.push(new RecipeIngredient(ingredient));
      }
    }
    this.calories = 0.0;
      if (recipe.nutrition){
      let nutrients = recipe.nutrition.nutrients;
      for (let nutrient of nutrients){
        if (nutrient.name == "Calories"){
          this.calories = nutrient.amount;
        }
      }
    }
  }
}

export interface RecipeRaw {
  id: number,
  title: string,
  image: string,
  imageType: string,
  extendedIngredients: RecipeIngredientRaw[],
  summary: string,
  sourceUrl: string,
  servings: number,
  readyInMinutes: number,
  pricePerServing: number,
  glutenFree: boolean,
  vegan: boolean,
  vegetarian: boolean,
  instructions: string,
  nutrition: {
    nutrients: {
        name: string,
        title: string,
        amount: number,
        unit: string
    }[]
  }
}

export class Ingredient {
  id: number;
  name: string;
  categoryPath: string[];

  constructor(ingredient: IngredientRaw){
    this.id = ingredient.id;
    this.name = ingredient.name;
    this.categoryPath = ingredient.categoryPath;
  }
}

export interface IngredientRaw {
  id: number;
  name: string;
  categoryPath: string[];
}

export interface Amount {
  sourceAmount: number,
  sourceUnit: string,
  targetAmount: number,
  targetUnit: string,
  answer: string
}