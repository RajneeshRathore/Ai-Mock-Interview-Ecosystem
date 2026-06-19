import express from 'express';
import communityController from './community.controller.js';
import { protect } from '../../middleware/auth.middleware.js';

const router = express.Router();

// All community routes require authentication
router.use(protect);

router.get('/', communityController.getPosts);
router.get('/:id', communityController.getPostById);
router.post('/', communityController.createPost);
router.put('/:id/upvote', communityController.toggleUpvote);
router.post('/:id/comments', communityController.addComment);
router.put('/:postId/comments/:commentId/upvote', communityController.toggleCommentUpvote);
router.delete('/:id', communityController.deletePost);

export default router;
