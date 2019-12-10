import express from 'express'
import mongoose from 'mongoose'
import aqp from 'api-query-params'
import cors from 'cors'
import morgan from 'morgan'
import { State, Official } from '../models'

require('dotenv').config()

const {
    DB_URL
} = process.env
const app = express()
app
    .use(cors())
    .use(morgan('dev'))

const parseOptions = { useNewUrlParser: true, useUnifiedTopology: true, connectTimeoutMS: 100 }

mongoose.connect(DB_URL, parseOptions).then(() => {

    app.get('/states', async (req, res, next) => {

        const { filter, skip, limit, sort, projection, population } = aqp(req.query)

        State.find(filter)
            .skip(skip)
            .limit(limit)
            .sort(sort)
            .select(projection)
            .populate(population)
            .exec((err, states) => {

                if (err) return next(err)

                res.send(states)
            })
    })

    app.get('/states/:stateId', async (req, res, next) => {

        const { stateId } = req.params
        const { projection, population } = aqp(req.query)

        State.findById(stateId)
            .select(projection)
            .populate(population)
            .exec((err, state) => {

                if (err) return next(err)

                res.send(state)
            })
    })

    app.get('/states/:stateId/officials', async (req, res, next) => {

        const { stateId } = req.params
        const { filter, skip, limit, sort, projection, population } = aqp(req.query)

        let state

        try {
            state = await State.findById(stateId) 
        } catch(error) {
            state === null
        }

        if (state === null) return res.status(404).send('State Not Found')
    
        Official.find({
                ...filter,
                stateId: state.stateId
            })
            .skip(skip)
            .limit(limit)
            .sort(sort)
            .select(projection)
            .populate(population)
            .exec((err, officials) => {

                if (err) return next(err)

                res.send(officials)
            })
    })

    app.get('/states/:stateId/officials/:officialsId', async (req, res, next) => {

        const { stateId, officialsId } = req.params
        const { filter, skip, limit, sort, projection, population } = aqp(req.query)

        let state

        try {
            state = await State.findById(stateId) 
        } catch(error) {
            state === null
        }

        if (state === null) return res.status(404).send('State Not Found')
    
        Official.findOne({
                ...filter,
                stateId: state.stateId,
                _id: officialsId
            })
            .skip(skip)
            .limit(limit)
            .sort(sort)
            .select(projection)
            .populate(population)
            .exec((err, official) => {

                if (err) return next(err)

                res.send(official)
            })
    })

    app.get('/states/:stateId/officials/:officialsId', async (req, res, next) => {

        const { stateId, officialsId } = req.params
        const { filter, skip, limit, sort, projection, population } = aqp(req.query)

        let state

        try {
            state = await State.findById(stateId) 
        } catch(error) {
            state === null
        }

        if (state === null) return res.status(404).send('State Not Found')
    
        Official.findOne({
                ...filter,
                stateId: state.stateId,
                _id: officialsId
            })
            .skip(skip)
            .limit(limit)
            .sort(sort)
            .select(projection)
            .populate(population)
            .exec((err, official) => {

                if (err) return next(err)

                res.send(official)
            })
    })

    app.get('/officials', async (req, res, next) => {

        const { filter: queryFilter, skip, limit, sort, projection, population } = aqp(req.query)
        
        const { regexp, firstName, lastName, ...rest } = queryFilter
        
        let filter = { ...rest }
        if (regexp) {
            filter.$or = [
                { 'officialBio.firstName': regexp },
                { 'officialBio.lastName': regexp }
            ]
        } else if (firstName && lastName) {
            filter['officialBio.firstName']= firstName
            filter['officialBio.lastName'] = lastName
        }


        Official.find(filter)
            .skip(skip)
            .limit(limit)
            .sort(sort)
            .select(projection)
            .populate(population)
            .exec((err, officials) => {

                if (err) return next(err)

                res.send(officials)
            })
    })

    app.listen(3000, '0.0.0.0', () => console.log('API up on port 3000!'))
})










