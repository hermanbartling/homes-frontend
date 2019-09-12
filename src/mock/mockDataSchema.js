// https://medium.freecodecamp.org/rapid-development-via-mock-apis-e559087be066
// https://github.com/marak/Faker.js/
// https://github.com/json-schema-faker/json-schema-faker/blob/master/docs/USAGE.md
var meta = {};

var schema = {
    "type": "object",
    "properties": {
        "scheduledmeasurementsmeta": {
            "type": "object",
            "properties": {
                "hourOptions": {
                    "type": "object",
                    "properties": {
                        6: "6:00",
                        7: "7:00",
                        8: "8:00",
                        9: '9:00',
                        10: '10:00',
                        11: '11:00',
                        12: '12:00',
                        13: '13:00',
                        14: '14:00',
                        15: '15:00',
                        16: '16:00',
                        17: '17:00',
                        18: '18:00'
                    },
                    "required": [6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18]
                },
                "weekdayOptions": {
                    "type": "object",
                    "properties": {
                        0: 'Söndag',
                        1: 'Måndag',
                        2: 'Tisdag',
                        3: 'Onsdag',
                        4: 'Torsdag',
                        5: 'Fredag',
                        6: 'Lördag'
                    },
                    "required": [0, 1, 2, 3, 4, 5, 6]
                },
                "weekPeriodOptions": {
                    "type": "object",
                    "properties": {
                        1: 'Varje vecka',
                        2: 'Varannan vecka',
                        3: 'Var tredje vecka',
                        4: 'Var fjärde vecka'
                    },
                    "required": [1, 2, 3, 4]
                },
                "earliestPossibleStartDate": {
                    "type": "string",
                    "format": "earliestPossibleStartDate"
                },
                "hourMin": 6,
                "hourMax": 18
            },
            "required": [
                "hourOptions",
                "weekdayOptions",
                'weekPeriodOptions',
                'earliestPossibleStartDate',
                'hourMin',
                'hourMax'
            ]
        },
        "scheduledmeasurements": {
            "type": "array",
            "minItems": 3,
            "maxItems": 5,
            "items": {
                "type": "object",
                "properties": {
                    "id": {
                        "type": "integer",
                        "unique": true,
                        "minimum": 1
                    },
                    "state": "SCHEDULED",
                    "start_at": {
                        "type": "string",
                        "format": "pastDate"
                    },
                    "end_at": {
                        "type": "string",
                        "format": "futureDate"
                    },
                    "week": {
                        "type": "integer",
                        "minimum": 1,
                        "maximum": 52
                    }
                },
                "required": ["id", "state", "start_at", "end_at", "week"]
            }
        }
    },
    "required": ["scheduledmeasurementsmeta", "scheduledmeasurements"]
};

module.exports = schema;