import fastJson from 'fast-json-stringify';

export default (ajv, schema) => {
  let validation;
  let validationStringify;
  if (typeof schema === 'object' && schema) {
    if (typeof schema.response === 'object') {
      schema.response = fastJson(schema.response);
    }
    if (ajv) {
      if (typeof schema.query === 'object') {
        validation = validation || [];
        schema.query = ajv.compile(schema.query);
        validation.push({ type: 'query', validator: schema.query });
      }
      if (typeof schema.params === 'object') {
        validation = validation || [];
        schema.params = ajv.compile(schema.params);
        validation.push({ type: 'params', validator: schema.params });
      }
      if (typeof schema.headers === 'object') {
        validation = validation || [];
        schema.headers = ajv.compile(schema.headers);
        validation.push({ type: 'headers', validator: schema.headers });
      }
      if (typeof schema.body === 'object') {
        validation = validation || [];
        schema.body = ajv.compile(schema.body);
        validation.push({ type: 'body', validator: schema.body });
      }
      if (validation) {
        validationStringify = fastJson({
          type: 'array',
          items: {
            type: 'object',
            properties: {
              type: { type: 'string' },
              messages: {
                type: 'array',
                items: { type: 'string' }
              }
            }
          }
        });
      }
    }
  }
  return {
    validation,
    validationStringify
  };
};