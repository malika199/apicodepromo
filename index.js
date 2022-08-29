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
        var date_exp = el.data().date_expiration;
        var date_today = new Date().toLocaleDateString("fr-FR");
        if (
          codeUrl == elem.code_unique &&
          elem.isValid == true &&
          date_exp >= date_today
        ) {
          console.log(date_today);
          console.log(date_exp);
          console.log("elem.isValid", elem.isValid);

          codePromo = el.data().code_promo;
        } else {
          console.log("code invalide ");
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
  // code qu'on passe
  let obj = [];
  let elSearch;
  let affect;
  let ee

  const snapshot = await Code.get().then((e) => {
    // console.log("e", e.docs);

    return e.docs.forEach((el) => {
      console.log("ellllllllllllllllllllll", el.id);
      // parcourir tout les documents
      let doc = el.data().list_codes.map((elem) => {
        // parcourir les items d'un document
        console.log("elem", elem);
        if (codeUnique == elem.code_unique) {
          elSearch = el.id;
          // ee = el.data().list_codes
          elem.isValid = false;
        }
        return elem
        if (el.id == elSearch) {
          obj = [...obj, elem];
          console.log("obj", obj);
        }
      });
      console.log("=====> doc",doc)
       affect = Code.doc(el.id).update({ list_codes: doc });

      return affect;
    });
  });
  // console.log(obj);

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

// usersRef.whereArrayContains("friends", john).get().addOnCompleteListener{ johnTask ->
//   johnTask.apply {
//       if (johnTask.isSuccessful) {
//           for (document in result) {
//               val docIdRef = usersRef.document(document.id)
//               val userFriends = document.toObject(User::class.java).friends
//               userFriends?.let {
//                   userFriends.remove(john)
//                   userFriends.add(Friend("John", 21))
//                   docIdRef.set(mutableMapOf("friends" to userFriends), SetOptions.merge()).addOnCompleteListener{ setTask ->
//                       if (setTask.isSuccessful) {
//                           Log.d(TAG, "Update complete.")
//                       } else {
//                           setTask.exception?.message?.let {
//                               Log.e(TAG, it)
//                           }
//                       }
//                   }
//               }
//           }
//       } else {
//           johnTask.exception?.message?.let {
//               Log.e(TAG, it)
//           }
//       }
//   }
// }
