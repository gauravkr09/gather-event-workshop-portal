export function notFound(req,res,next){res.status(404).json({success:false,message:`Route not found: ${req.method} ${req.path}`});}
export function errorHandler(err,req,res,next){
  console.error(err.message);
  if(err.name==='ValidationError') return res.status(400).json({success:false,message:Object.values(err.errors).map(e=>e.message).join(', ')});
  if(err.name==='CastError') return res.status(400).json({success:false,message:'Invalid resource ID'});
  if(err.code===11000) return res.status(409).json({success:false,message:'This email is already registered for this event'});
  const status=err.statusCode||500;
  res.status(status).json({success:false,message:status===500?'Unexpected server error. Please try again.':err.message});
}
