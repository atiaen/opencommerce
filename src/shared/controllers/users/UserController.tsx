import * as argon2 from 'argon2';
import { describeClass,BackendMethod, remult, Controller, Remult } from "remult";
import { Users } from "../../entities/User/user";
import { ErrorCodes } from '../../utils/constants/errorCodes';
import ResponseObj from '../../utils/types/responseType';
import { sendEmail } from '../../utils/email_utils/email';
import { render } from "@react-email/render";
import WelcomeEmail from '@/src/email_templates/welcome_email';
import axios from "axios";

const devMode = process.env.DEVMODE;
const hostUrl = process.env.HOSTURL;

@Controller("UserController")
export default class UserController {

    static async signUp(user: any) {
        const userRepo = remult.repo(Users);
        const foundUser = await userRepo.findFirst({
            email_address: user.email_address
        })
        if (foundUser) {
            return {
                status: 400,
                message: "This email is already in use",
                messageCode: ErrorCodes.userExists
            }
        } else {
            try {
                const hashedPassword = await argon2.hash(user.password);
                user.password = hashedPassword;
                user.isAdmin = false;
                const savedUser = await userRepo.save(user);
                const fullName = `${user.first_name} ${user.last_name}`;
                const url = devMode === "true" ? 'http:localhost:3000' : hostUrl
                await sendEmail({
                    to: user.email_address,
                    subject: "Welcome to PharmaCom",
                    html: render(WelcomeEmail({ name: fullName }))
                })
                // axios.post(`${url}/api/send_mail`,{
                //     to: user.email_address,
                //     subject: "Welcome to PharmaCom",
                //     email_type: 1,
                //     name: `${fullName}`
                // })
                return {
                    status: 201,
                    message: "User Created Successfully",
                    response: savedUser
                };

            } catch (err) {
                console.log(err);
                return {
                    status: 500,
                    message: "An Error has occured",
                    messageCode: `${ErrorCodes.unknownError}`
                }
            }
        }


    }

    static async getAdminUserByEmailPassword(email: string, password: string) {
        try {
            const userRepo = await remult.repo(Users);
            const foundUser = await userRepo.findFirst({ email_address: email, isAdmin: true, is_deleted: 0 })
            if (foundUser) {
                const correctPass = await argon2.verify(foundUser.password, password)
                if (correctPass) {
                    return {
                        status: 200,
                        message: "Logged in successfully",
                        response: foundUser,
                    }
                } else {
                    return {
                        status: 400,
                        message: "Email/password is incorrect"
                    }
                }
            } else {
                return {
                    status: 404,
                    message: "User not found",
                }
            }
        } catch (error) {
            console.log(error);
        }
       
    }

    @BackendMethod({ allowed: true })
    static async getAllUsers() {
        const usersRepo = await remult.repo(Users);
        const users = await usersRepo.find({
            where: {
                is_deleted: 0
            }
        });
        return users;
    }

    @BackendMethod({ allowed: true })
    static async getUsersCount() {
        const usersRepo = await remult.repo(Users);
        const users = await usersRepo.count({
            is_deleted: 0
        });
        return users;
    }

    @BackendMethod({ allowed: true })
    static async login(email_address: string, password: string): Promise<ResponseObj> {
        const userRepo = await remult.repo(Users);
        const foundUser = await userRepo.findFirst({
            email_address: email_address
        })
        if (foundUser) {
            const correctPass = await argon2.verify(foundUser.password, password);
            if (correctPass) {
                return {
                    status: 200,
                    message: "Logged in successfully",
                    response: foundUser,
                }
            } else {
                return {
                    status: 400,
                    message: "Email/password is incorrect"
                }
            }
        } else {
            return {
                status: 404,
                message: "User not found",
            }
        }
    }

    // @BackendMethod({ allowed: true })
  
    static hashPassword: (password:string) => void
}

describeClass(UserController, undefined, undefined, {
    signUp: BackendMethod({ allowed: true }),
    getAdminUserByEmailPassword: BackendMethod({ allowed:true })
  })
