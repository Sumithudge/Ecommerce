import mongoose from 'mongoose'
const couponSchema = new mongoose.Schema({ code:{type:String,unique:true,uppercase:true,trim:true}, type:{type:String,enum:['flat','percent'],default:'flat'}, value:{type:Number,required:true,min:0}, minOrder:{type:Number,default:0}, maxDiscount:{type:Number,default:0}, active:{type:Boolean,default:true}, expiresAt:Date },{timestamps:true})
export default mongoose.model('Coupon',couponSchema)
