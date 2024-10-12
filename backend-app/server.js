const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require("path");

//Amadeus - Travel API
const Amadeus = require('amadeus');

//MongoDB
const mongoose = require("mongoose");

const moment = require('moment')
const PdfPrinter = require('pdfmake');

//AWS S3
const AWS = require("aws-sdk");
const {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
} = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");
//Multer - Handling File Uploads
const multer = require("multer");
//For opening URLs
const open = require("open");
//For sending mail after registering
const nodemailer = require("nodemailer"); //aglesEvent@2023
require("dotenv").config();
const port = 5000;

//Body-Parser
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

//Multer Initialization
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// const storage = multer.memoryStorage(); //Makes sure that the file is always stored in memeory
// const upload = multer({ storage: storage }); //and that it isn't stored in disk

//Amadeus Initialization
const amadeus = new Amadeus({
  clientId: process.env.AMADEUS_API_KEY,
  clientSecret: process.env.AMADEUS_API_SECRET
});

//MongoDB Connection
mongoose.connect(process.env.MONGODB_URI);

//S3 Initialization
//S3 related data from .env file
const bucketName = process.env.BUCKET_NAME;
const bucketRegion = process.env.BUCKET_REGION;
const awsAccessKey = process.env.AWS_ACCESS_KEY;
const awsSecretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;

//Configuring AWS Access
AWS.config.update({
  accessKeyId: awsAccessKey,
  secretAccessKey: awsSecretAccessKey,
  region: bucketRegion,
});
//Creating a new S3 Object
const s3Obj = new AWS.S3();

const s3 = new S3Client({
  credentials: {
    accessKeyId: awsAccessKey,
    secretAccessKey: awsSecretAccessKey,
  },
  region: bucketRegion,
});

//Nodemailer Initialization
const transporter = nodemailer.createTransport({
  service: "Outlook365",
  host: "smtp.office365.com",
  auth: {
    user: process.env.EMAIL_ID, // email ID
    pass: process.env.EMAIL_PASSWORD, // password
  },
});

//MongoDB Schema
const guestDataSchema = new mongoose.Schema({
  name: String,
  email: String,
  designation: String,
  researchFields: [String],
  imgURL: String,
  institution: String,
  guestLogin: String,
});

const eventSchema = new mongoose.Schema({
  lecturerName: String,
  lecturerEmail: String,
  topic: String,
  startTime: String, //given by scheduling algo
  endTime: String, //given by scheduling algo
  duration: String, //duration of event for scheduling
  startDate: String,
  endDate: String, //we can use moment library and compute the difference between the dates
  numberOfDays: String,
  resources: [String],
  supportingLecturers: [String],
  aboutSpeech: String,
  venue: String,
});

const studentDataSchema = new mongoose.Schema({
  name: String,
  rollNo: String,
  phoneNumber: Number,
  email: String,
  registeredEvents: [{ type: mongoose.Schema.Types.ObjectId, ref: 'EventData' }],
});


const commentSchema = new mongoose.Schema({
  author: { type: String, required: true },
  content: { type: String, required: true },
  createdAt: { type: String, default: moment().startOf("today").format("DD-MM-YYYY") },
  eventID: String
});

// const dateSchema = new mongoose.Schema({
//   dateString: {
//       type: String,
//       required: true
//   },
//   eventID: [String],
//   startTime: [String],
//   endTime: [String],
//   // startDate: [String],
//   // endDate: [String],
//   totalHoursAvailable: Number
// })

const dateSchema = new mongoose.Schema({
  dateString: {
      type: String,
      required: true
  },
  eventID: [String],
  startTime: [String],
  endTime: [String],
  // startDate: [String],
  // endDate: [String],
  multidayScheduled: Boolean,
  days: Number,
  totalHoursAvailable: Number
})

const accomodationSchema = new mongoose.Schema({
  hotelName: String,
  hotelLocation: String,
  hotelPrice: Number,
  hotelStayDuration: Number,

  flightName: String,
  flightBoardLoc: String,
  flightDestination: {
    type: String,
    default: 'Coimbatore'
  },
  flightDateOfTravel: String,
  flightCost: Number,

  localExpenses: [{
    expenseName: String,
    expensePrice: Number
  }],

  guestName: String,
  eventID: { type: mongoose.Schema.Types.ObjectId, ref: 'EventData' }
})

const guestData = mongoose.model("GuestData", guestDataSchema);

const eventData = mongoose.model("EventData", eventSchema);

const studentData = mongoose.model("StudentData", studentDataSchema);

const Date = mongoose.model('Date', dateSchema)

const Comment = mongoose.model('Comment', commentSchema);

const accomodation = mongoose.model("Accomodation", accomodationSchema);

console.log("Successful authentication with MongoDB");

