import express from 'express'
import {requireAuth} from '../middleware/auth.js'
import {wishlist,toggleWishlist,addresses,addAddress,deleteAddress,reviews,createReview,applyCoupon} from '../controllers/storeController.js'
const router=express.Router()
router.get('/wishlist',requireAuth,wishlist)
router.post('/wishlist/:productId',requireAuth,toggleWishlist)
router.get('/addresses',requireAuth,addresses)
router.post('/addresses',requireAuth,addAddress)
router.delete('/addresses/:id',requireAuth,deleteAddress)
router.get('/reviews/:productId',reviews)
router.post('/reviews/:productId',requireAuth,createReview)
router.post('/coupons/apply',applyCoupon)
export default router
