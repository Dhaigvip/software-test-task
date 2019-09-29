const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const td = require('testdouble');
const ClientsController = require('../../../src/controllers/ClientsController');
const {
    ValidationError
} = require('../../../src/errors');

const {
    expect
} = chai;

describe('clientsController', () => {
    before = () => {
        chai.use(chaiAsPromised);
    }

    afterEach = () => {
        td.reset();
    };

    it('#get should return clients list', async() => {
        const clientsList = [{
            id: 'someid'
        }, ];

        const clientModel = td.replace('../../../src/models/ClientModel');
        td.when(clientModel.getList()).thenResolve(clientsList);

        const ClientsController = require('../../../src/controllers/ClientsController');

        const getResult = await ClientsController.get();

        expect(getResult)
            .to.be.an('array')
            .that.equals(clientsList);
    });

    it('#getOne should return one client', async() => {
        const clientModel = td.replace('../../../src/models/ClientModel');
        td.when(clientModel.getOne('some-client-id')).thenResolve({
            id: 'some-client-id'
        });

        const ClientsController = require('../../../src/controllers/ClientsController');
        const getOneResult = await ClientsController.getOne({
            params: {
                clientId: 'some-client-id'
            }
        });

        expect(getOneResult)
            .to.be.an('object')
            .and.has.property('id')
            .that.equals('some-client-id');
    });

    it('#createOne should create one client', async() => {
        const req = {
            body: {
                phoneNumber: '+4407777712333',
                firstname: 'John',
                surname: 'Doe',
            },
        };

        const validator = td.replace('../../../src/helpers/validator');
        td.when(validator.validate(td.matchers.isA(String), req.body))
            .thenReturn({
                valid: true
            });

        const clientModel = td.replace('../../../src/models/ClientModel');
        td.when(clientModel.createOne(req.body)).thenResolve({
            client: 'client-created'
        });

        const createOneResult = await ClientsController.createOne(req);


        expect(createOneResult)
            .to.be.an('object')
            .and.has.property('client')
            .that.is.an('string');
    });

    it('#deleteOne should return success', async() => {
        const clientModel = td.replace('../../../src/models/ClientModel');
        td.when(clientModel.deleteById('some-client-id')).thenResolve();
        td.when(clientModel.getOne('some-client-id')).thenResolve({
            id: 'some-client-id',
            payloadhash: 'updog?'
        });

        const ClientsController = require('../../../src/controllers/ClientsController');
        const deleteOneResult = await ClientsController.deleteOne({
            params: {
                clientId: 'some-client-id'
            }
        });

        expect(deleteOneResult)
            .to.be.an('object')
            .and.has.property('message')
            .that.is.an('string')
            .that.equals('success');
    });

    it('#updateOne should update one client in DB', async() => {
        const name = 'Vipul';
        const clientList = await ClientsController.get();
        const orginalClient = clientList[0];
        if (orginalClient) {
            const updatedClientId = await ClientsController.updateOne({
                params: {
                    clientId: orginalClient.id
                },
                body: {
                    firstname: name
                }
            });
            const updatedClient = await ClientsController.getOne({
                params: {
                    clientId: updatedClientId.client
                }
            });
            expect(updatedClient)
                .to.be.an('object')
                .and.has.property('firstname')
                .that.is.an('string')
                .and.equal(name);
        }
    });

    it('#updateOne should fail due to unexpected property in request body', async() => {
        const req = {
            params: {
                clientId: 'some-client-id'
            },
            body: {
                firstname: 'Vipul',
                phoneNumber: '+4407777712333',
            },
        };

        const clientModel = td.replace('../../../src/models/ClientModel');
        td.when(clientModel.updateOne(req.params.clientId, req.body)).thenResolve({
            client: 'client-updated'
        });
        try {
            await ClientsController.updateOne(req);
        } catch (error) {
            expect(error)
                .has.property('message')
                .that.is.an('string')
                .and.equal('Error when validating data');
            expect(error)
                .has.property('data')
                .that.has.property('errors')
                .that.is.an('array')
                .that.to.have.members(['Target property \'phoneNumber\' is not in the model'])
        }
    });
    it('#updateOne should fail due to firstname being null', async() => {
        const req = {
            params: {
                clientId: 'some-client-id'
            },
            body: {
                firstname: ''
            },
        };

        const clientModel = td.replace('../../../src/models/ClientModel');
        td.when(clientModel.updateOne(req.params.clientId, req.body)).thenResolve({
            client: 'client-updated'
        });
        try {
            await ClientsController.updateOne(req);
        } catch (error) {
            expect(error)
                .has.property('message')
                .that.is.an('string')
                .and.equal('Error when validating data');
            expect(error)
                .has.property('data')
                .that.has.property('errors')
                .that.is.an('array')
                .that.to.have.members(['firstname cannot be blank and cannot be longer than 64 characters long'])
        }
    });
    it('#updateOne should fail due to surname being greater than  characters', async() => {
        const req = {
            params: {
                clientId: 'some-client-id'
            },
            body: {
                surname: 'Lorem Ipsum is the single greatest threat. We are not - we are not keeping up with other websites.'
            },
        };

        const clientModel = td.replace('../../../src/models/ClientModel');
        td.when(clientModel.updateOne(req.params.clientId, req.body)).thenResolve({
            client: 'client-updated'
        });
        try {
            await ClientsController.updateOne(req);
        } catch (error) {
            expect(error)
                .has.property('message')
                .that.is.an('string')
                .and.equal('Error when validating data');
            expect(error)
                .has.property('data')
                .that.has.property('errors')
                .that.is.an('array')
                .that.to.have.members(['surname cannot be blank and cannot be longer than 64 characters long'])
        }
    });
});