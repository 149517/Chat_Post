'use strict';
/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller } = app;
  router.get('/', controller.home.index);
  router.get('/user/all', controller.user.all);
  router.post('/login', controller.user.launch_login);
  router.post('/register', controller.user.launch_register);
  router.post('/user/userHead', controller.user.getUserHead);

  router.get('/post/all', controller.post.postAll);
  router.get('/post/list/:id', controller.post.postData);
  router.post('/post/upload', controller.post.getUpload);
  router.post('/post/interact', controller.post.postInteract);
  router.post('/post/dataUpload', controller.post.modifyData);
  router.post('/post/addComment', controller.post.addCom);
  router.post('/post/getComment', controller.post.getCom);

  // socket.io
  // io.of('/').route('res', io.controller.default.ping);
};
