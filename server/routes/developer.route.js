'use strict';
var dbCloudant = require('../services/cloudant.service');
var db = dbCloudant.getDevInfo();

module.exports = function (app) {
    // API to search input text from all fields (Case-insensitive)
    app.get('/search-all', function(req, res) { 
        var value = req.query.name;
               
        db.find({selector: {
            "$or": [
                { developer_name: {$regex: "^(?i)" + value } },
                { developer_address: {$regex: "^(?i)" + value } },
                { developer_contact_person: value },
                { developer_project_project_name: {$regex: "^(?i)" + value } },
                { developer_project_address: {$regex: "^(?i)" + value } },
                { developer_project_contact_person: value },
                { developer_project_email: value },
                { developer_project_contact_phone: value },
                { developer_project_commission_rate: value },
                { developer_project_sales_cluster: {$regex: "^(?i)" + value } },
            ]}
        }, function (err, doc) {
            if (err) {
                res.json({err:err});
                
            } else {
                // log for testing
                // console.log(JSON.stringify(doc.docs));
                res.status(200).json(doc.docs);                
            }

        }); 
              
    });

    // API for searching only the developer_name field
    app.get('/search-developer', function(req, res) {
        var name = req.query.name;
               
        db.find({selector: {developer_name: name}}, function (err, doc) {
            if (err) {
                res.json({err:err});
                
            } else {
                // Log for testing
                //console.log(JSON.stringify(doc.docs));
                res.status(200).json(doc.docs);                
            }
        });      
    });

    // API to insert new developer
    app.post('/submit-developer', function(req, res) {
        console.log(req.body);     
        
        db.insert({
            developer_name                                  : req.body.developer_name,
            developer_address                               : req.body.developer_address,
            developer_contact_person                        : req.body.contact_person,
            developer_project_developer_subsidiary_name     : req.body.developer_name, 
            developer_project_project_name                  : req.body.project_name,
            developer_project_address                       : req.body.project_address,
            developer_project_contact_person                : req.body.project_contact_person,
            developer_project_email                         : req.body.project_contact_email,
            developer_project_contact_phone                 : req.body.project_contact_phone,
            developer_project_commission_rate               : req.body.project_commission_rate,
            developer_project_sales_cluster                 : req.body.sales_cluster

        }, function (err, doc) {
            if (err) {
                console.log(err);                
            } else {
                console.log('Insert completed ' + JSON.stringify(doc));
                res.status(200).json({ 'alertMessage': 'Insert completed' });
            }

        });
    });
    
    // API to update developer
    app.post('/update-developer', function(req, res) {        

        var doc = {
            '_id'                                           : req.body.id,
            '_rev'                                          : req.body.rev,
            developer_name                                  : req.body.developer_name,
            developer_address                               : req.body.developer_address,
            developer_contact_person                        : req.body.developer_contact_person,
            developer_project_developer_subsidiary_name     : req.body.developer_name, 
            developer_project_project_name                  : req.body.developer_project_project_name,
            developer_project_address                       : req.body.developer_project_address,
            developer_project_contact_person                : req.body.developer_project_contact_person,
            developer_project_contact_email                 : req.body.developer_project_contact_email,
            developer_project_contact_phone                 : req.body.developer_project_contact_phone,
            developer_project_commission_rate               : req.body.developer_project_commission_rate,
            developer_project_sales_cluster                 : req.body.developer_project_sales_cluster               
        }

        db.insert(doc, function(err, doc) {
            if (err) {
                console.log(err);                
            } else {
                console.log('Update completed ' + JSON.stringify(doc));
                res.status(200).json({ 'alertMessage': 'Update completed' });
            }
        });
    });

    // API to query document details to update
    app.get('/developer/update-query', function (req, res) {
        var id = req.query.id;
        db.find({selector: {_id: id}}, function (err, doc) {
            if (err) {
                res.json({err:err});
                
            } else {
                //save to session variable?
                console.log('update query: ' + JSON.stringify(doc.docs));
                res.status(200).json(doc.docs);
            }
        }); 
    });
}