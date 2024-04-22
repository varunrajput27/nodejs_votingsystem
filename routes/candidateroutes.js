const express = require('express');
const router = express.Router();
const User = require('../models/user');
const { jwtAutMiddleware, generateToken } = require('../jwt');
const Candidate = require('../models/candidate');
/////////////////////////////////////////////////////////////////////
const checkadminrole = async (userid) => {
    try {
        const user = await User.findById(userid);
        if (user.role === 'admin') {
            return  true;
        }
    }
    catch (err) {
        return false;
    }
}
//////////////////////////   to add a candidate
router.post('/', jwtAutMiddleware, async (req, res) => {
    try {
          if (! (await checkadminrole (req.user.id)))
            {
            return res.status(403).json({ message: 'user has not admin role' })
            }


        const data = req.body;  // assuming the request body contains the candidate data

        //create a new user document using the ongoose model
        const newcandidate = new candidate(data);

        //save the new user to the databseJ
        const response = await newcandidate.save();
        console.log('datasaved');

        res.status(200).json({ response: response });

    }
    catch (err) {
        console.log(err);
        res.status(500).json({ error: 'internal server error' });

    }
})
// ///////////////////////////////////////////////////////////////////////////////////
router.post('/:candidateID', jwtAutMiddleware, async (req, res) => {
    try {
        if (!checkadminrole(req.user.id)) {
            return res.status(403).json({ message: 'user does  not have admin role' })
        }
        const candidateID = req.params.candidateID;
        const updataedcandidatedata = req.body;
        const response = await person.findByIdAndUpdate(candidateID, updataedcandidatedata, {
            new: true,
            runValidators: true
        })
        if (!response) {
            return res.status(404).json({ error: 'candidate not found' })
        }
        console.log('candidate data updated');
        res.status(200).json(response);
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ error: 'internal server error' })
    }
})
// //////////////////////////////////////////////////////////////////
router.delete('/:candidateID', jwtAutMiddleware, async (req, res) => {
    try {
        if (!checkadminrole(req.user.id)) {
            return res.status(403).json({ message: 'user has nothave  admin role' })
        }
        const candidateID = req.params.candidateID;

        const response = await person.findByIdAndDelete(candidateID);

        if (!response) {
            return res.status(404).json({ error: 'candidate not found' })
        }
        console.log('candidatedeleted');
        res.status(200).json(response);
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ error: 'internal server error' })
    }
})

//////////////////////////////////////////
router.post('/vote/:candidateID', jwtAutMiddleware, async (req, res) => {
    candidateID = req.params.candidateID;
    userID = req.user.id;
    try {
        const candidate = await Candidate.findById(candidateID);
        if (!candidate) {
            return res.status(404).json({ message: "candidate not found" })
        }
        const user = await User.findById(userID);
        if (!user) {
            return res.status(404).json({ messsage: 'user not found' });
        }
        if (user.isVoted) {
            return res.status(400).json({ messsage: 'you have already voted' });
        }
        if (user.role == 'admin') {
            return res.status(403).json({ messsage: 'adminis not allowed' });
        }

        //updaste the candidate  document  to record the vote
        candidate.votes.push({ user: user })
        candidate.votecount++;
        await candidate.save();

        //update the user document
        user.isVoted = true
        await user.save();
        return res.status(200).json({ messsage: 'vote recorded successfully' });
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ error: 'internal server error' })
    }

}
);

// /////////////////////////////////////////////////////////////////////


router.get('/vote/count', async (req, res) => {
    try {
        const candidate = await Candidate.find().sort({ votecount: 'desc' })
        const voterecord = candidate.map((data) => {
            return {
                party: data.party,
                count: data.votecount
            }
        }
        );
        return res.status(200).json(voterecord);
    } catch (err) {

        console.log(err);
        res.status(500).json({ error: 'internal server error' })

    }
})
///////////////////////////////////////////
router.get('/',async(req,res)=>{
    try{

        // find all the candiate and select only thr name and party fields, excludig _id
        const candidates=await Candidate.find({},'name party -_id');
        //return the list of candidates
        res.status(200).json(candidates);
    }
    catch(err){
        console.log(err);
        res.status(500).json({ error: 'internal server error' })

    }

})

module.exports = router;