'use strict';
const { query } = require('express');
const mongoose = require('mongoose')

const issueSchema = new mongoose.Schema({
  project: {
    require: true,
    type: String
  },
  issue_title: {
    require: true,
    type: String
  },
  issue_text: {
    require: true,
    type: String
  },
  created_by: {
    require: true,
    type: String
  },
  assigned_to: {
    type: String
  },
  status_text: {
    type: String
  },
  created_on: {
    type: String,
    default: new Date()
  },
  updated_on: {
    type: String,
    default: new Date()
  },
  open: {
    type: Boolean,
    default: true
  }
})

const Issue = new mongoose.model('issue', issueSchema)

module.exports = function (app) {

  app.route('/api/issues/:project')
  
    .get(function (req, res){
      console.log('GET')
      
      let { project } = req.params; 
      console.log(`Project - ${project}`)
      console.log(`Filters`)
      console.log(req.query)
      Issue.find({project, ...req.query})
      .then(issues => {
        if(issues.length === 0){ return res.json([]) }
        res.json(issues)
      })
      .catch(error => {
        console.log(error)
        res.status(500).json({error})
      })   
    })
    
    .post(async (req, res) => {
      console.log('POST')

      let { project } = req.params;
      console.log(`Project - ${project}`)
      let { issue_title, issue_text, created_by, assigned_to, status_text } = req.body
      if(!issue_title || !issue_text || !created_by){ return res.json({error: 'required field(s) missing'}) }
      if(!assigned_to) { assigned_to = ''}
      if(!status_text) { status_text = ''}

      try{
        const newIssue = new Issue({
          project,
          issue_title,
          issue_text,
          created_by,
          assigned_to,
          status_text
        })
        await newIssue.save()
        res.json({...newIssue._doc})

      } catch(error){ res.status(500).json({error}) }

    })
    
    .put(function (req, res){
      console.log('PUT')

      let { project } = req.params;
      console.log(`Project - ${project}`)

      const { _id } = req.body
      if(!_id){ return res.json({ error: 'missing _id' }) }
      console.log(`ID - ${_id}`)

      const fieldsToUpdate = {...req.body}
      delete fieldsToUpdate._id
      if(Object.keys(fieldsToUpdate).length === 0){ return res.json({ error: 'no update field(s) sent', _id }) }
      fieldsToUpdate.updated_on = new Date()

      console.log(fieldsToUpdate)

      Issue.findOneAndUpdate({ _id, project }, fieldsToUpdate, {new: true})
      .then(issue => {
        if(issue || Object.keys(issue).length !== 0){
          console.log('issue')
          console.log(issue)
          return res.json({ result: 'successfully updated', _id })
        }
      })
      .catch(error => {
        console.log('error') 
        return res.json({ error: 'could not update', _id }) 
      })
    })
    
    .delete(function (req, res){
      console.log('DELETE')
      console.log(`Method - ${req.method}`)

      let { project } = req.params;
      console.log(`Project - ${project}`)

      const { _id } = req.body
      if(!_id){ return res.json({ error: 'missing _id' }) }
      console.log(`ID - ${_id}`)

      Issue.findOneAndDelete({ project, _id })
      .then(data => { 
        if(data || Object.keys(data).length !== 0){
          console.log('data')
          console.log(data)
          return res.json({ result: 'successfully deleted', '_id': _id }) 
        }
      })
      .catch(error => { 
        console.log('error')
        console.log(error) 
        return res.json({ error: 'could not delete', '_id': _id }) 
      })
    });
    
}; 
