import {Router} from 'express'; import {createRegistration,listRegistrations,listEventRegistrations} from '../controllers/registrationController.js';import {adminAuth} from '../middleware/adminAuth.js';
const router=Router();router.post('/',createRegistration);router.get('/',adminAuth,listRegistrations);router.get('/event/:eventId',adminAuth,listEventRegistrations);export default router;
