import _ = require("lodash");
type Class<T> = new (...args: any[]) => T;

export function removeEmptyValues<T extends Record<string, any>>(obj: T): Partial<T> {
  const clone = _.cloneDeep(obj);
  Object.entries(clone).forEach(([key, value]) => {
    if (value === undefined || value === null || value === "") {
      delete clone[key];
    }
  });
  return clone;
}

export function mapRequestObjectToModel<T extends Record<string, any>>(Model: Class<T>, req: any): Partial<T> {
  const prototype = new Model({});
  const obj = {} as any;
  Object.entries(prototype).forEach(([key]) => {
    if (req.body[key]) {
      obj[key] = req.body[key];
    }
  });

  return obj;
}
