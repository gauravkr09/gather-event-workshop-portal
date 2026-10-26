import jwt from 'jsonwebtoken';
export function adminAuth(req,res,next){
  const token=req.cookies?.adminToken || (req.headers.authorization?.startsWith('Bearer ')?req.headers.authorization.slice(7):null);
  if(!token) return res.status(401).json({success:false,message:'Please log in as an administrator'});
  try { const payload=jwt.verify(token,process.env.JWT_SECRET); if(payload.role!=='admin') throw new Error('Invalid role'); req.admin=payload; next(); }
  catch { return res.status(401).json({success:false,message:'Your admin session is invalid or expired'}); }
}
