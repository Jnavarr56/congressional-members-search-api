import mongoose from 'mongoose'
const officialSchema = new mongoose.Schema({
    stateUUID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'State'
    },
    name: [ { type: String } ],
    parties: {
        type: String
    },
    title: {
        type: String
    },
    shortTitle: {
        type: String
    },
    type: {
        type: String
    },
    status: {
        type: String
    },
    firstElect: {
        type: Date
    },
    lastElect: {
        type: Date
    },
    nextElect: {
        type: Date
    },
    termStart: {
        type: Date
    },
    termEnd: {
        type: Date
    },
    district: {
        type: String
    },
    districtId: {
        type: String
    },
    stateId: {
        type: String
    },
    state: {
        type: String
    },
    committee: [ 
        {
            committeeId: {
                type: String
            },
            committeeName: {
                type: String
            }
        }
    ],
    officialBio: {
      candidateId: { type: String },
      crpId: { type: String },
      photo: { type: String },
      firstName: { type: String },
      nickName: { type: String },
      middleName: { type: String },
      preferredName: { type: String },
      lastName: { type: String },
      suffix: { type: String },
      birthDate: { type: Date },
      birthPlace: { type: String },
      pronunciation: { type: String },
      gender: { type: String },
      family: { type: String },
      homeCity: { type: String },
      homeState: { type: String },
      religion: { type: String },
      specialMsg: { type: String }
    }
}) 

const Official = mongoose.model('Official', officialSchema)

export default Official
