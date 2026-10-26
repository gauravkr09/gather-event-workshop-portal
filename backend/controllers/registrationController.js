import mongoose from 'mongoose'; import Event from '../models/Event.js'; import Registration from '../models/Registration.js';
import {validEmail,validPhone} from '../utils/validation.js';
export async function createRegistration(req,res,next){
 let reservedEventId=null;
 try{
  const fullName=String(req.body.fullName||'').trim(),email=String(req.body.email||'').trim().toLowerCase(),contactNumber=String(req.body.contactNumber||'').trim(),eventId=String(req.body.eventId||req.body.event||'');
  if(!fullName||!email||!contactNumber||!eventId)return res.status(400).json({success:false,message:'Full name, email, contact number, and event are required'});
  if(!validEmail(email))return res.status(400).json({success:false,message:'Enter a valid email address'});
  if(!validPhone(contactNumber))return res.status(400).json({success:false,message:'Enter a valid contact number (at least 7 digits)'});
  if(!mongoose.isValidObjectId(eventId))return res.status(400).json({success:false,message:'Invalid event selection'});
  const event=await Event.findById(eventId);if(!event)return res.status(404).json({success:false,message:'Selected event does not exist'});
  if(event.status==='Completed'||new Date(event.date)<new Date())return res.status(409).json({success:false,message:'Registration is closed for completed or past events'});
  const duplicate=await Registration.exists({event:eventId,email});if(duplicate)return res.status(409).json({success:false,message:'This email is already registered for this event'});
  // Atomic conditional increment reserves one seat; concurrent requests cannot exceed capacity.
  const reserved=await Event.findOneAndUpdate({_id:eventId,status:{$ne:'Completed'},$expr:{$lt:['$registrationsCount','$totalSeats']}},{$inc:{registrationsCount:1}},{new:true});
  if(!reserved)return res.status(409).json({success:false,message:'This event is full or registration is unavailable'});
  reservedEventId=eventId;
  const registration=await Registration.create({event:eventId,fullName,email,contactNumber});
  res.status(201).json({success:true,message:'Registration successful',data:{registrationId:registration._id,fullName,event:{id:reserved._id,title:reserved.title,date:reserved.date,time:reserved.time,venue:reserved.venue},availableSeats:reserved.totalSeats-reserved.registrationsCount}});
 }catch(e){if(reservedEventId){await Event.updateOne({_id:reservedEventId,registrationsCount:{$gt:0}},{$inc:{registrationsCount:-1}}).catch(()=>{});reservedEventId=null;}if(e.code===11000)return res.status(409).json({success:false,message:'This email is already registered for this event'});next(e)}
}
export async function listRegistrations(req,res,next){try{const rows=await Registration.find().populate('event','title date category').sort({createdAt:-1}).lean();res.json({success:true,data:rows})}catch(e){next(e)}}
export async function listEventRegistrations(req,res,next){try{if(!mongoose.isValidObjectId(req.params.eventId))return res.status(400).json({success:false,message:'Invalid event ID'});const rows=await Registration.find({event:req.params.eventId}).select('-__v').sort({createdAt:-1}).lean();res.json({success:true,data:rows})}catch(e){next(e)}}
