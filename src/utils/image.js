const fs = require('fs');
var path = require('path');
const {getNowMilliseconds} = require("./utils");
var dir = path.join(__dirname, '../images');


 async function uploadImage(mBase64){
    var base64 = mBase64.split(',');
    var content = mBase64.split(';')[0].split(':')[1];
    var extension = content.split('/')[1];
    var p ='image' + getNowMilliseconds() + '-'+content.split('/')[0]+'.' + extension;
    await fs.writeFileSync(dir +'/' + p, new Buffer(base64[1], "base64"));
    return {
        'type' : content,
        'url' : 'api/upload?g=' + p
    }
}

module.exports ={
    uploadImage
}