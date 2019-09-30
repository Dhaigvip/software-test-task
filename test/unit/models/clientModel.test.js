const chai = require('chai');
const td = require('testdouble');
const ClientModel = require('../../../src/models/ClientModel');

const { expect } = chai;

describe('clientModel', () => {
    afterEach = () => {
        td.reset();
    };

    it('#hashClient should return hash', async() => {
        const req = {
            params: {
                clientId: 'some-client-id',
            },
            body: {
                firstname: 'andres',
                surname: 'ruutel',
                phoneNumber: '+44076546546549',
            },
        };

        const validator = td.replace('../../../src/helpers/validator');
        td.when(validator.validate(td.matchers.isA(String), req.body))
            .thenReturn({ valid: true });

        // ClientModel.hashClient(JSON.stringify(req.body));
        const hashClientResult = ClientModel.hashClient(JSON.stringify(req.body));

        expect(hashClientResult)
            .to.be.an('string');
    });
    it('#formatter should return dynamically formatted key-value pair for update', async() => {
        const req = {
            params: {
                clientId: 'some-client-id',
            },
            body: {
                firstname: 'andres',
                surname: 'ruutel',
                phoneNumber: '+44076546546549',
            },
        };

        const validator = td.replace('../../../src/helpers/validator');
        td.when(validator.validate(td.matchers.isA(String), req.body))
            .thenReturn({ valid: true });


        const formattedInput = ClientModel.updateQueryformatter(req.body);

        expect(formattedInput)
            .to.be.an('string')
            .equals("firstname='andres',surname='ruutel',phoneNumber='+44076546546549'");
    });
});