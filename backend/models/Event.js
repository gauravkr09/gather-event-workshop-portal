import mongoose from 'mongoose';
const eventSchema = new mongoose.Schema({
  title:{type:String,required:true,trim:true,maxLength:120},
  category:{type:String,required:true,enum:['Technology','Business','Design','Workshop']},
  description:{type:String,required:true,trim:true,maxLength:3000},
  date:{type:Date,required:true}, time:{type:String,required:true,match:/^([01]\d|2[0-3]):[0-5]\d$/},
  venue:{type:String,required:true,trim:true,maxLength:180},
  image:{type:String,default:''}, totalSeats:{type:Number,required:true,min:1,max:100000},
  registrationsCount:{type:Number,default:0,min:0},
  status:{type:String,enum:['Upcoming','Ongoing','Completed'],default:'Upcoming'}
},{timestamps:true});
eventSchema.index({date:1}); eventSchema.index({category:1});
eventSchema.virtual('availableSeats').get(function(){return Math.max(0,this.totalSeats-this.registrationsCount)});
eventSchema.set('toJSON',{virtuals:true}); eventSchema.set('toObject',{virtuals:true});
export default mongoose.model('Event',eventSchema);
