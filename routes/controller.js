var Vehicle = require('../models/vehicle.js');

module.exports = function(app) {

  /**
   * Find and retrieves all vehicles
   * @param {Object} req HTTP request object.
   * @param {Object} res HTTP response object.
   */
  findAllvehicles = function(req, res) {
    console.log("GET - /vehicle");
    return Vehicle.find(function(err, vehicles) {
      if(!err) {
        return res.send(vehicles);
      } else {
        res.statusCode = 500;
        console.log('Internal error(%d): %s',res.statusCode,err.message);
        return res.send({ error: 'Server error' });
      }
    });
  };

  /**
   * Find and retrieves a single vehicle by its ID
   * @param {Object} req HTTP request object.
   * @param {Object} res HTTP response object.
   */
  findById = function(req, res) {

    console.log("GET - /vehicle/:id");
    return Vehicle.findById(req.params.id, function(err, vehicle) {

      if(!vehicle) {
        res.statusCode = 404;
        return res.send({ error: 'Not found' });
      }

      if(!err) {
        return res.send({ status: 'OK', vehicle:vehicle });
      } else {

        res.statusCode = 500;
        console.log('Internal error(%d): %s', res.statusCode, err.message);
        return res.send({ error: 'Server error' });
      }
    });
  };

  /**
   * Creates a new vehicle from the data request
   * @param {Object} req HTTP request object.
   * @param {Object} res HTTP response object.
   */
  addvehicle = function(req, res) {

    console.log('POST - /vehicle');

    var vehicle = new Vehicle({
      trademark:  req.body.trademark,
      model:      req.body.model,
      series:     req.body.series
    });

    vehicle.save(function(err) {

      if(err) {

        console.log('Error while saving vehicle: ' + err);
        res.send({ error:err });
        return;

      } else {

        console.log("vehicle created");
        return res.send({ status: 'OK', vehicle:vehicle });

      }

    });
  };

  /**
   * Update a vehicle by its ID
   * @param {Object} req HTTP request object.
   * @param {Object} res HTTP response object.
   */
  updatevehicle = function(req, res) {
    console.log("PUT - /vehicle/:id");
    return Vehicle.findById(req.params.id, function(err, vehicle) {
      if(!vehicle) {
        res.statusCode = 404;
        return res.send({ error: 'Not found' });
      }
      if ( req.body.trademark != null ) vehicle.trademark = req.body.trademark;
      if ( req.body.model != null ) vehicle.model = req.body.model;
      if ( req.body.series != null ) vehicle.series = req.body.series;

      return vehicle.save(function(err) {
        if(!err) {
          console.log('Updated');
          return res.send({ status: 'OK', vehicle:vehicle });
        } else {
          if(err.name == 'ValidationError') {
            res.statusCode = 400;
            res.send({ error: 'Validation error' });
          } else {
            res.statusCode = 500;
            res.send({ error: 'Server error' });
          }
          console.log('Internal error(%d): %s',res.statusCode,err.message);
        }
        res.send(vehicle);
      });
    });
  };

  /**
   * Delete a vehicle by its ID
   * @param {Object} req HTTP request object.
   * @param {Object} res HTTP response object.
   */
  deletevehicle = function(req, res) {
    console.log("DELETE - /vehicle/:id");
    return Vehicle.findById(req.params.id, function(err, vehicle) {
      if(!vehicle) {
        res.statusCode = 404;
        return res.send({ error: 'Not found' });
      }
      return vehicle.remove(function(err) {
        if(!err) {
          console.log('Removed vehicle');
          return res.send({ status: 'OK' });
        } else {
          res.statusCode = 500;
          console.log('Internal error(%d): %s',res.statusCode,err.message);
          return res.send({ error: 'Server error' });
        }
      })
    });
  }

  //Link routes and actions
  app.get( '/vehicle', findAllvehicles );
  app.get( '/vehicle/:id', findById );
  app.post( '/vehicle/', addvehicle );
  app.put( '/vehicle/:id', updatevehicle );
  app.delete( '/vehicle/:id', deletevehicle );
}