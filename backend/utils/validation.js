export const categories=['Technology','Business','Design','Workshop'];
export const statuses=['Upcoming','Ongoing','Completed'];
export function validEmail(email){return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)}
export function validPhone(phone){return /^[+]?[-\d()\s]{7,20}$/.test(phone) && phone.replace(/\D/g,'').length>=7}
export function validateEvent(body){
 const errors=[];
 for(const key of ['title','category','description','date','time','venue','totalSeats','status']) if(body[key]===undefined||String(body[key]).trim()==='') errors.push(`${key} is required`);
 if(body.category&&!categories.includes(body.category)) errors.push('Invalid category');
 if(body.status&&!statuses.includes(body.status)) errors.push('Invalid status');
 if(body.date && Number.isNaN(new Date(body.date).getTime())) errors.push('Invalid date');
 if(body.time&&!/^([01]\d|2[0-3]):[0-5]\d$/.test(body.time)) errors.push('Time must use 24-hour HH:mm format');
 if(body.totalSeats!==undefined&&(!Number.isInteger(Number(body.totalSeats))||Number(body.totalSeats)<1)) errors.push('Total seats must be a positive whole number');
 if(body.image && !/^https?:\/\//i.test(body.image)) errors.push('Image must be a valid http/https URL');
 return errors;
}
