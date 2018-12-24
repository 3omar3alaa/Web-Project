module.exports.seed = function(){
    const mongoose = require('mongoose');
    var data = [
        {
            'model' : 'User',
            'documents' : [
                {
                    'username': 'paul.john',
                    'password' : 'se5retpa55word',
                    'fullName' : 'Sample tenant',
                    'age' : 25,
                    'email' : 'paul.john@yolo.com',
                    'mobileNumber' : 201220419909,
                    'address' : 'Paris, In front of Eiffel Tower',
                    '_id' : mongoose.Types.ObjectId('y5aaaaaaaaaa')
                }
            ]
        },
        {
            'model' : 'Place',
            'documents' : [
                {
                    '_id' : mongoose.Types.ObjectId('b5aaaaaaaaaa'),
                    'title' : 'Paris Place',
                    'ownerId' : mongoose.Types.ObjectId('a5aaaaaaaaaa'),
                    'availabilityIntervals': [
                        {
                            'startDate' : new Date(Date.parse('01-13-2019')),
                            'endDate' : new Date(Date.parse('02-13-2019'))
                        }
                    ],
                    'description': 'Coziest place on earth, has PS4 and all your dreams',
                    offersLog : [
                        {
                            'tenantId' : mongoose.Types.ObjectId('y5aaaaaaaaaa'),
                            'offerInterval' : {
                                'startDate' : new Date(Date.parse('01-15-2019')),
                                'endDate' : new Date(Date.parse('02-10-2019'))
                            },
                            'status' : 'pending'
                        }
                    ],
                    'reviews' : []
                }
            ]
        }
    ];


    const seeder = require('mongoose-seed');
    seeder.connect('mongodb://localhost/airdb', function(){
        //seeder.loadModels(['./Models/user.js', './Models/place.js']);
        seeder.clearModels(['User', 'Place'], function(){
            seeder.populateModels(data, function(){
                seeder.disconnect();
            })
        });
    });
};