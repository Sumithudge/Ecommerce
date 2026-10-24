import express from 'express'
import { requireAuth, requireAdmin } from '../middleware/auth.js'
import {
  listBanners,
  adminListBanners,
  createBanner,
  updateBanner,
  deleteBanner,
} from '../controllers/bannerController.js'

const router = express.Router()

router.get('/', listBanners)
router.get('/admin', requireAuth, requireAdmin, adminListBanners)
router.post('/', requireAuth, requireAdmin, createBanner)
router.put('/:id', requireAuth, requireAdmin, updateBanner)
router.delete('/:id', requireAuth, requireAdmin, deleteBanner)

export default router
