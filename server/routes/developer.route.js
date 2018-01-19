'use strict';
var dbCloudant = require('../service/cloudant.service');
var db = dbCloudant.getDevInfo();

module.exports = function (app) {
    app.post('/submit-developer', function(req, res) {
        db.insert({
            developer_name: req.body.name,
            developer_address: req.body.address,
            developer_contact_person: req.body.contact_person,
            developer_project_developer_subsidiary_name: req.body.name, 
            developer_project_project_name: req.body.project_name,
            developer_project_address: req.body.project_address,
            developer_project_contact_person: req.body.project_contact_person,
            developer_project_email: req.body.project_email,
            developer_project_commission_rate: req.body.project_commission_rate,
            developer_project_sales_cluster: req.body.project_sales_cluster

        }, function (err, doc) {
            if (err) {
                console.log(err);                
            } else {
                console.log('Insert completed ' + JSON.stringify(doc));
                res.status(200).json({ 'alertMessage': 'Insert completed' });
            }

        });
    });

}