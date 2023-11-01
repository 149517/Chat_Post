module.exports = options =>{
    return async (ctx,next)=>{
        const token = ctx.request.header.authorization;
        if(token){
            const uid = await ctx.service.jwt.getUserIdFromToken(token)
            ctx.state.uid = uid
        }
        await next();
    }
}