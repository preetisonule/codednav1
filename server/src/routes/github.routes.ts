import { Router } from 'express';
import { analyze, getProfile, getRepos } from '../controllers/github.controller';

const router = Router();

// GET /api/github/:username/profile
router.get('/:username/profile', getProfile);

// GET /api/github/:username/repos
router.get('/:username/repos', getRepos);

// GET /api/github/:username/analyze
router.get('/:username/analyze', analyze);

export default router;
