const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', function() {
    test('Create an issue with every field: POST request to /api/issues/{project}', () => {
        chai
        .request(server)
        .post('/api/issues/test')
        .send({issue_title: 'Test', issue_text: 'Test', created_by: 'Sa-Yoor', assigned_to: 'Another User', status_text: 'Test' })
        .end((error, res) => {
            // console.log(res.body)
            assert.strictEqual(res.status, 200)
            assert.strictEqual(res.body.issue_title, 'Test')
            assert.strictEqual(res.body.issue_text, 'Test')
            assert.strictEqual(res.body.created_by, 'Sa-Yoor')
            assert.strictEqual(res.body.assigned_to, 'Another User')
            assert.strictEqual(res.body.status_text, 'Test')
            assert.exists(res.body.created_on)
            assert.exists(res.body.updated_on)
            assert.strictEqual(res.body.open, true)
            assert.exists(res.body._id)
        })
    })
    test('Create an issue with only required fields: POST request to /api/issues/{project}', () => {
        chai
        .request(server)
        .post('/api/issues/test')
        .send({issue_title: 'Test', issue_text: 'Test', created_by: 'Sa-Yoor' })
        .end((error, res) => {
            assert.strictEqual(res.status, 200)
            assert.strictEqual(res.body.issue_title, 'Test')
            assert.strictEqual(res.body.issue_text, 'Test')
            assert.strictEqual(res.body.created_by, 'Sa-Yoor')
            assert.strictEqual(res.body.assigned_to, '')
            assert.strictEqual(res.body.status_text, '')
            assert.exists(res.body.created_on)
            assert.exists(res.body.updated_on)
            assert.strictEqual(res.body.open, true)
            assert.exists(res.body._id)
        })
    })
    test('Create an issue with missing required fields: POST request to /api/issues/{project}', () => {
        chai
        .request(server)
        .post('/api/issues/test')
        .send({issue_title: 'Test', issue_text: 'Test'})
        .end((error, res) => {
            assert.strictEqual(res.status, 200)
            assert.strictEqual(res.body.error, 'required field(s) missing')
        })
    })
    test('View issues on a project: GET request to /api/issues/{project}', () => {
        chai
        .request(server)
        .get('/api/issues/test')
        .end((error, res) => {
            assert.strictEqual(res.status, 200)
            assert.isArray(res.body)
        })
    })
    test('View issues on a project with one filter: GET request to /api/issues/{project}', () => {
        chai
        .request(server)
        .get('/api/issues/get_issues_test_122558?created_by=Alice')
        .end((error, res) => {
            assert.strictEqual(res.status, 200)
            assert.isArray(res.body)
        })
    })
    test('View issues on a project with multiple filters: GET request to /api/issues/{project}', () => {
        chai
        .request(server)
        .get('/api/issues/get_issues_test_122558?created_by=Alice&assigned_to=Bob')
        .end((error, res) => {
            assert.strictEqual(res.status, 200)
            assert.isArray(res.body)
        })
    })
    test('Update one field on an issue: PUT request to /api/issues/{project}', () => {
        chai
        .request(server)
        .put('/api/issues/fcc-project')
        .send({_id: '640218492aa12ead6207b736', issue_text: 'New Issue Text'})
        .end((error, res) => {
            console.log('Update one field on an issue: PUT request to /api/issues/{project}')
            console.log(res.body)
            assert.strictEqual(res.status, 200)
            assert.strictEqual(res.body.result, 'successfully updated')
            assert.strictEqual(res.body._id, '640218492aa12ead6207b736')
        })
    })
    test('Update multiple fields on an issue: PUT request to /api/issues/{project}', () => {
        chai
        .request(server)
        .put('/api/issues/test')
        .send({_id: '6402024c40b7ac6db0d708c8', issue_text: 'New Issue Text Updated', assigned_to: 'Another User'})
        .end((error, res) => {
            console.log('Update multiple fields on an issue: PUT request to /api/issues/{project}')
            console.log(res.body)
            assert.strictEqual(res.status, 200)
            assert.strictEqual(res.body.result, 'successfully updated')
            assert.strictEqual(res.body._id, '6402024c40b7ac6db0d708c8')
        })
    })
    test('Update an issue with missing _id: PUT request to /api/issues/{project}', () => {
        chai
        .request(server)
        .put('/api/issues/test')
        .send({ issue_text: 'New Issue Text Updated 2' })
        .end((error, res) => {
            console.log('Update an issue with missing _id: PUT request to /api/issues/{project}')
            console.log(res.body)
            assert.strictEqual(res.status, 200)
            assert.strictEqual(res.body.error, 'missing _id')
        })
    })
    test('Update an issue with no fields to update: PUT request to /api/issues/{project}', () => {
        chai
        .request(server)
        .put('/api/issues/test')
        .send({ _id: '6402024c40b7ac6db0d708c8' })
        .end((error, res) => {
            console.log('Update an issue with no fields to update: PUT request to /api/issues/{project}')
            console.log(res.body)
            assert.strictEqual(res.status, 200)
            assert.strictEqual(res.body._id, '6402024c40b7ac6db0d708c8')
            assert.strictEqual(res.body.error, 'no update field(s) sent')
        })
    })
    test('Update an issue with an invalid _id: PUT request to /api/issues/{project}', () => {
        chai
        .request(server)
        .put('/api/issues/test')
        .send({_id: '1', issue_text: 'New Issue Text Updated', assigned_to: 'Another User'})
        .end((error, res) => {
            console.log('Update an issue with an invalid _id: PUT request to /api/issues/{project}')
            console.log(res.body)
            assert.strictEqual(res.status, 200)
            assert.strictEqual(res.body._id, '1')
            assert.strictEqual(res.body.error, 'could not update')
        })
    })
    test('Delete an issue: DELETE request to /api/issues/{project}', () => {
        chai
        .request(server)
        .delete('/api/issues/test')
        .send({_id: '6401f56e54d3609ad8e6fe93'})
        .end((error, res) => {
            console.log('Delete an issue: DELETE request to /api/issues/{project}')
            console.log(res.body)
            assert.strictEqual(res.status, 200)
            assert.strictEqual(res.body._id, '6401f56e54d3609ad8e6fe93')
            assert.strictEqual(res.body.result, 'successfully deleted')
        })
    })
    test('Delete an issue with an invalid _id: DELETE request to /api/issues/{project}', () => {
        chai
        .request(server)
        .delete('/api/issues/test')
        .send({_id: '1'})
        .end((error, res) => {
            console.log('Delete an issue with an invalid _id: DELETE request to /api/issues/{project}')
            console.log(res.body)
            assert.strictEqual(res.status, 200)
            assert.strictEqual(res.body._id, '1')
            assert.strictEqual(res.body.error, 'could not delete')
        })
    })
    test('Delete an issue with missing _id: DELETE request to /api/issues/{project}', () => {
        chai
        .request(server)
        .delete('/api/issues/test')
        .end((error, res) => {
            console.log('Delete an issue with missing _id: DELETE request to /api/issues/{project}')
            console.log(res.body)
            assert.strictEqual(res.status, 200)
            assert.strictEqual(res.body.error, 'missing _id')
        })
    })
});
