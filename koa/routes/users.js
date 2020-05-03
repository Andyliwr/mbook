module.exports =  (router) => {
  router.get('/user', async function (ctx, next) {
    ctx.body = 'this a users response!';
  })
}
