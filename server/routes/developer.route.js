'use strict';
var dbCloudant = require('../services/cloudant.service');
var db = dbCloudant.getDevInfo();

var path = require("path");

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
            developer_project_contact_phone: req.body.project_contact_phone,
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

    app.post('/update-developer', function(req, res) {        
    
        var doc = {
            '_id': req.body.id,
            '_rev': req.body.rev,
            developer_name: req.body.name,
            developer_address: req.body.address,
            developer_contact_person: req.body.contact_person,
            developer_project_developer_subsidiary_name: req.body.name, 
            developer_project_project_name: req.body.project_name,
            developer_project_address: req.body.project_address,
            developer_project_contact_person: req.body.project_contact_person,
            developer_project_email: req.body.project_email,
            developer_project_contact_phone: req.body.project_contact_phone,
            developer_project_commission_rate: req.body.project_commission_rate,
            developer_project_sales_cluster: req.body.project_sales_cluster               
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

    app.get('/search-developer', function(req, res) {
        var name = req.query.name;
               
        db.find({selector: {developer_name: name}}, function (err, doc) {
            if (err) {
                res.json({err:err});
                
            } else {
                console.log(JSON.stringify(doc.docs));
                res.status(200).json(doc.docs);                
            }

        }); 
              
    });

    /*
    app.get('/developer/update', function (req, res) {
        console.log(req.query.id);

        db.find({selector: {_id: req.query.id}}, function (err, doc) {
            if (err) {
                res.json({err:err});
                
            } else {
                console.log(JSON.stringify(doc.docs));
                res.sendFile("developer.html", {root:path.join(__dirname, "../../public")}, {doc: doc.docs});
                //res.status(200).json(doc.docs);                
            }
        });        
     });
    */

    
    app.get('/developer/update', function (req, res) {
        res.sendFile("search_update.html", {root:path.join(__dirname, "../../public")});
    });

    app.get('/developer/update-query', function (req, res) {
        var id = req.query.id;
        console.log(id);
        db.find({selector: {_id: id}}, function (err, doc) {
            if (err) {
                res.json({err:err});
                
            } else {
                console.log('update query: ' + JSON.stringify(doc.docs));
                res.status(200).json(doc.docs);                
            }

        }); 
     });
    

}