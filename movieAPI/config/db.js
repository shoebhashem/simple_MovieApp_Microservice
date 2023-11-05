const mongoose = require("mongoose") 
const dotenv = require ( 'dotenv')
var dbServer = '127.0.0.1:27017';
const dbName = 'movieStore';
const dbPort = '27017';
dotenv.config()

//const MONGODB_URL = process.env.MONGODB_URL

const db = async () => {
    try {
        if (process.env.APPSTORE_RS) {
            console.log('This is a replicaset:', process.env.APPSTORE_RS);
            let connection = process.env.APPSTORE_RS;
            let user = process.env.APPSTORE_USER || 'noUserSet';
            let pw = process.env.APPSTORE_PW || 'noPasswordSet';
            let authsource = process.env.MONGO_AUTHSOURCE || 'noAuthSourceSet';

            const con = await mongoose.connect(connection, {
                user: user,
                pass: pw,
                authSource: authsource,
            });
            console.log(`Connected to database ${dbName}`);
        } else {
            if (!process.env.APPSTORE_HOST) {
                console.log('WARNING: the environment variable APPSTORE_HOST is not set');
            } else {
                dbServer = process.env.APPSTORE_HOST + ':' + dbPort;
            }

            let connection = `mongodb://${dbServer}/${dbName}`;
            const con = await mongoose.connect(connection);
            console.log(`Connected to database ${dbName}`);
        }
    } catch (error) {
        console.error(error);
    }
}

module.exports = db