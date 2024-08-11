import nodemailer from "nodemailer"
import { EMAIL_USER, EMAIL_PASS } from "../dao/dao.factory.js"

const transporter=nodemailer.createTransport(
    {
        service: "gmail", 
        port: 465,
        auth: {
            user: EMAIL_USER,
            pass: EMAIL_PASS
        }
    }
)

const sendEmail= async (to, subject, html)=>{
    const mailOptions = {
        from: `"Santiago Beltran" <${EMAIL_USER}>`,
        to, 
        subject,
        // text: "prueba de mail con texto plano",
        html //`<h2>Prueba de envío de mails</h2><p><strong style="color: red;">Hola...!!!</strong></p>`

    };

    try {
        const info = await transporter.sendMail(mailOptions);
        console.log ("Email sent: ", info.response);
    }catch (error){
        console.error ("Error sending email:", error.message);
        throw new Error ("Error sending email");
    }
          
};



export default sendEmail;
