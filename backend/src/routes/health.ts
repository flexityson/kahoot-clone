import { Router } from 'express';
const router = Router();
router.get('/', (_, res) => res.sendStatus(200));
export default router;
