import axios from 'axios'
import mongoose from 'mongoose'
import qs from 'query-string'
import { State, Official } from '../models'

require('dotenv').config()

const {
    VOTESMART_API_KEY: API_KEY,
    DB_URL
} = process.env

const BASE = 'http://api.votesmart.org'
const CREDENTIALS = `key=${API_KEY}&o=JSON`


const SENATE_OFFICE_ID = 6
const HOUSE_OFFICE_ID = 5

const ignore = {
    'NA': true
}

const parseOptions = { useNewUrlParser: true, useUnifiedTopology: true }

const db = mongoose.createConnection(DB_URL, parseOptions)
db.dropDatabase().then(() => {


    mongoose.connect(DB_URL, parseOptions).then(async () => {

        let stateList = await getStateList()
        
        stateList = stateList.filter(({ stateId }) => !ignore[stateId])

        const stateData = await getStatesFromList(stateList)
        const states = await State.insertMany(stateData)

        let officials = []
            
        for (let state of states) {
            
            const { stateId, name, _id } = state
            
            const representativesList = await getOfficialsList(HOUSE_OFFICE_ID, stateId)
            const senatorsList = await getOfficialsList(SENATE_OFFICE_ID, stateId)
    
            const senators = await getOfficialsFromList(senatorsList)
            const representatives = await getOfficialsFromList(representativesList)
            
            const stateOfficials = [ ...senators, ...representatives ].map(official => ({
                ...official,
                state: name,
                stateUUID: _id
            }))

            
            officials = officials.concat(stateOfficials)
    
        }

        await Official.insertMany(officials)
    
        mongoose.connection.close()
        process.exit()
    })
})



const getStateList = async () => {
    process.stdout.clearLine()
    process.stdout.write(`Acquiring list of states...\r`)

    const URL = `${BASE}/State.getStateIDs?${CREDENTIALS}`

    return await axios.get(URL)
        .then(({ data }) => {

            process.stdout.clearLine()
            process.stdout.write(`Acquired list of states!\r`)
            
            const stateList = data.stateList.list.state
            
            return stateList
        })
        .catch(error => {

            console.log(error)
            return null
        })
}

const getStatesFromList = async stateList => {
    process.stdout.clearLine()
    process.stdout.write(`Acquiring info for states...\r`)

    let i = 1
    const numStates = stateList.length


    const states = stateList.map(async (state) => {

        const { name, stateId } = state

        const QUERY = qs.stringify({ stateId })
        const URL = `${BASE}/State.getState?${CREDENTIALS}&${QUERY}`

        return (
            await axios.get(URL)
                .then(({ data }) => {
                    
                    const pctDone  = `${Math.floor((i/numStates) * 100)}%`
                    const message = `Getting State Info ${pctDone}: ${name} \r`
                    process.stdout.clearLine()
                    process.stdout.write(message)

                    i++

                    const stateInfo = data.state.details
                    return stateInfo
                })
                .catch(error => {
                    console.log(error)
                    return null
                })
        )
    })

    const results = await Promise.all(states)
    
    return results
}

const getOfficialsList = async (officeId, stateId) => {
    process.stdout.clearLine()
    process.stdout.write(`Getting officials for state ${stateId}...\r`)

    const QUERY = qs.stringify({ officeId, stateId })
    const URL = `${BASE}/Officials.getByOfficeState?${CREDENTIALS}&${QUERY}`

     return await axios.get(URL)
        .then(({ data }) => {

            process.stdout.clearLine()

            if (data.error) {    
                process.stdout.write(`No officials for state ${stateId}!\r`)
                return []
            }
            
            process.stdout.write(`Found officials for state ${stateId}!\r`)

            const officialsList = data.candidateList.candidate
            return officialsList
        })
        .catch(err => {
            console.log(err)
            return []
        })
}

const getOfficialsFromList = async officialList => {

    
    if (!Array.isArray(officialList)) officialList = [ officialList ]

    const type = officialList[0] ? officialList[0].title : ''

    let i = 1
    const numOfficials = officialList.length

    const officials = officialList.map(async official => {

        const { candidateId, firstName, lastName, title, officeStateId } = official

        const name = `${title} - ${firstName} ${lastName}`

        const QUERY = qs.stringify({ candidateId })
        const URL = `${BASE}/CandidateBio.getBio?${CREDENTIALS}&${QUERY}`

        return (
            await axios.get(URL)
                .then(({ data }) => {
                    
                    const pctDone  = `${Math.floor((i/numOfficials) * 100)}%`
                    const message = `Getting ${officeStateId} ${type} Info ${pctDone}: ${name} \r`
                    process.stdout.clearLine()
                    process.stdout.write(message)

                    i++
                    
                    
                    const { candidate, office } = data.bio

                    const firstElect = new Date(Date.parse(office.firstElect))
                    const lastElect = new Date(Date.parse(office.lastElect))
                    const nextElect = new Date(Date.parse(office.nextElect))
                    const termStart = new Date(Date.parse(office.termStart))
                    const termEnd = new Date(Date.parse(office.termEnd))
                    const birthDate = new Date(Date.parse(candidate.birthDate))

                    
                    const officialInfo = { 
                        ...office,
                        firstElect: isValidDate(firstElect) ? firstElect : null,
                        lastElect: isValidDate(lastElect) ? lastElect : null,
                        nextElect: isValidDate(nextElect) ? nextElect : null,
                        termStart: isValidDate(termStart) ? termStart : null,
                        termEnd: isValidDate(termEnd) ? termEnd : null,
                        officialBio: {
                            ...candidate,
                            birthDate: isValidDate(birthDate) ? birthDate : null
                        }
                    }
                    
                    if (!officialInfo.committee) officialInfo.committee = []
                    
                    return officialInfo
                })
                .catch(error => {
                    console.log(error)
                    return []
                })
        )
    })

    const results = await Promise.all(officials)
    
    return results

}

const isValidDate = date => date instanceof Date && !isNaN(date)
