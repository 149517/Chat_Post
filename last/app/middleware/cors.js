// app/middleware/cors.js

module.exports = () => {
    return async (ctx, next) => {
      ctx.set('Access-Control-Allow-Origin', ctx.headers.origin);
      ctx.set('Access-Control-Allow-Methods', 'OPTIONS, GET, PUT, POST, DELETE');
      ctx.set('Access-Control-Allow-Headers', 'x-requested-with, accept, origin, content-type');
      ctx.set('Access-Control-Allow-Credentials', true);
      ctx.set('Access-Control-Max-Age', 86400);
  
      if (ctx.method === 'OPTIONS') {
        ctx.status = 204;
      } else {
        await next();
      }
    };
  };
  