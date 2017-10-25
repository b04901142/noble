
var noble = require('../..');
var pizza = require('./acc');

var ServiceUuid = '13333333333333333333333333333337';
var AccXCharacteristicUuid = '1333333333333333333333330001';
var AccYCharacteristicUuid = '13333333333333333333333333330002';
var AccZCharacteristicUuid = '13333333333333333333333333330003';

noble.on('stateChange', function(state) {
  if (state === 'poweredOn') {
    //
    // Once the BLE radio has been powered on, it is possible
    // to begin scanning for services. Pass an empty array to
    // scan for all services (uses more time and power).
    //
    console.log('scanning...');
    noble.startScanning([ServiceUuid], false);
  }
  else {
    noble.stopScanning();
  }
})

var Service = null;
var AccXCharacteristic = null;
var AccYCharacteristic = null;
var AccZCharacteristic = null;

noble.on('discover', function(peripheral) {
  // we found a peripheral, stop scanning
  noble.stopScanning();

  //
  // The advertisment data contains a name, power level (if available),
  // certain advertised service uuids, as well as manufacturer data,
  // which could be formatted as an iBeacon.
  //
  console.log('found peripheral:', peripheral.advertisement);
  //
  // Once the peripheral has been discovered, then connect to it.
  //
  peripheral.connect(function(err) {
    //
    // Once the peripheral has been connected, then discover the
    // services and characteristics of interest.
    //
    peripheral.discoverServices([ServiceUuid], function(err, services) {
      services.forEach(function(service) {
        //
        // This must be the service we were looking for.
        //
        console.log('found service:', service.uuid);

        //
        // So, discover its characteristics.
        //
        service.discoverCharacteristics([], function(err, characteristics) {

          characteristics.forEach(function(characteristic) {
            //
            // Loop through each characteristic and match them to the
            // UUIDs that we know about.
            //
            console.log('found characteristic:', characteristic.uuid);

            if (AccXCharacteristicUuid == characteristic.uuid) {
              AccXCharacteristic = characteristic;
            }
            else if (AccYCharacteristicUuid == characteristic.uuid) {
              AccYCharacteristic = characteristic;
            }
            else if (AccZCharacteristicUuid == characteristic.uuid) {
              AccZCharacteristic = characteristic;
            }
          })

          //
          // Check to see if we found all of our characteristics.
          //
          if (AccXCharacteristic &&
              AccYCharacteristic &&
              AccZCharacteristic) {
            //
            // We did, so bake a pizza!
            //
            getData();
          }
          else {
            console.log('missing characteristics');
          }
        })
      })
    })
  })
})

function getData() {
	var times = 1;
	
	console.log('prepare for x_reading');
 	AccXCharacteristic.on('read', function(data, isNotification) {
  	console.log('Our x is ready!');
    var result = data.readUInt8(0);
    console.log('The result is',result);
  });

	AccXCharacteristic.subscribe(function(err) {
		console.log('subx check');
		var temperature = new Buffer(2);
		temperature.writeUInt16BE(450, 0);
		AccXCharacteristic.write(temperature, false, function(err) {
			if (err) {
				console.log('xxx error');
			}
    });
  });

	console.log('prepare for y_reading');
 	AccYCharacteristic.on('read', function(data, isNotification) {
  	console.log('Our y is ready!');
    var result = data.readUInt8(0);
    console.log('The result is',result);
  });

	AccYCharacteristic.subscribe(function(err) {
		console.log('suby check');
		var temperature = new Buffer(2);
		temperature.writeUInt16BE(450, 0);
		AccYCharacteristic.write(temperature, false, function(err) {
			if (err) {
				console.log('yyy error');
			}
    });
  });

	console.log('prepare for z_reading');
 	AccZCharacteristic.on('read', function(data, isNotification) {
  	console.log('Our z is ready!');
    var result = data.readUInt8(0);
    console.log('The result is',result);
  });

	AccZCharacteristic.subscribe(function(err) {
		console.log('subz check');
		var temperature = new Buffer(2);
		temperature.writeUInt16BE(450, 0);
		AccZCharacteristic.write(temperature, false, function(err) {
			if (err) {
				console.log('zzz error');
			}
    });
  });
          
        
  
}
