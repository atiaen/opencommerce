

import nextConnect from "next-connect";
import multer from "multer";

let filename = `${new Date().toISOString().split("T")[0]}__`;
const upload = multer({
    storage: multer.diskStorage({
        destination: "./public/product_images", // destination folder
        filename: (req, file, cb) => cb(null, getFileName(file,req)),
    }),
});

const getFileName = (file: Express.Multer.File,req:any) => {
    const { body } = req
    filename += `${body.product_name}__${file.originalname.substring(0,file.originalname.lastIndexOf("."))}`+ "." +
        file.originalname.substring(
            file.originalname.lastIndexOf(".") + 1,
            file.originalname.length
        );
    return filename;
};

const apiRoute = nextConnect({
    onError(error, req: any, res: any) {
        console.log(error);
        res
            .status(501)
            .json({ error: `Sorry something Happened! ${error.message}` });
    },
    onNoMatch(req, res) {
        res.status(405).json({ error: `Method '${req.method}' Not Allowed` });
    },
});

apiRoute.use(upload.array("image")); // attribute name you are sending the file by 

apiRoute.post((req, res) => {
    res.status(200).json({status:200, message: 'Uploaded', file_name: filename }); // response
});

export default apiRoute;

export const config = {
    api: {
        bodyParser: false, // Disallow body parsing, consume as stream
    },
};
