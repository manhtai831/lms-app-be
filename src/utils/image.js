const fs = require('fs');
var path = require('path');
const {getNowMilliseconds} = require("./utils");
var dir = path.join(__dirname, '../images');


const readline = require('readline');
const {google} = require('googleapis');

// If modifying these scopes, delete token.json.
const SCOPES = ['https://www.googleapis.com/auth/drive.file'];
const TOKEN_PATH = 'token.json';

/**
 * Create an OAuth2 client with the given credentials, and then execute the given callback function.
 */
async function authorize(credentials, callback) {
    const {client_secret, client_id, redirect_uris} = credentials.web;
    const oAuth2Client = new google.auth.OAuth2(
        client_id, client_secret, redirect_uris[0]);
    
    // Check if we have previously stored a token.
    fs.readFile(TOKEN_PATH, async(err, token) => {
        if(err) return getAccessToken(oAuth2Client, callback);
        oAuth2Client.setCredentials(JSON.parse(token));
        await callback(oAuth2Client);
        // return oAuth2Client;
    });
}

/**
 * Get and store new token after prompting for user authorization, and then
 * execute the given callback with the authorized OAuth2 client.
 * @param {google.auth.OAuth2} oAuth2Client The OAuth2 client to get token for.
 * @param {getEventsCallback} callback The callback for the authorized client.
 */
function getAccessToken(oAuth2Client, callback) {
    const authUrl = oAuth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: SCOPES,
    });
    console.log('Authorize this app by visiting this url:', authUrl);
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    });
    rl.question('Enter the code from that page here: ', (code) => {
        console.log(code)
        rl.close();
        oAuth2Client.getToken(code, (err, token) => {
            if(err) return console.error('Error retrieving access token', err);
            oAuth2Client.setCredentials(token);
            // Store the token to disk for later program executions
            fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
                if(err) return console.error(err);
                console.log('Token stored to', TOKEN_PATH);
            });
            callback(oAuth2Client);
        });
    });
}

/**
 * Describe with given media and metaData and upload it using google.drive.create method()
 */
var fileUploadId;

async function uploadFile(auth) {
    const drive = google.drive({version: 'v3', auth});
    var folderId = '1iQNdCSjzNMVEgvU5fgYcJ_ZYQeI7fGs1';
    
    const fileMetadata = {
        'name': getNowMilliseconds() + '.' + extension,
        parents: [folderId]
    };
    const media = {
        mimeType: 'image/png',
        body: fs.createReadStream('fileName')
    };
    
    await drive.files.create({
        resource: fileMetadata,
        media: media,
        fields: 'id'
    }, (err, file) => {
        if(err) {
            // Handle error
            console.error(err);
        } else {
            console.log('File Id: ', file.data.id);
            fileUploadId = file.data.id;
            drive.permissions.create({
                fileId: fileUploadId,
                requestBody: {
                    role: 'reader',
                    type: 'anyone',
                }
            });
        }
    });
    
}

var extension;
var p;
var base64;

const wait = (seconds) =>
    new Promise(resolve =>
        setTimeout(() =>
            resolve(true), seconds * 1000))

async function uploadImage(mBase64) {
    base64 = mBase64.split(',');
    var content = mBase64.split(';')[0].split(':')[1];
    extension = content.split('/')[1];
    p = 'image' + getNowMilliseconds() + '-' + content.split('/')[0] + '.' + extension;
    await fs.writeFileSync('fileName', Buffer.from(base64[1], "base64"));
    
    await fs.readFile('credentials.json', async(err, content) => {
        if(err) return console.log('Error loading client secret file:', err);
        // Authorize a client with credentials, then call the Google Drive API.
        await authorize(JSON.parse(content), uploadFile);
        
    });
    await wait(3);
    console.log(extension);
    console.log('JPEG,GIF,PNG,TIFF,RAW,PSD'.includes(extension));
    console.log('https://drive.google.com/file/d/' + fileUploadId + '/view');
    // https://drive.google.com/uc?export=view&id=1VdjEgb0aZl9IZa2jOzGU5_SNbmlmeiCj
    //https://drive.google.com/uc?export=download&id=1PpUCg8U0YkedIPYmm2NtLXt00JsdBJt2
    //https://drive.google.com/file/d/{id}/view
    //http://drive.google.com/thumbnail?id=
    if('JPEG,GIF,PNG,TIFF,RAW,PSD'.includes(extension)) {
        return {
            'type': content,
            'url': 'https://drive.google.com/uc?export=view&id=' + fileUploadId
        }
    } else{
        return {
            'type': content,
            'url': 'https://drive.google.com/file/d/' + fileUploadId + '/view'
        }
    }
    
}

module.exports = {
    uploadImage
}