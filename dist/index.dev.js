"use strict";

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

var express = require("express");

var cors = require("cors");

var Code = require("./config");

var bodyParser = require("body-parser");

require("dotenv").config();

var app = express();
app.use(express.json());
app.use(cors());
app.get("/", function (req, res) {
  res.send("Welcome to Daily Code Buffer in Heroku Auto Deployment!!");
}); // app.use(bodyParser);

app.post("/create", function _callee(req, res) {
  var data, list_codes, index;
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          data = req.body;
          list_codes = [];

          for (index = 0; index < 10; index++) {
            list_codes = [].concat(_toConsumableArray(list_codes), [{
              code_unique: generateCodeUinque(),
              maxDate: new Date().toLocaleDateString("fr-FR"),
              isValid: true
            }]);
          }

          console.log("list_codes", list_codes);
          _context.next = 6;
          return regeneratorRuntime.awrap(Code.add(_objectSpread({}, data, {
            list_codes: list_codes
          })));

        case 6:
          res.send({
            msg: "codes Added"
          });

        case 7:
        case "end":
          return _context.stop();
      }
    }
  });
});
app.get("/getcodes", function _callee2(req, res) {
  var snapshot, list;
  return regeneratorRuntime.async(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.next = 2;
          return regeneratorRuntime.awrap(Code.get());

        case 2:
          snapshot = _context2.sent;
          list = snapshot.docs.map(function (doc) {
            return _objectSpread({
              id: doc.id
            }, doc.data());
          });
          res.send(list);

        case 5:
        case "end":
          return _context2.stop();
      }
    }
  });
});

function momentTest(uneDate) {
  var elem = uneDate.split('/');
  jour = elem[0];
  mois = elem[1];
  annee = elem[2];
  var elemMAJ = "".concat(annee, "/").concat(mois, "/").concat(jour, " ");
  return elemMAJ;
}

app.post("/getbycode", function _callee3(req, res) {
  var codeUrl, codePromo, isValid, snapshot;
  return regeneratorRuntime.async(function _callee3$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          codeUrl = req.body.codeUrl;
          codePromo = "";
          isValid = false;
          _context3.next = 5;
          return regeneratorRuntime.awrap(Code.get().then(function (e) {
            return e.docs.forEach(function (el) {
              el.data().list_codes.forEach(function (elem) {
                // var date_exp = new Date(el.data().date_expiration).getTime();
                var exp = momentTest(el.data().date_expiration);
                var date_exp = new Date(exp).getTime();
                var date_today = new Date().getTime("en-US");

                if (codeUrl == elem.code_unique && elem.isValid == true && date_exp >= date_today) {
                  console.log('date_today', date_today);
                  console.log('date_exp', date_exp);
                  console.log('exp', exp);
                  console.log("elem.isValid", elem.isValid);
                  codePromo = el.data().code_promo;
                } else {
                  console.log("code invalide ");
                }
              });
              console.log("codePromo", codePromo);
            });
          }));

        case 5:
          snapshot = _context3.sent;

          if (!res.status(200)) {
            _context3.next = 11;
            break;
          }

          isValid = true;
          return _context3.abrupt("return", res.json({
            codePromo: codePromo
          }));

        case 11:
          return _context3.abrupt("return", res.json({
            isValid: isValid
          }));

        case 12:
        case "end":
          return _context3.stop();
      }
    }
  });
});
app.post("/disable", function _callee4(req, res) {
  var codeUnique, obj, elSearch, affect, ee, snapshot;
  return regeneratorRuntime.async(function _callee4$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          codeUnique = req.body.codeUnique; // code qu'on passe

          obj = [];
          _context4.next = 4;
          return regeneratorRuntime.awrap(Code.get().then(function (e) {
            // console.log("e", e.docs);
            return e.docs.forEach(function (el) {
              console.log("ellllllllllllllllllllll", el.id); // parcourir tout les documents

              var doc = el.data().list_codes.map(function (elem) {
                // parcourir les items d'un document
                console.log("elem", elem);

                if (codeUnique == elem.code_unique) {
                  elSearch = el.id; // ee = el.data().list_codes

                  elem.isValid = false;
                }

                return elem;

                if (el.id == elSearch) {
                  obj = [].concat(_toConsumableArray(obj), [elem]);
                  console.log("obj", obj);
                }
              });
              console.log("=====> doc", doc);
              affect = Code.doc(el.id).update({
                list_codes: doc
              });
              return affect;
            });
          }));

        case 4:
          snapshot = _context4.sent;
          // console.log(obj);
          res.send({
            msg: "code modifié"
          });

        case 6:
        case "end":
          return _context4.stop();
      }
    }
  });
});

function generateRandomLetter() {
  var alphabet = "abcdefghijklmnopqrstuvwxyz";
  return alphabet[Math.floor(Math.random() * alphabet.length)];
}

var generateCodeUinque = function generateCodeUinque() {
  var d = new Date().getTime();
  var uuid = "yyyxxxx-xxxx".replace(/[xy]/g, function (c) {
    var r = (d + Math.random() * 16) % 16 | 0;
    d = Math.floor(d / 16);
    return c == "x" ? r : generateRandomLetter();
  });
  return uuid;
};

app.listen(process.env.PORT || 5000, function (err) {
  if (err) {
    console.log("Errors: ".concat(err));
    process.exit(-1);
  }

  console.log("app is runnning on port ".concat(process.env.PORT));
}); // usersRef.whereArrayContains("friends", john).get().addOnCompleteListener{ johnTask ->
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