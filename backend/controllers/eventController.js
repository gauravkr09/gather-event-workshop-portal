import mongoose from 'mongoose';
import Event from '../models/Event.js'; import Registration from '../models/Registration.js';
import {validateEvent} from '../utils/validation.js';
export async function listEvents(req,res,next){try{
 const {search='',category,sort='earliest',status}=req.query; const filter={};
 if(search.trim()) filter.title={$regex:search.trim().replace(/[.*+?^${}()|[\]\\]/g,'\\$&'),$options:'i'};
 if(category&&category!=='All Categories') filter.category=category;
 if(status) filter.status=status;
 const sortSpec=sort==='latest'?{date:-1}:{date:1};
 const events=await Event.find(filter).sort(sortSpec).lean();
 const data=events.map(e=>({...e,availableSeats:Math.max(0,e.totalSeats-(e.registrationsCount||0)),status:e.status||'Upcoming'}));
 res.json({success:true,data});
 }catch(e){next(e)}}
export async function getEvent(req,res,next){try{if(!mongoose.isValidObjectId(req.params.id)) return res.status(400).json({success:false,message:'Invalid event ID'});const e=await Event.findById(req.params.id).lean();if(!e)return res.status(404).json({success:false,message:'Event not found'});res.json({success:true,data:{...e,availableSeats:Math.max(0,e.totalSeats-e.registrationsCount)}})}catch(e){next(e)}}
export async function createEvent(req,res,next){try{const errors=validateEvent(req.body);if(errors.length)return res.status(400).json({success:false,message:errors.join('. ')});const event=await Event.create({...req.body,totalSeats:Number(req.body.totalSeats)});res.status(201).json({success:true,message:'Event created successfully',data:event})}catch(e){next(e)}}
export async function updateEvent(req,res,next){try{
 if(!mongoose.isValidObjectId(req.params.id))return res.status(400).json({success:false,message:'Invalid event ID'});
 const errors=validateEvent(req.body);if(errors.length)return res.status(400).json({success:false,message:errors.join('. ')});
 const current=await Event.findById(req.params.id);if(!current)return res.status(404).json({success:false,message:'Event not found'});
 if(Number(req.body.totalSeats)<current.registrationsCount)return res.status(409).json({success:false,message:`Capacity cannot be lower than ${current.registrationsCount} existing registrations`});
 Object.assign(current,req.body,{totalSeats:Number(req.body.totalSeats)});await current.save();res.json({success:true,message:'Event updated successfully',data:current});
 }catch(e){next(e)}}
export async function deleteEvent(req,res,next){try{
 if(!mongoose.isValidObjectId(req.params.id))return res.status(400).json({success:false,message:'Invalid event ID'});
 const session=await mongoose.startSession();try{await session.withTransaction(async()=>{const event=await Event.findById(req.params.id).session(session);if(!event){const e=new Error('Event not found');e.statusCode=404;throw e;}await Registration.deleteMany({event:event._id},{session});await Event.deleteOne({_id:event._id},{session});});}finally{await session.endSession();}
 res.json({success:true,message:'Event and associated registrations deleted'});
 }catch(e){if(e.message?.includes('Transaction numbers are only allowed')||e.message?.includes('replica set')){e.statusCode=503;e.message='Event deletion requires MongoDB running as a replica set. Configure a replica set and retry.';}next(e)}}
