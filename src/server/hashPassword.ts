import * as argon2 from 'argon2';
import UserController from '../shared/controllers/users/UserController';
UserController.hashPassword = pass => argon2.hash(pass);