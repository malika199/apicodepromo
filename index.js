const express = require("express");
const cors = require("cors");
const Code = require("./config");
const bodyParser = require("body-parser");
require("dotenv").config();

const app = express();
app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  res.send("Welcome to Daily Code Buffer in Heroku Auto Deployment!!");
});

// app.use(bodyParser);
app.post("/create", async (req, res) => {
  const data = req.body;
  let list_codes = [];
  for (let index = 0; index < 5; index++) {
    list_codes = [
      ...list_codes,
      {
        code_unique: generateCodeUinque(),
        maxDate: new Date().toLocaleDateString("fr-FR"),
        isValid: true,
      },
    ];
  }
  console.log("list_codes", list_codes);
  await Code.add({ ...data, list_codes });
  res.send({ msg: "codes Added" });
});

app.get("/getcodes", async (req, res) => {
  const snapshot = await Code.get();
  const list = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  res.send(list);
});
app.post(`/getbycode`, async (req, res) => {
  let codeUrl = req.body.codeUrl;
  let codePromo = "";
  const snapshot = await Code.get().then((e) =>
    e.docs.forEach((el) => {
      el.data().list_codes.forEach((elem) => {
        if (codeUrl == elem.code_unique && elem.isValid == true && el.date_expiration >= new Date().toLocaleDateString("fr-FR")) {
          codePromo = el.data().code_promo;
        } else{
          console.log('code invalide ')
        }
      });
      console.log("codePromo", codePromo);
    })
  );
  if (res.status(200)) {
    return res.json({ codePromo });
  } else {
    console.log(" votre code ne correspent à aucun code promo");
  }
});

app.post("/disable", async (req, res) => {
  const codeUnique = req.body.codeUnique;
  let obj = [];
  const snapshot = await Code.get().then((e) => {
    console.log("e", e.docs);

    return e.docs.forEach((el) => {
     
      el.data().list_codes.filter((elem) => {
        console.log("elem", elem);
        if (codeUnique == elem.code_unique) {
          elem.isValid = false;  
        }
        obj = [...obj, elem];
        return obj;
      });
      return Code.doc(el.id).update({ list_codes: obj });  

    });
  });

  console.log(obj);

  res.send({ msg: "code modifié" });
});

function generateRandomLetter() {
  const alphabet = "abcdefghijklmnopqrstuvwxyz";
  return alphabet[Math.floor(Math.random() * alphabet.length)];
}

const generateCodeUinque = () => {
  var d = new Date().getTime();
  var uuid = "yyyxxxx-xxxx".replace(/[xy]/g, function (c) {
    var r = (d + Math.random() * 16) % 16 | 0;
    d = Math.floor(d / 16);
    return c == "x" ? r : generateRandomLetter();
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
