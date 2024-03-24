import Router from 'express';
import ImageItemController from '../controller/ImageItemController.js';

const router = new Router();

router.post('/item', ImageItemController.create);
router.get('/items', ImageItemController.getAll);
router.get('/item/:id', ImageItemController.getOne);
router.put('/item', ImageItemController.updateOne);
router.delete('/item/:id', ImageItemController.deleteOne);

export default router;
