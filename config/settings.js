/**
 * Created by Sahil Jain on 20/09/2014.
 */
exports.init = function () {

    exports.ipaddress = process.env.OPENSHIFT_NODEJS_IP;
    exports.port = process.env.OPENSHIFT_NODEJS_PORT || 8080;
    if (process.env.OPENSHIFT_MONGODB_DB_PASSWORD) {
        console.log("running on openshift");
        exports.connection_string = process.env.OPENSHIFT_MONGODB_DB_URL + 'hackthenorth';
    } else {
        console.log("using local db");
        exports.connection_string = "mongodb://localhost/hackthenorth";
    }
    if (typeof exports.ipaddress === "undefined") {
        console.warn('No OPENSHIFT_NODEJS_IP var, using 127.0.0.1');
        exports.ipaddress = "127.0.0.1";
    }
};