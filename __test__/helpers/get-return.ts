export const getReturn = (func: any): any => func.mock.results[0].value;

export const getAsyncReturn = async (func: any): Promise<any> => func.mock.results[0].value;
