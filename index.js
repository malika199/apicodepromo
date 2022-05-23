const express = require('express');
const cors = require("cors");
const Code = require("./config");
const bodyParser = require('body-parser');
const app = express();
app.use(express.json())
app.use(cors());


app.get('/', (req,res) => {
  res.send('Welcome to Daily Code Buffer in Heroku Auto Deployment!!');
})


// app.use(bodyParser);
app.post("/create", async (req, res) => {
  const data = req.body;
  let list_codes = [];
  for (let index = 0; index < 5; index++) {
    list_codes = [...list_codes,{ 'code_unique' :generateCodeUinque(), maxDate : new Date().getTime(), isValid : true }]  
  }
  console.log('list_codes',list_codes)
  await Code.add({ ...data,list_codes});
  res.send({ msg: "codes Added" });
});



 app.get("/getcodes", async (req, res) => {
    const snapshot = await Code.get();
    const list = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    res.send(list);
});
app.post(`/getbycode` , async (req, res) => {
  let codeUrl = req.body.codeUrl;
   console.log(codeUrl)
  const snapshot = await Code
  .get();

 if (snapshot.empty) {
    console.log('No matching documents.');
  }  

   const list_code = snapshot.docs.map((doc)=> ({
    list_codes : doc.data().list_codes.forEach(code => {
      code_unique =  code.code_unique 
        console.log('heeeeeeeeeeeeey',code_unique)   
        if(code_unique == codeUrl){
            
          res.send(doc.data().code_promo)

        }else{
           console.log(' votre code n\'existe pas');
        }
        

    }),

   }))

});




function generateRandomLetter() {const alphabet = "abcdefghijklmnopqrstuvwxyz"
return alphabet[Math.floor(Math.random() * alphabet.length)]}


const generateCodeUinque = () => {
  var d = new Date().getTime();
  var uuid = 'yyyxxxx-xxxx'.replace(/[xy]/g, function (c) {
      var r = (d + Math.random() * 16) % 16 | 0;
      d = Math.floor(d / 16);
      return (c == 'x' ? r : generateRandomLetter())
  });
  return uuid;
};






app.listen(process.env.PORT || 5000, (err) => {
      if (err) {
        console.log(`Errors: ${err}`);
        process.exit(-1);
      }
      console.log(`app is runnning on port ${process.env.PORT}`);
    });
  
  //   function generate_random_string(string_length){
  //     let random_string = '';
  //     let random_ascii;
  //     for(let i = 0; i < string_length; i++) {
  //         random_ascii = Math.floor((Math.random() * 25) + 97);
  //         random_string += String.fromCharCode(random_ascii)
  //     }
  //     return random_string
  // }
  
  // console.log(generate_random_string(1))
  