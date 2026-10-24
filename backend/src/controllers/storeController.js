import User from '../models/User.js'
import Product from '../models/Product.js'
import Review from '../models/Review.js'
import Coupon from '../models/Coupon.js'

export async function wishlist(req,res){ const u=await User.findById(req.user._id).populate('wishlist'); res.json(u.wishlist||[]) }
export async function toggleWishlist(req,res){ const u=await User.findById(req.user._id); const id=String(req.params.productId); const exists=u.wishlist.some(x=>String(x)===id); if(exists) u.wishlist=u.wishlist.filter(x=>String(x)!==id); else {const p=await Product.findById(id); if(!p)return res.status(404).json({message:'Product not found'}); u.wishlist.push(p._id)} await u.save(); res.json({wishlist:u.wishlist,added:!exists}) }
export async function addresses(req,res){const u=await User.findById(req.user._id);res.json(u.addresses||[])}
export async function addAddress(req,res){const u=await User.findById(req.user._id);u.addresses.push(req.body);await u.save();res.status(201).json(u.addresses.at(-1))}
export async function deleteAddress(req,res){const u=await User.findById(req.user._id);const a=u.addresses.id(req.params.id);if(a)a.deleteOne();await u.save();res.json(u.addresses)}
export async function reviews(req,res){res.json(await Review.find({product:req.params.productId}).populate('user','name').sort({createdAt:-1}))}
export async function createReview(req,res){const {rating,title='',comment=''}=req.body;const review=await Review.findOneAndUpdate({product:req.params.productId,user:req.user._id},{rating,title,comment},{new:true,upsert:true,setDefaultsOnInsert:true});const stats=await Review.aggregate([{$match:{product:review.product}},{$group:{_id:null,avg:{$avg:'$rating'},count:{$sum:1}}}]);await Product.findByIdAndUpdate(review.product,{rating:Number(stats[0]?.avg||0).toFixed(1),reviews:stats[0]?.count||0});res.status(201).json(review)}
export async function applyCoupon(req,res){const coupon=await Coupon.findOne({code:String(req.body.code||'').toUpperCase(),active:true});const subtotal=Number(req.body.subtotal||0);if(!coupon||(coupon.expiresAt&&coupon.expiresAt<new Date())||subtotal<coupon.minOrder)return res.status(400).json({message:'Invalid or unavailable coupon'});let discount=coupon.type==='percent'?subtotal*coupon.value/100:coupon.value;if(coupon.maxDiscount>0)discount=Math.min(discount,coupon.maxDiscount);res.json({code:coupon.code,discount:Math.min(Math.round(discount),subtotal)})}
