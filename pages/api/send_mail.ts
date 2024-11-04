import type { NextApiRequest, NextApiResponse } from "next";
import { render } from "@react-email/render";
import WelcomeEmail from "@/src/email_templates/welcome_email";
import { sendEmail } from "@/src/shared/utils/email_utils/email";
import OrderPlaced from "@/src/email_templates/order_placed";
import OrderStatus from "@/src/email_templates/order_status";


export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse,
) {
    const { body } = req
    const fullName = body.name
    const reserveNum = body.reserveNum
    const status = body.status
    await sendEmail({
        to: body.to,
        subject: body.subject,
        html: body.email_type === 1 ? render(WelcomeEmail({ name: fullName })) 
            : body.email_type === 2 ? render(OrderPlaced({
            name: fullName,
            reserveNum: reserveNum
        })) 
            : body.email_type === 3 ? render(OrderStatus({
            name: fullName,
            reserveNum: reserveNum,
            order_status:status
        })) : "This is an unneccesary email"
    });

    return res.status(200).json({ message: "Email sent successfully" });
}