app.get("/api/comments/:eventID", async(req, res) => {
  console.log("Comments")
  const eventID = req.params.eventID.replace(":", "");
  console.log("EventID: ", eventID)
  try{
    const comments = await Comment.find({eventID: eventID}).lean();
    res.status(200).json(comments)
  }catch(error){
    console.error('Error fetching comments:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
})

app.post("/api/comments", upload.none(), async(req, res) => {
  const name = req.body.author;
  const content = req.body.content
  const eventID = req.body.eventID
  console.log("Event ID: ", eventID)
  try{
    const newComment = new Comment({
      author: name,
      content: content,
      eventID: eventID,
    });
    const savedComment = await newComment.save()
    res.status(200).json({message: "Comment saved successfully"});
  }catch(error){
    res.status(500).json({message: "Error saving comment"});
  }

})

app.post("/api/add-student-profile", upload.none(), async (req, res) => {
  const name = req.body.name;
  const rollNo = req.body.rollNo;
  const phoneNumber = req.body.phoneNumber;
  const email = req.body.email;
  console.log(name);

  const newStudentData = new studentData({
    name: name,
    rollNo: rollNo,
    phoneNumber: phoneNumber,
    email: email,
  });

  try {
    await newStudentData.save();
    console.log("Data saved to MongoDB");
    res.status(200).json({ message: "Saved Student Data to database" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error saving data to database" });
    return;
  }
});

app.get("/api/check-student-profile/:email", async (req, res) => {
  const email = req.params.email.toLowerCase();
  var output = false;
  console.log(email);
  try {
    const studentDataOut = await studentData
      .find({ email: email }, { email: 1 })
      .lean();
    if (studentDataOut[0].email === email) {
      output = true;
    }
    console.log(output);
    res.status(200).json({ output: output });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.get("/api/list-lecturers", async (req, res) => {
  try {
    const lecturers = await guestData.find({}, { name: 1, email: 1 }).lean();
    res.status(200).json(lecturers);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.post("/api/addEvent", upload.none(), async (req, res) => {
  console.log("Server side is called");

  const lecturerName = req.body.lecturerName;
  const lecturerEmail = req.body.lecturerEmail;
  const topic = req.body.lecture;
  const startDate = req.body.startDate;
  const numberOfDays = req.body.numberOfDays;
  const endDate = req.body.endDate; //To be added later
  const supportingLecturers = req.body.supportingLecturers;
  const venue = req.body.location;
  const aboutSpeech = req.body.aboutSpeech;
  const startTime = req.body.startTime;
  const endTime = req.body.endTime;
  const duration = req.body.duration;

  console.log(req.body)

  console.log("Start Date: ", startDate);
  console.log("Start Time: ", startTime);
  console.log("End Time: ", endTime);
  
  const newEventData = new eventData({
    lecturerName: lecturerName,
    lecturerEmail: lecturerEmail,
    topic: topic,
    duration : duration,
    startDate: startDate,
    startTime: startTime,
    endTime: endTime,
    endDate: endDate,
    supportingLecturers: supportingLecturers,
    aboutSpeech: aboutSpeech,
    venue: venue,
  });

  // Save the new instance to the database
  try {
    await newEventData.save();
    console.log("Data saved to MongoDB");

    //Query the data and update date table with the event id
    //We use Start Date to query and update the ID field in date schema
    try {
      console.log("Inside other try-block")
      const result = await eventData
        .findOne(
          {
            lecturerName: lecturerName,
            topic: topic,
            startDate: startDate,
          },
          {
            _id: 1,
          }
        )
        .exec();

      //Accomodation Schema needs to be updated
      const destination = 'CJB'
      const origin = req.body.startDestination
      // const origin = "Chennai"

      console.log("Origin: ",origin)
      var orgIATA = ''
      if(origin == "Banglore"){
        orgIATA = 'BLR'
      }else if(origin == "Chennai"){
        orgIATA = 'MAA'
      }else if(origin == "Mumbai"){
        orgIATA = 'BOM'
      }else if(origin == "Delhi"){
        orgIATA = 'DEL'
      }
      console.log("IATA Origin: ",orgIATA)
      const dateOfStay = req.body.startDate
      // const dateOfStay = "23-06-2023"
      const dateOfBoardingFlight = moment(dateOfStay, "DD-MM-YYYY").subtract(1, 'day').format('YYYY-MM-DD')
      // const dateOfBoardingFlight = "2023-06-22"
      const dateFormatChange = moment(dateOfBoardingFlight, "YYYY-MM-DD").format("DD-MM-YYYY") //Travel date in DD-MM-YYYY format
      // const dateFormatChange = "22-06-2023" //Travel date in DD-MM-YYYY format

      console.log("Date of Stay: ",dateOfStay)
      console.log("Date of Boarding Flight: ", dateOfBoardingFlight)
      console.log("Date of Boarding Flight Format Change: ", dateFormatChange)
      
      try {
        const flightDataRes = await amadeus.shopping.flightOffersSearch.get({
          originLocationCode: orgIATA,
          destinationLocationCode: destination,
          departureDate: dateOfBoardingFlight,
          adults: '1',
          currencyCode: 'INR'
        })

        const flightData = flightDataRes.data
    
        const hotelDataRes = await amadeus.referenceData.locations.hotels.byCity.get({
          cityCode: 'CJB',
          ratings: '3,4,5',
          radiusUnit: 'KM'
        })

        const hotelData = hotelDataRes.data
    
        const randIndex = Math.floor(Math.random() * hotelData.length);
        console.log(randIndex);
    
        const sortedFlightData = flightData.sort((r1, r2) => r1.price.grandTotal - r2.price.grandTotal);
    
        const url = `https://nominatim.openstreetmap.org/reverse?lat=${hotelData[randIndex].geoCode.latitude}&lon=${hotelData[randIndex].geoCode.longitude}&format=json`;
    
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error('Request failed with status: ' + response.status);
        }
        const data = await response.json();
        hotelData[randIndex].address = data.display_name;

        const flightName = sortedFlightData[0].itineraries[0].segments[0].carrierCode + sortedFlightData[0].itineraries[0].segments[0].number
    
        const travelAndAccomodation = new accomodation({
          hotelName: hotelData[randIndex].name,
          hotelLocation: hotelData[randIndex].address,
          hotelPrice: getHotelPrice(),
          hotelStayDuration: 1, // Set your desired stay duration value here

          flightName: flightName,
          flightBoardLoc: origin,
          flightDestination: destination,
          flightDateOfTravel: dateFormatChange,
          flightCost: parseInt(sortedFlightData[0].price.grandTotal),
          localExpenses: [], // Set your desired local expenses array here
          guestName: lecturerName, // Set the guest name here
          eventID: result // Set the event ID here
        });
    
        // Save the hotel data to MongoDB
        await travelAndAccomodation.save();
        console.log("Hotel and Flight Information saved successfully")

      //Date String needs to be updated in the Scheduler
      const updateDate = await Date.findOne({
        dateString: startDate,
      }).exec();

      // if(numberOfDays)

      let tempDays = numberOfDays;
      let tempStartDate = moment(startDate, "DD-MM-YYYY")

      while(tempDays){
        const updateDate = await Date.findOne({
          dateString: tempStartDate.format("DD-MM-YYYY"),
        }).exec(); 
        if(updateDate.multidayScheduled && tempDays == 1){
          updateDate.eventID.splice(updateDate.eventID.length - 2, 1, result)
        }else if(!updateDate.multidayScheduled && tempDays == 1){
          updateDate.eventID.pop();
          updateDate.eventID.push(result);
        }else{
          updateDate.eventID.pop();
          updateDate.eventID.push(result);
          tempStartDate.add(1, 'd')
        }
        console.log(tempStartDate)
        await updateDate.save();
        tempDays--;
      }

      // updateDate.eventID.pop();
      // updateDate.eventID.push(result);
      // await updateDate.save();
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Error saving data to database" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error saving data to database" });
  }
} catch (err) {
  console.error(err);
  res.status(500).json({ message: "Error saving data to database" });
}
});

app.get('/hotelAndFlight', async(req,res)=>{

  const flightDataRes = await amadeus.shopping.flightOffersSearch.get({
      originLocationCode: 'MAA',
      destinationLocationCode: 'CJB',
      departureDate: '2023-07-10',
      adults: '1',
      currencyCode: "INR"
  })
  const flightData = flightDataRes.data

  const hotelDataRes = await amadeus.referenceData.locations.hotels.byCity.get({
      cityCode: 'CJB',
      ratings: "3,4,5",
      radiusUnit: "KM"
  })

  const hotelData = hotelDataRes.data

  let randIndex = parseInt((Math.floor(Math.random() * (hotelData.length)).toFixed(2)));
  console.log(randIndex)

  let sortedFlightData = flightData.sort((r1, r2) => r1.price.grandTotal - r2.price.grandTotal);

  const url = `https://nominatim.openstreetmap.org/reverse?lat=${hotelData[randIndex].geoCode.latitude}&lon=${hotelData[randIndex].geoCode.longitude}&format=json`;

  {
      try {
          const response = await fetch(url);
          if (!response.ok) {
              throw new Error('Request failed with status: ' + response.status);
          }
          const data = await response.json();
          hotelData[randIndex].address = data.display_name
      } catch (error) {
          console.error('Error:', error);
      }
  }
  res.send(sortedFlightData[0].price.grandTotal)
})

function getHotelPrice() {
  var min = 2000;
  var max = 6000;
  return Math.floor(Math.random() * (max - min + 1)) + min;
}


// app.post("/api/scheduler", upload.none(), async (req, res) => {

//   const parsedDate = moment(req.body.dateToBeScheduled).set({
//     hour: 09,
//     minute: 00,
//   });

//   const duration = req.body.duration_event;
//   const days = req.body.numberOfDays;
//   const id = "temp";
//   const formattedDate = parsedDate.format("DD-MM-YYYY hh:mm A");
//   console.log("Formatted Date: ", formattedDate);
//   let updated = 1;

//   const scheduledTimeAndDate = {
//     startTime: "",
//     endTime: "",
//     startDate: "",
//     endDate: "",
//   }

//   while (updated) {
//     let dateData = await Date.findOne({
//       dateString: parsedDate.format("DD-MM-YYYY"),
//     }).exec();
//     if (dateData) {
//       console.log("Inside if");

//       if (dateData.totalHoursAvailable >= duration) {
//         console.log("Inside another if");

//         let newStartTime = dateData.endTime.at(-1);
//         let newDate = moment(
//           `${dateData.dateString} ${newStartTime}`,
//           "DD-MM-YYYY hh:mm A"
//         );
//         let newEndTime = newDate.add(duration, "h").format("hh:mm A");

//         dateData.eventID.push(id);
//         dateData.startTime.push(newStartTime);
//         dateData.endTime.push(newEndTime);
//         dateData.totalHoursAvailable = dateData.totalHoursAvailable - duration;

//         // console.log(dateData)

//         await dateData.save();
//         updated = 0;
//       } else {
//         parsedDate.add(1, "d");
//       }
//     } else {
//       console.log("Inside else");

//       let newEndTime = parsedDate.add(duration, "h").format("hh:mm A");
//       dateData = new Date({
//         dateString: parsedDate.format("DD-MM-YYYY"),
//         eventID: [id],
//         startTime: ["09:00 AM"],
//         endTime: [newEndTime],
//         totalHoursAvailable: 8 - duration,
//       });

//       // console.log(dateData)

//       await dateData.save();
//       updated = 0;
//     }
//     if(!updated){
//       scheduledTimeAndDate.startTime = dateData.startTime.at(-1)
//       scheduledTimeAndDate.endTime = dateData.endTime.at(-1)
//       scheduledTimeAndDate.date = dateData.dateString
//       console.log(dateData)
//     }
//   }
//   console.log(scheduledTimeAndDate)
//   res.status(200).json(scheduledTimeAndDate)
// })

app.post("/api/scheduler", upload.none(), async (req, res) => {

  const parsedDate = moment(req.body.dateToBeScheduled).format("DD-MM-YYYY")
  const date = moment(`${parsedDate} 09:00 AM`, "DD-MM-YYYY hh:mm A");

  const duration = req.body.duration_event;
  const days = req.body.numberOfDays;
  const id = "temp";
  // const formattedDate = date.format("DD-MM-YYYY hh:mm A");
  // console.log("Formatted Date: ", formattedDate);
  let updated = 1
  
  let checkModified = 0
  let check = 1

  const scheduledTimeAndDate = {
    startTime: "",
    endTime: "",
    startDate: "",
    endDate: "",
  }

  console.log(date.format('DD-MM-YYYY'), date.format('hh:mm A'), duration, days, id)

  while (updated) {
      let dateData = await Date.findOne({ dateString: date.format('DD-MM-YYYY') }).exec()
      // console.log(dateData)

      if (days == 1) {
          if (dateData) {
              if (dateData.totalHoursAvailable >= duration) {
                  if(dateData.multidayScheduled){
                      if(dateData.eventID.length == 1){
                          let newEndTime = 9+parseInt(duration)
                          if(newEndTime==12){
                              newEndTime = `${newEndTime}:00 PM`
                          }
                          else if(newEndTime==11){
                              newEndTime = `${newEndTime}:00 AM`
                          }
                          else{
                              newEndTime = `0${newEndTime}:00 AM`
                          }
                          dateData.eventID.splice(0,0,id)
                          dateData.startTime.splice(0,0,"09:00 AM")
                          dateData.endTime.splice(0,0,newEndTime)
                      }
                      else{
                          let newStartTime = dateData.endTime.at(dateData.endTime.length-2)
                          let newDate = moment(`${dateData.dateString} ${newStartTime}`, 'DD-MM-YYYY hh:mm A')
                          let newEndTime = newDate.add(duration, 'h').format('hh:mm A')

                          dateData.eventID.splice((dateData.eventID.length-1),0,id)
                          dateData.startTime.splice((dateData.startTime.length-1),0,newStartTime)
                          dateData.endTime.splice((dateData.endTime.length-1),0,newEndTime)
                      }
                  }
                  else{
                      let newStartTime = dateData.endTime.at(-1)
                      let newDate = moment(`${dateData.dateString} ${newStartTime}`, 'DD-MM-YYYY hh:mm A')
                      let newEndTime = newDate.add(duration, 'h').format('hh:mm A')

                      dateData.eventID.push(id)
                      dateData.startTime.push(newStartTime)
                      dateData.endTime.push(newEndTime)
                  }
                  dateData.totalHoursAvailable = dateData.totalHoursAvailable - duration

                  await dateData.save()
                  updated = 0
              }
              else {
                  date.add(1, 'd')
              }
          }
          else {
              let newEndTime = date.add(duration, 'h').format('hh:mm A')
              dateData = new Date({
                  dateString: date.format('DD-MM-YYYY'),
                  eventID: [id],
                  startTime: ["09:00 AM"],
                  endTime: [newEndTime],
                  multidayScheduled: false,
                  days: 1,
                  totalHoursAvailable: (6 - duration)
              })

              await dateData.save()
              updated = 0
          }
      }
      else{
          if(dateData){
              let numberDays = days
              if(dateData.multidayScheduled != false){
                  date.add(dateData.days, 'd')
              }
              else {
                  let date1 = moment(`${date.format('DD-MM-YYYY')}`, 'DD-MM-YYYY')
                  if(checkModified==0){
                      while (--numberDays) {
                          date1.add(1, 'd')
                          let dateData1 = await Date.findOne({ dateString: date1.format('DD-MM-YYYY') }).exec()
                          if(dateData1){
                              if (dateData1.multidayScheduled) {
                                  date.add(dateData1.days, 'd')
                                  check = 0
                                  break
                              }
                          }
                      }
                  }
                  if (check == 1) {
                      dateData.days = (days - checkModified)
                      checkModified +=1;

                      dateData.multidayScheduled = true
                      dateData.eventID.push(id)
                      dateData.startTime.push("03:00 PM")
                      dateData.endTime.push(`0${3+parseInt(duration)}:00 PM`)
                      
                      await dateData.save()
                      if(checkModified == days){
                          updated = 0
                      }else{
                          date.add(1, 'd')
                      }
                  }
              }
          }
          else{
              if (check == 1) {
                  dateData = new Date({
                      dateString: date.format('DD-MM-YYYY'),
                      eventID: [id],
                      startTime: ["03:00 PM"],
                      endTime: [`0${3+parseInt(duration)}:00 PM`],
                      totalHoursAvailable: (6),
                      days: (days - checkModified),
                      multidayScheduled: true
                  })
                  checkModified +=1;
                  
                  await dateData.save()
                  if(checkModified == days){
                      updated = 0
                  }
                  else{
                      console.log(date.format('DD-MM-YYYY'))
                      date.add(1, 'd')
                      console.log(date.format('DD-MM-YYYY'))
                  }
              }
              else{
                  let date1 = moment(`${date.format('DD-MM-YYYY')}`, 'DD-MM-YYYY')
                  if(checkModified==0){
                      while (--numberDays) {
                          date1.add(1, 'd')
                          let dateData1 = await Date.findOne({ dateString: date1.format('DD-MM-YYYY') }).exec()
                          if(dateData1){
                              if (dateData1.multidayScheduled) {
                                  date.add(dateData1.days, 'd')
                                  check = 0
                                  break
                              }
                          }
                      }
                  }
                  console.log(date.format('DD-MM-YYYY'))
                  if (check == 1) {
                      dateData.days = (days - checkModified)
                      checkModified +=1;

                      dateData.multidayScheduled = true
                      dateData.eventID.push(id)
                      dateData.startTime.push("03:00 PM")
                      dateData.endTime.push(`0${3+parseInt(duration)}:00 PM`)
                      
                      await dateData.save()
                      if(checkModified == days){
                          updated = 0
                      }else{
                          date.add(1, 'd')
                          console.log(date.format('DD-MM-YYYY'))
                      }
                  }
              }
          }
      }
      if(days == 1 && !updated){
        //Single Day
        scheduledTimeAndDate.startDate = dateData.dateString
        scheduledTimeAndDate.endDate = dateData.dateString
        console.log(dateData)
        if(dateData.multidayScheduled){
            scheduledTimeAndDate.startTime = dateData.startTime.at(dateData.startTime.length - 2)
            scheduledTimeAndDate.endTime = dateData.endTime.at(dateData.endTime.length - 2)    
        }else{
            scheduledTimeAndDate.startTime = dateData.startTime.at(-1)
            scheduledTimeAndDate.endTime = dateData.endTime.at(-1)
        }
      }else{
        if(check == 1 && checkModified == 1){
          const newDate = moment(`${dateData.dateString}`, 'DD-MM-YYYY')
          scheduledTimeAndDate.startDate = dateData.dateString
          scheduledTimeAndDate.endDate = newDate.add(days, 'd').format("DD-MM-YYYY")
          scheduledTimeAndDate.startTime = dateData.startTime.at(-1)
          scheduledTimeAndDate.endTime = dateData.endTime.at(-1)
        }
      }
  }
  console.log(scheduledTimeAndDate)
  res.status(200).json(scheduledTimeAndDate)
})

// app.get("/api/get-guest-lecturer/:name/:email", async (req, res) => {
//   //Since name and email is always a unique entity, we are fetching using that combination
//   const name = decodeURIComponent(req.params.name.replace(/_/g, " "));
//   const email = decodeURIComponent(req.params.email.replace(/_/g, " "));
//   try {
//     const query = { name, email };
//     const result = await guestData.findOne(query);
//     if (result) {
//       res.json(result);
//     } else {
//       res.send("No data found");
//     }
//   } catch (error) {
//     console.log(error);
//     res.status(500).json({ message: "Error retrieving data" });
//   }
// });

app.post("/api/uploadFile", upload.single("file"), async(req, res) => {
  const name = req.body.name;
  const email = req.body.email;
  const eventID = req.body.eventID;
  const orgFileName = req.file.originalname
  const userFileName = req.body.fileName
  //Flow: Fetch event details using event id, create a file in s3 using event topic + lecture name
  //Store file in s3 and get the URL and store it in mongodb
  //or try to replicate what you did for chemical conference
  console.log("Reached API Call for upload")
  console.log("Event ID: ", eventID)
  console.log("File name: ", orgFileName)
  console.log("File: ", req.file)
  console.log("User File Name: ", userFileName)
  console.log(req.file != null)
  try {
    const event = await eventData.findById(eventID);
    console.log("Event Object: ", event);
    console.log(req.file != null)

    if (!event) {
      console.log("Event not found");
      res.status(500).json({ message: "Event not found" });
    } else {
      //The file gets stored in S3 in the directory eventID/fileName -> entered by user
      const locationFile = eventID + "/" + userFileName;
      console.log("Location dir: ", locationFile);

      if (req.file != null) {
        let params = {
          Bucket: bucketName,
          Key: locationFile, //Name set as guestname_guestemail - Unique to a particular lecturer
          Body: req.file.buffer, //File Contents in Buffer Format
          ContentType: req.file.mimetype, //Tells S3 the File Type
        };
        console.log("Inside req.file not null");
        const commandPut = new PutObjectCommand(params);
        await s3.send(commandPut); //Tells S3 to upload the file we have sent the server from HTML
        console.log("Successfully uploaded file");

        event.resources.push(userFileName);
        await event.save();

        //Now retrieve this object to send it to the frontend
        const updatedEvent = await eventData.findById(eventID);

        console.log("Successfully send updated event");
        res
          .status(200)
          .json({ event: updatedEvent, message: "Successfully uploaded file" });
      } else {
        console.log("Reached else block");
      }
    }
    console.log("Event found");
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
})

app.post("/api/openFile", upload.none(), async (req, res) => {
  const directoryName = req.body.eventID;
  const fileName = req.body.fileName;
  const dirURL = directoryName + "/" + fileName
  console.log(dirURL)
  try{
    const getObjectParams = {
      Bucket: bucketName,
      Key: dirURL,
    }
    const command = new GetObjectCommand(getObjectParams);
    const url = await getSignedUrl(s3, command, { expiresIn: 3600 });
    open(url, function (err) {
      if(err){
        throw err;
      }  
    });
    res.status(200).json({message: "Successfully opened file"})
  }catch(error){
    res.status(500).json({message: "Unable to open file"})
  }
  
})


app.get("/api/getFiles/:eventID", async (req, res) => {
  const eventID = req.params.eventID.replace(":", "");
  try{
    const event = await eventData.findById(eventID)
    console.log("Successfully sent data")
    res.status(200).json(event);
  }catch(error){
    res.status(500).json({message: "Error Retrieving data"})
  }
})


app.post("/api/add-guest-lecturers",upload.single("image"),async (req, res) => {
    //ADD LOGIC FOR NOT ADDING IF LECTURE DATA ALREADY EXISTS
    const name = req.body.name;
    const email = req.body.email;

    try {
      // Check if a guest lecture entry with the same name and email already exists
      const existingGuestData = await guestData.findOne({
        name: name,
        email: email,
      });

      if (existingGuestData) {
        // If the entry already exists, return an appropriate response
        return res.status(200).json({ message: "Guest lecture entry already exists" });
      }
      //Flow: First upload the file to S3. then get the file and generate URL and store it in mongoDB
      //Creating variables for uploading data
      const designation = req.body.designation;
      const researchFields = req.body.researchTopics;
      const institution = req.body.institution;
      const file = req.file;

      //S3 Location
      const fileType = "." + req.file.mimetype.split("/")[1];
      const fileName = name + "_" + email;
      const locationFile = "DP/" + fileName;
      // console.log("File Name: " + fileName)
      if (req.file != null) {
        let params = {
          Bucket: bucketName,
          Key: locationFile, //Name set as guestname_guestemail - Unique to a particular lecturer
          Body: req.file.buffer, //File Contents in Buffer Format
          ContentType: req.file.mimetype, //Tells S3 the File Type
        };
        const commandPut = new PutObjectCommand(params);
        await s3.send(commandPut); //Tells S3 to upload the file we have sent the server from HTML
        console.log("Successfully uploade file");

        //Now after successfully uploading the file, get the file
        const getObjectParams = {
          Bucket: bucketName,
          Key: locationFile,
        };
        const commandGet = new GetObjectCommand(getObjectParams);
        const url = await getSignedUrl(s3, commandGet, { expiresIn: 604800 });

        //Use URL to access the object
        //Adding the information into mongoDB database
        const guestLogin = "guest_" + email;
        const newGuestData = new guestData({
          name: name,
          email: email,
          designation: designation,
          researchFields: researchFields,
          institution: institution,
          imgURL: url,
          guestLogin: guestLogin,
        });

        // Save the new instance to the database
        try {
          await newGuestData.save();
          console.log("Data saved to MongoDB");
        } catch (err) {
          console.error(err);
          res.status(500).json({ message: "Error saving data to database" });
          return;
        }
      }
    } catch (e) {
      console.error(err);
      res.status(500).json({ message: "Error with database" });
    }
    // console.log(file)
    // console.log(req.body); // log the incoming form data
    res.status(200).json({ message: "Received form data successfully!" });
  }
);

app.get("/api/guestDetails/:name/:email/:topic", async (req, res) => {
  console.log("Request Reached");
  const name = decodeURIComponent(req.params.name.replace(/_/g, " "));
  const email = req.params.email;
  const topic = decodeURIComponent(req.params.topic.replace(/_/g, " "));
  try {
    const query = { name, email, topic };
    const result = await guestData.findOne(query);
    if (result) {
      res.json(result);
    } else {
      res.send("No data found");
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error retrieving data" });
  }
});

app.get("/api/events/:email", async (req, res) => {
  //Since we have 2 separate Schemas for Guest and Event,
  //we'll have to fetch using both
  const email = req.params.email.replace(":", "");
  console.log(email);
  try {
    const events = await eventData
      .find(
        {},
        {
          lecturerName: 1,
          topic: 1,
          venue: 1,
          startDate: 1,
          lecturerEmail: 1,
          startTime: 1,
          endTime: 1,
          endDate: 1,
          resources: 1,
          supportingLecturers: 1,
          aboutSpeech: 1,
        }
      )
      .exec();
    const guests = await guestData
      .find(
        req.params.email != "temp"
          ? { guestLogin: req.params.email.replace(":", "") }
          : {},
        {
          designation: 1,
          imgURL: 1,
          name: 1,
          email: 1,
          researchFields: 1,
          institution: 1,
        }
      )
      .exec();
    console.log(guests);

    const combinedData = [];
    for (const event of events) {
      for (const guest of guests) {
        if (
          event.lecturerName === guest.name &&
          event.lecturerEmail === guest.email
        ) {
          combinedData.push({
            eventID: event._id,
            guestID: guest._id,
            researchFields: guest.researchFields,
            institution: guest.institution,
            name: event.lecturerName,
            email: event.lecturerEmail,
            imgURL: guest.imgURL,
            venue: event.venue,
            startDate: event.startDate,
            topic: event.topic,
            designation: guest.designation,
            startTime: event.startTime,
            endTime: event.endTime,
            endDate: event.endDate,
            resources: event.resources,
            aboutSpeech: event.aboutSpeech,
            supportingLecturers: event.supportingLecturers,
          });
        }
      }
    }
    console.log(combinedData);
    res.status(200).json(combinedData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error retrieving events" });
  }
});

app.post("/api/registerEvent/:eventID/:email", async (req, res) => {
  const eventID = req.params.eventID.replace(":", "");
  const studentEmail = req.params.email.replace(":", "");

  console.log("Reached here and got eventID! " + eventID);
  console.log("Reached here and got student email ID! " + studentEmail);

  try {
    const student = await studentData.findOne({ email: studentEmail }).exec();

    console.log(student);

    if (!student) {
      return res.status(404).json({ error: "Student not found" });
    }
    const event = await eventData.findById(eventID);

    if (!event) {
      return res.status(404).json({ error: "Event not found" });
    }

    console.log(event);

    student.registeredEvents.push(event);
    await student.save();

    console.log("Student Registered Successfully");

    //Sending email to the student letting them know they successfully registered
    const htmlContent = `
      <!DOCTYPE html>
      <html lang="en">

      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>

      <body style="background-color: #f7fafc;">
          <div style="max-width: 36rem; margin: 0 auto; padding: 1rem;">
              <div style="background-color: #fff; box-shadow: 0 0.25rem 0.5rem rgba(0, 0, 0, 0.1); border-radius: 0.5rem; padding: 1.5rem;">
                  <p style="margin-bottom: 1rem;">Dear ${student.name},</p>
                  <p style="margin-bottom: 1rem;">Thank you for registering for the event with us!</p>
                  <p style="margin-bottom: 1rem;">All details related to the lecture can be found in the profile section.</p>
                  <p style="margin-bottom: 1rem;">Hope you have a good time and find the lecture informative!</p>
                  <img src="cid:identifierForImage_01" alt="Newsletter Image" style="display: block; margin: 0 auto; max-height: 350px; border-radius: 0.5rem;">
                  <p style="margin-bottom: 0.5rem; font-weight: 700; text-transform: uppercase;">Lecture details at a glance</p>
                  <p style="margin-bottom: 0.5rem;"><span style="font-weight: 700;">Lecture Name: </span>${event.topic}</p>
                  <p style="margin-bottom: 0.5rem;"><span style="font-weight: 700;">Lecturer Name: </span>${event.lecturerName}</p>
                  <p style="margin-bottom: 0.5rem;"><span style="font-weight: 700;">Date: </span>${event.startDate}</p>
                  <p style="margin-bottom: 1rem;">Be on the lookout for more such exciting lectures to come!</p>
                  <p style="margin-bottom: 1rem;">Happy Learning!</p>
                  <p style="margin-bottom: 1rem;">Regards,</p>
                  <p style="font-weight: 700;">Team AGLES</p>
              </div>
          </div>
      </body>

      </html>
      `;

    const options = {
      from: "agles-events@outlook.com",
      to: studentEmail,
      subject: "Mail sent using Node mailer!",
      text: "Simple body sent as a trial",
      html: htmlContent,
      attachments: [
        {
          filename: "thankyou.png",
          path: "./assets/thankyou.png",
          cid: "identifierForImage_01", //same cid value as in the html img src
        },
      ],
    };

    transporter.sendMail(options, function (err, info) {
      if (err) {
        console.log(err);
        return;
      }
      console.log("Sent: " + info.response);
    });

    return res.json({ message: "Event registered successfully", registered: true });
  } catch (error) {
    console.error("Error registering event:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/api/getAccomodation", async(req, res) => {
  console.log("Reached here")
  const name = "Tim Cook"
  const flightPrice = 4670
  const hotelPrice = 5274
  try{
    const accomodations = await accomodation.find({
      guestName: name,
      flightCost: flightPrice,
      hotelPrice: hotelPrice
    }, {}).exec()

    if(!accomodations){
      res.status(500).json({message:"Error finding data"})
      return;
    }

    console.log(accomodations)

    res.status(200).json(accomodations)
    console.log("Data Sent successfully")

  }catch(error){
    res.status(500).json({message:"Internal Server Error"})
  }
})

app.get("/api/checkRegistered/:email", async(req, res) => {
  const studentEmail = req.params.email;
  console.log("Check Registered")
  console.log(studentEmail)
  try{
    const student = await studentData.findOne({ email: studentEmail }).exec();
    
    if(!student){
      res.status(404).json({message: "Student data not found"})
    }
    console.log("Data fetched successfully for email ", studentEmail)
    res.status(200).json(student)

  }catch(err){
    console.log("Error checking DB", err)
    return res.status(500).json({error: "Internal Server Error"})
  }
})

app.get("/api/checkPhoneNumber/:phoneNumber", async(req, res) => {
  const phoneNumber = parseInt(req.params.phoneNumber)
  console.log("Reached Here in Phone Number API call")
  // console.log(phoneNumber)
  // console.log(typeof phoneNumber)
  try{
    const student = await studentData.findOne({phoneNumber: phoneNumber}).lean()
    if (student) {
      console.log(student)
      // If the entry already exists, return an appropriate response
      return res.status(200).json(student);
    }else{
      return res.status(200).json({})
    }
  }catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error retrieving events" });
  }
})

app.get("/api/get-student-data/:email", async(req, res) => {
  const email = req.params.email.replace(":", "");
  console.log(email)
  try {
    const student_data = await studentData.findOne({email: email}).exec()
    const events = await eventData
    .find(
      {},
      {
        lecturerName: 1,
        topic: 1,
        venue: 1,
        startDate: 1,
        lecturerEmail: 1,
        startTime: 1,
        endTime: 1,
        endDate: 1,
        resources: 1,
        supportingLecturers: 1,
        aboutSpeech: 1,
      }
    )
    .exec();
  const guests = await guestData
    .find(
      {},
      {
        designation: 1,
        imgURL: 1,
        name: 1,
        email: 1,
        researchFields: 1,
        institution: 1,
      }
    )
    .exec();
  console.log(guests);

  const combinedData = [];
  for (const event of events) {
    for (const guest of guests) {
      if (
        event.lecturerName === guest.name &&
        event.lecturerEmail === guest.email
      ) {
        combinedData.push({
          eventID: event._id,
          guestID: guest._id,
          researchFields: guest.researchFields,
          institution: guest.institution,
          name: event.lecturerName,
          email: event.lecturerEmail,
          imgURL: guest.imgURL,
          venue: event.venue,
          startDate: event.startDate,
          topic: event.topic,
          designation: guest.designation,
          startTime: event.startTime,
          endTime: event.endTime,
          endDate: event.endDate,
          resources: event.resources,
          aboutSpeech: event.aboutSpeech,
          supportingLecturers: event.supportingLecturers,
        });
      }
    }
  }

    if(student_data){
      console.log(student_data)
      console.log(combinedData)
      const result_object = {
        student_data: student_data,
        event_data: combinedData
      }
      res.status(200).json(result_object)
    }else{
      res.status(500).json({message: "Error Finding Student Data"})
    }
  }catch(err){
    res.status(500).json({message: "Cannot connect with server"})
  }
})

app.post('/api/generateReport/:type/:value', async(req, res) => {
  const { value } = req.params;

  console.log("Value - ", value)
  var fonts = {
    Roboto: {
      normal: './assets/Roboto/Roboto-Regular.ttf',
      bold: './assets/Roboto/Roboto-Bold.ttf',
      italics: './assets/Roboto/Roboto-Italic.ttf',
      bolditalics: './assets/Roboto/Roboto-BoldItalic.ttf'
    }
  };

  // Create a new PDF document
  var printer = new PdfPrinter(fonts);
  var fs = require('fs');

  var data = [];

  data["invoicenumber"] = "62384";


  //If we want to iterate over each data
  //We can have a variable total to calculate the total costs incurred so far.
  //We can have a dashboard to show number of flights and hotels booked etc
  /*
  {
        image: 'https://via.placeholder.com/300x600', // Replace with the path to your logo image
        width: 600, // Adjust the width as per your requirements
        alignment: 'center'
      },
  */

  const monthExpenses = {
    Jan:{
      flight:0,
      hotel:0,
      other:0,
      sum:0
    },
    Feb:{
      flight:0,
      hotel:0,
      other:0,
      sum:0
    },
    Mar:{
      flight:0,
      hotel:0,
      other:0,
      sum:0
    },
    Apr:{
      flight:0,
      hotel:0,
      other:0,
      sum:0
    },
    May:{
      flight:0,
      hotel:0,
      other:0,
      sum:0
    },
    Jun:{
      flight:0,
      hotel:0,
      other:0,
      sum:0
    },
    Jul:{
      flight:0,
      hotel:0,
      other:0,
      sum:0
    },
    Aug:{
      flight:0,
      hotel:0,
      other:0,
      sum:0
    },
    Sep:{
      flight:0,
      hotel:0,
      other:0,
      sum:0
    },
    Oct:{
      flight:0,
      hotel:0,
      other:0,
      sum:0
    },
    Nov:{
      flight:0,
      hotel:0,
      other:0,
      sum:0
    },
    Dec:{
      flight:0,
      hotel:0,
      other:0,
      sum:0
    },
  }

  

  const months = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
  ];
  
  // Helper function to extract the month from a date string (e.g., "15-06-2023") and return it in text format
  function getMonthFromDateString(dateString) {
    const [day, month, year] = dateString.split('-');
    const monthIndex = parseInt(month) - 1;
    return months[monthIndex];
  }

  try{
      const accomodations = await accomodation.find({}, {})
      
        // Iterate through each accomodation object
        accomodations.forEach((accomodation) => {
          const { flightDateOfTravel, flightCost, hotelPrice } = accomodation;
          const month = getMonthFromDateString(flightDateOfTravel);
      
          // Add flightCost and hotelPrice to the corresponding month's object in monthExpenses
          monthExpenses[month].flight += flightCost;
          monthExpenses[month].hotel += hotelPrice;
          monthExpenses[month].sum = monthExpenses[month].flight + monthExpenses[month].hotel;
        });
    
      console.log(monthExpenses);
  } catch(error){
    console.log(error)
  }

  let sumV = 0;

  for (const month in monthExpenses) {
    sumV += monthExpenses[month].sum
  }
  

  var dd = {
    content: [
      {
        image: './assets/avv_logo.png',
        width: 200, // Adjust the width as per your requirements
        height: 75, // Adjust the height as per your requirements
        alignment: 'center'
      },
      { text: '2023 Expense Report', style: 'header', alignment: 'center', margin: [0, 20, 0, 40] },
    {
      table: {
        headerRows: 1,
        widths: [200, '*', '*', '*', '*'],
        heights: [25, 25, 25, 25, 25],
        body: [
          // Column headers
          [

            { text: 'Expenses', style: 'tableHeader', alignment: 'center', margin: [0, 10, 0, 10]},
            { text: 'Jan', style: 'tableHeader', alignment: 'center', margin: [0, 10, 0, 10] },
            { text: 'Feb', style: 'tableHeader', alignment: 'center', margin: [0, 10, 0, 10] },
            { text: 'Mar', style: 'tableHeader', alignment: 'center', margin: [0, 10, 0, 10] },
            { text: 'Apr', style: 'tableHeader', alignment: 'center', margin: [0, 10, 0, 10] },
          ],
          // Expense rows
          [
            { text: 'Hotel Cost',alignment: 'center', margin: [0, 10, 0, 10] },
            { text: monthExpenses.Jan.hotel, alignment: 'center', margin: [0, 10, 0, 10] },
            { text: monthExpenses.Feb.hotel, alignment: 'center', margin: [0, 10, 0, 10] },
            { text: monthExpenses.Mar.hotel, alignment: 'center', margin: [0, 10, 0, 10] },
            { text: monthExpenses.Apr.hotel, alignment: 'center', margin: [0, 10, 0, 10] },
          ],
          [
            { text: 'Air Ticket Cost', alignment: 'center', margin: [0, 10, 0, 10] },
            { text: monthExpenses.Jan.flight, alignment: 'center', margin: [0, 10, 0, 10] },
            { text: monthExpenses.Feb.flight, alignment: 'center', margin: [0, 10, 0, 10] },
            { text: monthExpenses.Mar.flight, alignment: 'center', margin: [0, 10, 0, 10] },
            { text: monthExpenses.Apr.flight, alignment: 'center', margin: [0, 10, 0, 10] },
          ],
          [
            { text: 'Other Expenses', alignment: 'center', margin: [0, 10, 0, 10] },
            { text: monthExpenses.Jan.other, alignment: 'center', margin: [0, 10, 0, 10] },
            { text: monthExpenses.Feb.other, alignment: 'center', margin: [0, 10, 0, 10] },
            { text: monthExpenses.Mar.other, alignment: 'center', margin: [0, 10, 0, 10] },
            { text: monthExpenses.Apr.other, alignment: 'center', margin: [0, 10, 0, 10] },
          ],
          // Total Expenses row
          [
            { text: 'Monthly Total', style: 'tableTotal', alignment: 'center', margin: [0, 10, 0, 10] },
            { text: monthExpenses.Jan.sum, alignment: 'center', margin: [0, 10, 0, 10] },
            { text: monthExpenses.Feb.sum, alignment: 'center', margin: [0, 10, 0, 10] },
            { text: monthExpenses.Mar.sum, alignment: 'center', margin: [0, 10, 0, 10] },
            { text: monthExpenses.Apr.sum, alignment: 'center', margin: [0, 10, 0, 10] },
          ]
        ]
      }
    },
    { text: '\n\n\n\n\n', margin: [0, 20, 0, 0] },
    {
      table: {
        headerRows: 1,
        widths: [200, '*', '*', '*', '*'],
        heights: [25, 25, 25, 25, 25],
        body: [
          // Column headers
          [
            { text: 'Expenses', style: 'tableHeader', alignment: 'center', margin: [0, 10, 0, 10] },
            { text: 'May', style: 'tableHeader', alignment: 'center', margin: [0, 10, 0, 10] },
            { text: 'Jun', style: 'tableHeader', alignment: 'center', margin: [0, 10, 0, 10] },
            { text: 'Jul', style: 'tableHeader', alignment: 'center', margin: [0, 10, 0, 10] },
            { text: 'Aug', style: 'tableHeader', alignment: 'center', margin: [0, 10, 0, 10] },
          ],
          // Expense rows
          [
            { text: 'Hotel Cost', alignment: 'center', margin: [0, 10, 0, 10] },
            { text: monthExpenses.May.hotel, alignment: 'center', margin: [0, 10, 0, 10] },
            { text: monthExpenses.Jun.hotel, alignment: 'center', margin: [0, 10, 0, 10] },
            { text: monthExpenses.Jul.hotel, alignment: 'center', margin: [0, 10, 0, 10] },
            { text: monthExpenses.Aug.hotel, alignment: 'center', margin: [0, 10, 0, 10] },
          ],
          [
            { text: 'Air Ticket Cost', alignment: 'center', margin: [0, 10, 0, 10] },
            { text: monthExpenses.May.flight, alignment: 'center', margin: [0, 10, 0, 10] },
            { text: monthExpenses.Jun.flight, alignment: 'center', margin: [0, 10, 0, 10] },
            { text: monthExpenses.Jul.flight, alignment: 'center', margin: [0, 10, 0, 10] },
            { text: monthExpenses.Aug.flight, alignment: 'center', margin: [0, 10, 0, 10] },
          ],
          [
            { text: 'Other Expenses', alignment: 'center', margin: [0, 10, 0, 10] },
            { text: monthExpenses.May.other, alignment: 'center', margin: [0, 10, 0, 10] },
            { text: monthExpenses.Jun.other, alignment: 'center', margin: [0, 10, 0, 10] },
            { text: monthExpenses.Jul.other, alignment: 'center', margin: [0, 10, 0, 10] },
            { text: monthExpenses.Aug.other, alignment: 'center', margin: [0, 10, 0, 10] },
          ],
          // Total Expenses row
          [
            { text: 'Monthly Total', style: 'tableTotal', alignment: 'center', margin: [0, 10, 0, 10]},
            { text: monthExpenses.May.sum, alignment: 'center', margin: [0, 10, 0, 10] },
            { text: monthExpenses.Jun.sum, alignment: 'center', margin: [0, 10, 0, 10] },
            { text: monthExpenses.Jul.sum, alignment: 'center', margin: [0, 10, 0, 10] },
            { text: monthExpenses.Aug.sum, alignment: 'center', margin: [0, 10, 0, 10] },
          ]
        ]
      }
    },
    { text: '\n\n\n\n\n', margin: [0, 20, 0, 0] },
    {
      table: {
        headerRows: 1,
        widths: [200, '*', '*', '*', '*'],
        heights: [25, 25, 25, 25, 25],
        body: [
          // Column headers
          [
            { text: 'Expenses', style: 'tableHeader',  alignment: 'center', margin: [0, 10, 0, 10] },
            { text: 'Sep', style: 'tableHeader', alignment: 'center', margin: [0, 10, 0, 10] },
            { text: 'Oct', style: 'tableHeader',  alignment: 'center', margin: [0, 10, 0, 10] },
            { text: 'Nov', style: 'tableHeader',  alignment: 'center', margin: [0, 10, 0, 10] },
            { text: 'Dec', style: 'tableHeader',  alignment: 'center', margin: [0, 10, 0, 10] }
          ],
          // Expense rows
          [
            { text: 'Hotel Cost', alignment: 'center', margin: [0, 10, 0, 10] },
            { text: monthExpenses.Sep.hotel, alignment: 'center', margin: [0, 10, 0, 10] },
            { text: monthExpenses.Oct.hotel, alignment: 'center', margin: [0, 10, 0, 10] },
            { text: monthExpenses.Nov.hotel, alignment: 'center', margin: [0, 10, 0, 10] },
            { text: monthExpenses.Dec.hotel, alignment: 'center', margin: [0, 10, 0, 10] },
          ],
          [
            { text: 'Air Ticket Cost', alignment: 'center', margin: [0, 10, 0, 10] },
            { text: monthExpenses.Sep.flight, alignment: 'center', margin: [0, 10, 0, 10] },
            { text: monthExpenses.Oct.flight, alignment: 'center', margin: [0, 10, 0, 10] },
            { text: monthExpenses.Nov.flight, alignment: 'center', margin: [0, 10, 0, 10] },
            { text: monthExpenses.Dec.flight, alignment: 'center', margin: [0, 10, 0, 10] },
          ],
          [
            { text: 'Other Expenses', alignment: 'center', margin: [0, 10, 0, 10] },
            { text: monthExpenses.Sep.other, alignment: 'center', margin: [0, 10, 0, 10] },
            { text: monthExpenses.Oct.other, alignment: 'center', margin: [0, 10, 0, 10] },
            { text: monthExpenses.Nov.other, alignment: 'center', margin: [0, 10, 0, 10] },
            { text: monthExpenses.Dec.other, alignment: 'center', margin: [0, 10, 0, 10] },
          ],
          // Total Expenses row
          [
            { text: 'Monthly Expenses', style: 'tableTotal', alignment: 'center', margin: [0, 10, 0, 10]},
            { text: monthExpenses.Sep.sum, alignment: 'center', margin: [0, 10, 0, 10] },
            { text: monthExpenses.Oct.sum, alignment: 'center', margin: [0, 10, 0, 10] },
            { text: monthExpenses.Nov.sum, alignment: 'center', margin: [0, 10, 0, 10] },
            { text: monthExpenses.Dec.sum, alignment: 'center', margin: [0, 10, 0, 10] },
          ]
        ]
      }
    },
    { text: '\n\n\n', margin: [0, 20, 0, 0] },
    {
      table: {
        widths: [200, '*'],
        heights: [25, 25],
        body: [
          [
            { text: 'Total Expenses', style: 'tableTotal', alignment: 'center', margin: [0, 10, 0, 10]},
            { text: sumV, alignment: 'center', margin: [0, 10, 0, 10] },
          ]
        ]
      }
    }
  ],
  styles: {
    header: {
      fontSize: 25,
      bold: true,
      margin: [0, 20, 20, 10] // Adjust the margins as per your requirements
    },
    tableHeader: {
      bold: true,
      fillColor: '#CCCCCC'
    },
    tableTotal: {
      bold: true,
      fillColor: '#EEEEEE'
    }
    }
  };


  var options = {};

  // create invoice and save it to invoices_pdf folder 
  var pdfDoc = printer.createPdfKitDocument(dd, options);
  var filePath = './invoices_pdf/' + data.invoicenumber + '.pdf';
  pdfDoc.pipe(fs.createWriteStream(filePath));
  pdfDoc.end();
  // Open the PDF file in a new window
  open(filePath);
  res.status(200).json({message:"Successfully saved PDF"})
});


app.post("/api/deleteEvent/:eventID", async (req, res) => {
  const eventID = req.params.eventID;
  console.log("Entered into delete");
  try {
    const result = await eventData.deleteOne({ _id: eventID });
    if (result.deletedCount === 0) {
      console.log("Deleted Successfully");
      return res
        .status(404)
        .json({ message: `Entry with eventID ${eventID} not found` });
    }
    return res
      .status(200)
      .json({ message: `Entry with eventID ${eventID} deleted successfully` });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error deleting entry" });
  }
});

app.listen(port, function () {
  console.log("Server Started Successfully");
});
