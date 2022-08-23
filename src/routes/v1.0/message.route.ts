import express from 'express';
import passport from 'passport';
import LinkConst from '../../common/const/link.const';
import ChatController from '../../controllers/chat.controller';

const messageRouter = express.Router();

const chatCtrl = new ChatController();

messageRouter.use(passport.authenticate('jwt', { session: false, failureRedirect: '/login' }));

messageRouter.get('/', chatCtrl.getHomeMessage);

messageRouter.post('/', (req, res) => {
   console.log(req.body);
   res.render(LinkConst.viewMessagePath, { data: null, errors: null, info: null });
});

export default messageRouter;
