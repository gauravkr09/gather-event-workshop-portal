import jwt from 'jsonwebtoken';
export async function login(req,res,next){try{
 const email=String(req.body.email||'').trim().toLowerCase(), password=String(req.body.password||'');
 if(!email||!password) return res.status(400).json({success:false,message:'Email and password are required'});
 const configuredEmail=String(process.env.ADMIN_EMAIL||'').trim().toLowerCase(), configuredPassword=process.env.ADMIN_PASSWORD;
 if(!configuredEmail||!configuredPassword||email!==configuredEmail||password!==configuredPassword) return res.status(401).json({success:false,message:'Invalid admin credentials'});
 if(!process.env.JWT_SECRET) throw new Error('JWT_SECRET is not configured');
 const token=jwt.sign({email,role:'admin'},process.env.JWT_SECRET,{expiresIn:'8h'});
 res.cookie('adminToken',token,{httpOnly:true,sameSite:'lax',secure:process.env.NODE_ENV==='production',maxAge:8*60*60*1000});
 res.json({success:true,message:'Login successful',data:{email}});
 }catch(e){next(e)}}
export function logout(req,res){res.clearCookie('adminToken',{httpOnly:true,sameSite:'lax',secure:process.env.NODE_ENV==='production'});res.json({success:true,message:'Logged out successfully'});}
export function me(req,res){res.json({success:true,data:{email:req.admin.email,role:req.admin.role}})}
