var textUtils = require("../utils/textutils");
var tokenUtils = require("../utils/tokenutils");
var Clinic = require("../models/clinic");

exports.signup = function(req, res) {
    var clinicName = req.body.clinicName;
    var ownerEmail = req.body.ownerEmail;
    var ownerPassword = req.body.ownerPassword;
    var clinicAddress = req.body.clinicAddress;
    var openTime = req.body.openTime;
    var closeTime = req.body.closeTime;

    if(textUtils.isEmpty(clinicName) ||
        textUtils.isEmpty(ownerEmail) ||
        textUtils.isEmpty(ownerPassword) ||
        textUtils.isEmpty(clinicAddress) ||
        textUtils.isEmpty(openTime) ||
        textUtils.isEmpty(closeTime)) {
        return res.status(400).json({error: "You left at least 1 parameter empty"});
    }

    Clinic.findOne({"ownerEmail":ownerEmail}, function (err, clinic) {
        if(err) {
            return serverError(res);
        }
        if (clinic) {
            return res.status(403).json({error: "email is already in use"});
        }

        var newClinic = new Clinic();

        newClinic.clinicName = clinicName;
        newClinic.ownerEmail = ownerEmail;
        newClinic.ownerPassword = newClinic.generateHash(ownerPassword);
        newClinic.openTime = openTime;
        newClinic.closeTime = closeTime;
        newClinic.clinicAddress = clinicAddress;
        newClinic.dateCreated = Date.now();
        newClinic.save(function (err, doc) {
            if (err) {
                return serverError(res);
            }
            var token = tokenUtils.generateTokenFromDocument(doc);
            return res.json({token: token});
        });
    });
};

exports.login = function (req, res) {
    var email = req.body.ownerEmail;
    var password = req.body.ownerPassword;

    if (textUtils.isEmpty(email) || textUtils.isEmpty(password)) {
        return res.status(400).json({error: "Do not leave email or password as empty"});
    }

    Clinic.findOne({"ownerEmail":email}, function (err, clinic) {
        if (err) {
            return serverError(res);
        }
        if (clinic) {
            if(clinic.validPassword(password)) {
                var token = tokenUtils.generateTokenFromDocument(clinic);
                return res.json({token: token});
            } else {
                return res.status(401).json({error: "Invalid password"});
            }
        } else {
            return res.status(401).json({error: "Invalid email"});
        }
    });
};