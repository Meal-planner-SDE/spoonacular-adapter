/*********
 * Helper
 *   Here you can define all those functions that can be
 *   useful in several places but does not belong to any
 *   of the other files.
 */

import { Request } from 'express';

/**
 * Extract a specific parameter from the query-string
 * @param req The request (as given in the controller)
 * @param param The id of the parameter to be extracted
 * @return the value of the parameter if the parameter is
 * correct and available, false otherwise
 */
export const getNumberParameterFromRequest: (req: Request, param: string) => number = (
  req,
  param
) => {
  let value = req.params.n;
  return parseInt(value);
};

/**
 * Parse a number parameter from a query
 * @param req The request (as given in the controller)
 * @param param The name of the number parameter to get
 * @return the value of the parameter if the parameter is
 * correct and available, false otherwise
 */
export const getNumberFromRequest: (req: Request, param: string) => number = (
  req,
  param
) => {
  let value = req.query[param];

  return parseInt(value);
};

/**
 * Get the "id" parameter from a query
 * @param req The request (as given in the controller)
 * @return the id if it is correct and available, false otherwise
 */
export const getIdParameter: (req: Request) => number  = (
  req
) => {
  let value = req.params.id;

  return parseInt(value);
};

/**
 * Get a parameter from the query
 * @param req The request (as given in the controller)
 * @param param The parameter to get from the request
 * @return the value of the parameter if the parameter is
 * correct and available, false otherwise
 */
export const getParameterFromRequest: (req: Request, param: string) => string = (
  req,
  param
) => {
  let value = req.query[param] as string;
  return value;
};


/**
 * Extract id from the request query-string
 * @param req The request (as given in the controller)
 * @return the id if the parameter is correct and
 * available, false otherwise
 */
export const getIdFromRequest: (req: Request) => number = (req) => {
  return getNumberFromRequest(req, 'id');
};