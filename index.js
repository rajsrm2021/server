const express = require('express');
const mongoose = require('mongoose')
const cors = require('cors')

const app = express();
app.use(express.json());
app.use(cors());

mongoose.connect('mongodb+srv://raj:raj@cluster0.telvgtm.mongodb.net/one?retryWrites=true', { useNewUrlParser: true }).then(() => {
    console.log('Database Connected')
}).catch((err) => {
    console.log(err)
})

const userSchema = mongoose.Schema({
    S_No: {
        type: Number,
        required: true
    },
    Name: {
        type: String,
        required: true
    },
    Account_Number: {
        type: String,
        required: true,
        unique: true
    },
    Balance: {
        type: Number,
        default: 0.0
    }
})

const userModel = mongoose.model('userModel', userSchema);


const data = [
    {
        S_No: 6,
        Name: 'Meghana',
        Account_Number: '2817405',
        Balance: '70000000'
    },
    {
        S_No: 7,
        Name: 'Ashi',
        Account_Number: '2817406',
        Balance: '6000000'
    },
    {
        S_No: 8,
        Name: 'mr.raj',
        Account_Number: '2817407',
        Balance: '80000000'
    },
    {
        S_No: 9,
        Name: 'mr.chandan',
        Account_Number: '2817408',
        Balance: '120000000'
    },
    {
        S_No: 10,
        Name: 'ritik',
        Account_Number: '2817409',
        Balance: '500'
    },
]

app.get('/getusers', async (req, res) => {
    try {
        const response = await userModel.find();

        return res.send(response);
    }
    catch(err) {
        return res.json({
            msg: "There is some Fault"
        })
    }
})

// const addUsers = async () => {
//    await userModel.insertMany(data);
//     // await userModel.findByIdAndDelete('6411cff809344bfd6d27a7e3')
// }

//  addUsers();
const addUsers = async () => {
    try {
      const insertedData = await userModel.insertMany(data);
      console.log('Data inserted successfully:', insertedData);
    } catch (error) {
      console.error('Error inserting data:', error);
    }
  }

addUsers();
  

app.patch('/transfer', async (req, res) => {

    try {
    const {sen_acc, rec_acc, amt} = req.body;
        if(amt <= 0) {return res.status(203).json({
            msg: "Amount Cannot be Negative"
        })}

       const check1 = await userModel.findOne({Account_Number: sen_acc})
       console.log(check1)
       const check2 = await userModel.findOne({Account_Number: rec_acc})
       console.log(check1)


       if(!check1 || !check2) {
        return res.status(203).json({
            msg: 'Either Sender or Reciever Account does not exist'
        })
       }

       if(check1.Balance < amt) {
        return res.status(203).json({
            msg: 'Insufficient Balance'
        })
       }

       const q1 = await userModel.updateOne({
        Account_Number: sen_acc
       },
       {$inc: {"Balance": -amt}})

       const q2 = await userModel.updateOne({
        Account_Number: rec_acc
       },
       {$inc: {"Balance": amt}})

       if(q1 && q2) {
        return res.status(203).json({
            msg: "Amount successfully transfered"
        })
       }

       return res.status(500).json({
        msg: 'There is some Error There'
       })
    }
    catch(err) {
        return res.status(500).send(err)
    }
})


app.listen(5000, ()=> {
    console.log('server started')
})