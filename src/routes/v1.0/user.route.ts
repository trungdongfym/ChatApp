import express from 'express';
import passport from 'passport';
import LinkConst from '../../common/const/link.const';
import UserController from '../../controllers/user.controller';

const userRouter = express.Router();

const userCtrl = new UserController();

userRouter.use(passport.authenticate('jwt', { session: false, failureRedirect: '/login' }));

userRouter.get('/', userCtrl.listUser);

userRouter.post('/friendRequest', userCtrl.friendRequest);

userRouter.post('/', (req, res) => {
   console.log(req.body);
   res.render(LinkConst.viewMessagePath, { data: null, errors: null, info: null });
});

export default userRouter;
