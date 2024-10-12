// import express from 'express'
// import bodyParser from 'body-parser'
// import moment from 'moment'
// import mongoose from "mongoose";

// mongoose.connect('mongodb://127.0.0.1:27017/date')

// const dateSchema = new mongoose.Schema({
//     dateString: {
//         type: String,
//         required: true
//     },
//     eventID: [String],
//     startTime: [String],
//     endTime: [String],
//     // startDate: [String],
//     // endDate: [String],
//     totalHoursAvailable: Number
// })

// const Date = mongoose.model('Date', dateSchema)
// const app= express()

// app.use(bodyParser.urlencoded({extended: true}))
// app.set('view engine', 'ejs');

// // let date1 = moment("2010-10-20 4:30 AM","YYYY-MM-DD HH:mm A")
// // console.log(moment("2010-10-20 4:30 AM","YYYY-MM-DD HH:mm A"))
// // console.log(moment("2010-01-01T05:06:07").format("LLL"))
// // console.log(moment("2010-01-01T05:06:07").date())
// // console.log(moment("2010-01-01T05:06:07").month())
// // console.log(moment("2010-01-01T05:06:07").year())
// // console.log(moment("2010-01-01T05:06:07").hour())
// // console.log(moment("2010-01-01T05:06:07").minute())
// // console.log(moment("2010-01-01T05:06:07").second())

// app.get("/", (req,res)=>{
//     res.render("index",{})
// })

// app.post("/", async(req,res)=>{
//     let date = moment(`${req.body.date} 09:00`)
//     let duration = req.body.duration
//     let days = req.body.days
//     let id = req.body.eventID
//     let updated = 1

//     console.log(date.format('DD-MM-YYYY'),date.format('hh:mm A'),duration,days,id)

//     while(updated){
//         let dateData = await Date.findOne({dateString: date.format('DD-MM-YYYY')}).exec()

//         // console.log(dateData)
        
//         if(dateData){

//             console.log("Inside if")

//             if(dateData.totalHoursAvailable >= duration){

//                 console.log("Inside another if")
                
//                 let newStartTime = dateData.endTime.at(-1)
//                 let newDate = moment(`${dateData.dateString} ${newStartTime}`, 'DD-MM-YYYY hh:mm A')
//                 let newEndTime = newDate.add(duration, 'h').format('hh:mm A')

//                 dateData.eventID.push(id)
//                 dateData.startTime.push(newStartTime)
//                 dateData.endTime.push(newEndTime)
//                 dateData.totalHoursAvailable = dateData.totalHoursAvailable - duration

//                 // console.log(dateData)
            
//                 await dateData.save() 
//                 updated = 0
//             }
//             else{
//                 date.add(1, 'd')
//             }
//         }
//         else{

//             console.log("Inside else")

//             let newEndTime = date.add(duration, 'h').format('hh:mm A')
//             dateData = new Date({
//                 dateString: date.format('DD-MM-YYYY'),
//                 eventID: [id],
//                 startTime: ["09:00 AM"],
//                 endTime: [newEndTime],
//                 totalHoursAvailable: (8-duration)
//             })

//             // console.log(dateData)
            
//             await dateData.save() 
//             updated = 0
//         }
//     }
//     res.redirect('/')
// })

// app.listen(3000)

// // async function main() {    
// //     const data = await Date.find({});
// //     data.forEach((item,index)=>{
// //         console.log(`${index+1} : ${item}`)
// //     })
// // }

// // main().catch(err => console.log(err));