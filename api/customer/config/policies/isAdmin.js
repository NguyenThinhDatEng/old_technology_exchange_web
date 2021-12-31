module.exports = async (ctx, next) => {
  console.log(ctx.state.user);
  if (ctx.state.user.role.name === "Administrator") {
    // Go to next policy or will reach the controller's action.
    return await next();
  }

  ctx.unauthorized(`You're not allowed to perform this action!`);
};
