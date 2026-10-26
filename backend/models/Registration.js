import mongoose from 'mongoose';
const registrationSchema = new mongoose.Schema({
  event:{type:mongoose.Schema.Types.ObjectId,ref:'Event',required:true,index:true},
  fullName:{type:String,required:true,trim:true,maxLength:100},
  email:{type:String,required:true,trim:true,lowercase:true,maxLength:254},
  contactNumber:{type:String,required:true,trim:true,maxLength:20}
},{timestamps:true});
registrationSchema.index({event:1,email:1},{unique:true});
export default mongoose.model('Registration',registrationSchema);
