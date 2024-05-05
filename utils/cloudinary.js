const cloudinary = require('cloudinary');
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_APIKEY,
    api_secret: process.env.CLOUDINARY_APISECRET,
    // secure_url: process.env.CLOUDINARY_URL,

});

// const cloudinaryUploadImg = async (fileToUploads) => {
//     return new Promise((resolve) => {
//         cloudinary.uploader.upload(fileToUploads, (result) => {
//             resolve({
//                 url: result.secure_url
//             }, {
//                 resource_type: "auto"
//             }
//             )
//         })
//     })
// }


const cloudinaryUploadImg = async (fileToUploads) => {
    return new Promise((resolve) => {
        cloudinary.uploader.upload(fileToUploads, (result) => {
            resolve(
                {
                    url: result.secure_url,
                    asset_id: result.asset_id,
                    public_id: result.public_id,
                },
                {
                    resource_type: "auto",
                }
            );
        });
    });
};

module.exports = cloudinaryUploadImg