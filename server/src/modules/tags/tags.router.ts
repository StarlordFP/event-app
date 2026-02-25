import { Router } from 'express';
import { TagsController } from './tags.controller';

const router = Router();
const ctrl = new TagsController();

router.get('/', ctrl.list);

export { router as tagsRouter };
