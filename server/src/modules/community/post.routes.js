import express from 'express';
import postController from './post.controller.js';
import { protect } from '../../middleware/auth.middleware.js';

const router = express.Router();

router.use(protect);

router.get('/', postController.getPosts);
router.post('/', postController.createPost);
router.get('/:id', postController.getPost);
router.post('/:id/upvote', postController.toggleUpvote);
router.post('/:id/comment', postController.addComment);
router.delete('/:id', postController.deletePost);

export default router;
