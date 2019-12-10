import mongoose from 'mongoose'
const stateSchema = new mongoose.Schema({
    stateType: {
        type: String,
        default: ''
    },
    name: {
        type: String,
        default: ''
    },
    nickName: {
        type: String,
        default: ''
    },
    capital: {
        type: String,
        default: ''
    },
    area: {
        type: String,
        default: ''
    },
    population: {
        type: String,
        default: ''
    },
    statehood: {
        type: String,
        default: ''
    },
    motto: {
        type: String,
        default: ''
    },
    flower: {
        type: String,
        default: ''
    },
    tree: {
        type: String,
        default: ''
    },
    bird: {
        type: String,
        default: ''
    },
    highPoint: {
        type: String,
        default: ''
    },
    lowPoint: {
        type: String,
        default: ''
    },
    bicameral: {
        type: String,
        default: ''
    },
    upperLegis: {
        type: String,
        default: ''
    },
    lowerLegis: {
        type: String,
        default: ''
    },
    ltGov: {
        type: String,
        default: ''
    },
    senators: {
        type: String,
        default: ''
    },
    reps: {
        type: String,
        default: ''
    },
    termLimit: {
        type: String,
        default: ''
    },
    termLength: {
        type: String,
        default: ''
    },
    billUrl: {
        type: String,
        default: ''
    },
    voteUrl: {
        type: String,
        default: ''
    },
    voterReg: {
        type: String,
        default: ''
    },
    primaryDate: {
        type: String,
        default: ''
    },
    generalDate: {
        type: String,
        default: ''
    },
    absenteeWho: {
        type: String,
        default: ''
    },
    absenteeHow: {
        type: String,
        default: ''
    },
    absenteeWhen: {
        type: String,
        default: ''
    },
    largestCity: {
        type: String,
        default: ''
    },
    rollUpper: {
        type: String,
        default: ''
    },
    rollLower: {
        type: String,
        default: ''
    },
    stateId: {
        type: String,
    },
    usCircuit: {
        type: String,
        default: ''
    }
}) 

const State = mongoose.model('State', stateSchema)

export default State
