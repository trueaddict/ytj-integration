"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _axios = _interopRequireDefault(require("axios"));

var _csvWriter = require("csv-writer");

var _fs = _interopRequireDefault(require("fs"));

var _mongodb = require("mongodb");

var createCsvWriter = _csvWriter.createObjectCsvWriter;
var uri = process.env.MONGO_URI;
var client = new _mongodb.MongoClient(String(uri));

var searchYtj = /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(params) {
    var options;
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            options = {
              host: 'https://avoindata.prh.fi',
              header: {
                'Accept': 'application/json'
              },
              path: "/bis/v1?totalResults=false&maxResults=1000&resultsFrom=0&registeredOffice=" + encodeURIComponent(params.registeredOffice) + "&streetAddressPostCode=".concat(params.streetAddressPostCode, "&businessLineCode=").concat(params.businessLineCode, "&companyRegistrationFrom=2014-02-28")
            };
            return _context.abrupt("return", _axios["default"].get(options.host + options.path, {
              headers: options.header
            }).then(function (res) {
              return res.data.results;
            })["catch"](function (error) {
              console.log(error);
            }));

          case 2:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));

  return function searchYtj(_x) {
    return _ref.apply(this, arguments);
  };
}();

var getCompanyDetails = /*#__PURE__*/function () {
  var _ref2 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2(company) {
    var options;
    return _regenerator["default"].wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            options = {
              host: 'https://avoindata.prh.fi',
              header: {
                'Accept': 'application/json'
              },
              path: '/bis/v1/' + company.businessId
            };
            return _context2.abrupt("return", _axios["default"].get(options.host + options.path, {
              headers: options.header
            }).then(function (res) {
              return res.data.results[0];
            })["catch"](function (error) {
              console.log(error);
            }));

          case 2:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2);
  }));

  return function getCompanyDetails(_x2) {
    return _ref2.apply(this, arguments);
  };
}();

var writeCompaniesToCsv = function writeCompaniesToCsv(companies) {
  var csvWriter = createCsvWriter({
    path: 'out.csv',
    header: [{
      id: 'businessId',
      title: 'businessId'
    }, {
      id: 'name',
      title: 'name'
    }]
  });
  csvWriter.writeRecords(companies).then(function () {
    return console.log('CSV created succesfully');
  });
};

var writeCompaniesToJson = function writeCompaniesToJson(companies) {
  var data = JSON.stringify(companies, null, 2);

  _fs["default"].writeFileSync('companies.json', data);
};

var writeCompaniesToMongoDb = /*#__PURE__*/function () {
  var _ref3 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee3(companies) {
    var db, companiesCollection, result;
    return _regenerator["default"].wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            _context3.prev = 0;
            _context3.next = 3;
            return client.connect();

          case 3:
            db = client.db('dev');
            companiesCollection = db.collection('companies');
            _context3.next = 7;
            return companiesCollection.insertMany(companies);

          case 7:
            result = _context3.sent;
            console.log(result);

          case 9:
            _context3.prev = 9;
            _context3.next = 12;
            return client.close();

          case 12:
            return _context3.finish(9);

          case 13:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3, null, [[0,, 9, 13]]);
  }));

  return function writeCompaniesToMongoDb(_x3) {
    return _ref3.apply(this, arguments);
  };
}();

var main = /*#__PURE__*/function () {
  var _ref4 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee4() {
    var results, _i, _arr, city, params;

    return _regenerator["default"].wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            results = [];
            _i = 0, _arr = ['jyväskylä', 'laukaa', 'petäjävesi', 'jämsä'];

          case 2:
            if (!(_i < _arr.length)) {
              _context4.next = 11;
              break;
            }

            city = _arr[_i];
            params = {
              businessLineCode: 49410,
              businessLine: '',
              streetAddressPostCode: '',
              registeredOffice: city
            };
            _context4.next = 7;
            return searchYtj(params);

          case 7:
            _context4.sent.map(function (comp) {
              results.push(comp);
            });

          case 8:
            _i++;
            _context4.next = 2;
            break;

          case 11:
            console.log('results', results);
            /*let companyDetails = [];
            for (let company of results) {
              let details = await getCompanyDetails(company);
              companyDetails.push(details);
            }*/
            //writeCompaniesToCsv(results);

            writeCompaniesToJson(results);
            _context4.next = 15;
            return writeCompaniesToMongoDb(results);

          case 15:
          case "end":
            return _context4.stop();
        }
      }
    }, _callee4);
  }));

  return function main() {
    return _ref4.apply(this, arguments);
  };
}();

main();
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9pbmRleC50cyJdLCJuYW1lcyI6WyJjcmVhdGVDc3ZXcml0ZXIiLCJjcmVhdGVPYmplY3RDc3ZXcml0ZXIiLCJ1cmkiLCJwcm9jZXNzIiwiZW52IiwiTU9OR09fVVJJIiwiY2xpZW50IiwiTW9uZ29DbGllbnQiLCJTdHJpbmciLCJzZWFyY2hZdGoiLCJwYXJhbXMiLCJvcHRpb25zIiwiaG9zdCIsImhlYWRlciIsInBhdGgiLCJlbmNvZGVVUklDb21wb25lbnQiLCJyZWdpc3RlcmVkT2ZmaWNlIiwic3RyZWV0QWRkcmVzc1Bvc3RDb2RlIiwiYnVzaW5lc3NMaW5lQ29kZSIsImF4aW9zIiwiZ2V0IiwiaGVhZGVycyIsInRoZW4iLCJyZXMiLCJkYXRhIiwicmVzdWx0cyIsImVycm9yIiwiY29uc29sZSIsImxvZyIsImdldENvbXBhbnlEZXRhaWxzIiwiY29tcGFueSIsImJ1c2luZXNzSWQiLCJ3cml0ZUNvbXBhbmllc1RvQ3N2IiwiY29tcGFuaWVzIiwiY3N2V3JpdGVyIiwiaWQiLCJ0aXRsZSIsIndyaXRlUmVjb3JkcyIsIndyaXRlQ29tcGFuaWVzVG9Kc29uIiwiSlNPTiIsInN0cmluZ2lmeSIsImZzIiwid3JpdGVGaWxlU3luYyIsIndyaXRlQ29tcGFuaWVzVG9Nb25nb0RiIiwiY29ubmVjdCIsImRiIiwiY29tcGFuaWVzQ29sbGVjdGlvbiIsImNvbGxlY3Rpb24iLCJpbnNlcnRNYW55IiwicmVzdWx0IiwiY2xvc2UiLCJtYWluIiwiY2l0eSIsImJ1c2luZXNzTGluZSIsIm1hcCIsImNvbXAiLCJwdXNoIl0sIm1hcHBpbmdzIjoiOzs7Ozs7OztBQUFBOztBQUNBOztBQUNBOztBQUNBOztBQUVBLElBQU1BLGVBQWUsR0FBR0MsZ0NBQXhCO0FBRUEsSUFBTUMsR0FBRyxHQUFHQyxPQUFPLENBQUNDLEdBQVIsQ0FBWUMsU0FBeEI7QUFDQSxJQUFNQyxNQUFNLEdBQUcsSUFBSUMsb0JBQUosQ0FBZ0JDLE1BQU0sQ0FBQ04sR0FBRCxDQUF0QixDQUFm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QUFTLENBQUNDLE1BQUQsQ0FMUDs7QUFBQTtBQUFBLDJCQUtpQjRDLEdBTGpCLENBS3FCLFVBQUNDLElBQUQsRUFBVTtBQUN0QzlCLGNBQUFBLE9BQU8sQ0FBQytCLElBQVIsQ0FBYUQsSUFBYjtBQUNELGFBUFE7O0FBQUE7QUFBQTtBQUFBO0FBQUE7O0FBQUE7QUFTWDVCLFlBQUFBLE9BQU8sQ0FBQ0MsR0FBUixDQUFZLFNBQVosRUFBdUJILE9BQXZCO0FBRUE7QUFDRjtBQUNBO0FBQ0E7QUFDQTtBQUNFOztBQUNBYSxZQUFBQSxvQkFBb0IsQ0FBQ2IsT0FBRCxDQUFwQjtBQWpCVztBQUFBLG1CQWtCTGtCLHVCQUF1QixDQUFDbEIsT0FBRCxDQWxCbEI7O0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsR0FBSDs7QUFBQSxrQkFBSjBCLElBQUk7QUFBQTtBQUFBO0FBQUEsR0FBVjs7QUFvQkFBLElBQUkiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgYXhpb3MgZnJvbSAnYXhpb3MnO1xuaW1wb3J0IHtjcmVhdGVPYmplY3RDc3ZXcml0ZXJ9IGZyb20gJ2Nzdi13cml0ZXInO1xuaW1wb3J0IGZzIGZyb20gJ2ZzJztcbmltcG9ydCB7IE1vbmdvQ2xpZW50LCBPYmplY3RJZCB9IGZyb20gJ21vbmdvZGInO1xuXG5jb25zdCBjcmVhdGVDc3ZXcml0ZXIgPSBjcmVhdGVPYmplY3RDc3ZXcml0ZXI7XG5cbmNvbnN0IHVyaSA9IHByb2Nlc3MuZW52Lk1PTkdPX1VSSTtcbmNvbnN0IGNsaWVudCA9IG5ldyBNb25nb0NsaWVudChTdHJpbmcodXJpKSk7XG5cbmludGVyZmFjZSBTZWFyY2hQYXJhbXMge1xuICByZWdpc3RlcmVkT2ZmaWNlOiBzdHJpbmc7XG4gIHN0cmVldEFkZHJlc3NQb3N0Q29kZTogc3RyaW5nO1xuICBidXNpbmVzc0xpbmU6IHN0cmluZztcbiAgYnVzaW5lc3NMaW5lQ29kZTogbnVtYmVyO1xufVxuXG5pbnRlcmZhY2UgQ29tcGFueSB7XG4gIGlkOiBPYmplY3RJZDtcbiAgYnVzaW5lc3NJZDoge3R5cGU6IHN0cmluZywgdW5pcXVlIDogdHJ1ZX07XG4gIG5hbWU6IHN0cmluZztcbiAgcmVnaXN0cmF0aW9uRGF0ZTogc3RyaW5nO1xuICBjb21wYW55Rm9ybTogc3RyaW5nO1xuICBkZXRhaWxzVXJpOiBzdHJpbmc7XG4gIG5hbWVzPzogb2JqZWN0W107XG4gIGF1eGlsaWFyeU5hbWVzPzogb2JqZWN0W107XG4gIGFkZHJlc3Nlcz86IG9iamVjdFtdO1xuICBjb21wYW55Rm9ybXM/OiBvYmplY3RbXTtcbiAgYnVzaW5lc3NMaW5lcz86IG9iamVjdFtdO1xuICBsYW5ndWFnZXM/OiBvYmplY3RbXTtcbiAgcmVnaXN0ZWRPZmZpY2VzPzogb2JqZWN0W107XG4gIGNvbnRhY3REZXRhaWxzPzogQ29udGFjdFtdO1xufVxuXG5pbnRlcmZhY2UgQ29udGFjdCB7XG4gIHZlcnNpb246IHN0cmluZztcbiAgdmFsdWU6IHN0cmluZztcbiAgdHlwZTogc3RyaW5nO1xuICByZWdpc3RyYXRpb25EYXRlOiBzdHJpbmc7XG4gIGVuZERhdGU6IHN0cmluZztcbiAgbGFuZ3VhZ2U6IHN0cmluZztcbiAgc291cmNlOiBudW1iZXI7XG59XG5cbmNvbnN0IHNlYXJjaFl0aiA9IGFzeW5jIChwYXJhbXM6IFNlYXJjaFBhcmFtcykgOiBQcm9taXNlPENvbXBhbnlbXT4gPT4ge1xuICBsZXQgb3B0aW9ucyA9IHtcbiAgICBob3N0OiAnaHR0cHM6Ly9hdm9pbmRhdGEucHJoLmZpJyxcbiAgICBoZWFkZXI6IHsnQWNjZXB0JzonYXBwbGljYXRpb24vanNvbid9LFxuICAgIHBhdGg6IGAvYmlzL3YxP3RvdGFsUmVzdWx0cz1mYWxzZSZtYXhSZXN1bHRzPTEwMDAmcmVzdWx0c0Zyb209MCZyZWdpc3RlcmVkT2ZmaWNlPWArIGVuY29kZVVSSUNvbXBvbmVudChwYXJhbXMucmVnaXN0ZXJlZE9mZmljZSkgK2Amc3RyZWV0QWRkcmVzc1Bvc3RDb2RlPSR7cGFyYW1zLnN0cmVldEFkZHJlc3NQb3N0Q29kZX0mYnVzaW5lc3NMaW5lQ29kZT0ke3BhcmFtcy5idXNpbmVzc0xpbmVDb2RlfSZjb21wYW55UmVnaXN0cmF0aW9uRnJvbT0yMDE0LTAyLTI4YCxcbiAgfVxuXG4gIHJldHVybiBheGlvcy5nZXQob3B0aW9ucy5ob3N0ICsgb3B0aW9ucy5wYXRoLCB7aGVhZGVyczpvcHRpb25zLmhlYWRlcn0pXG4gIC50aGVuKChyZXMpID0+IHJlcy5kYXRhLnJlc3VsdHMpXG4gIC5jYXRjaCgoZXJyb3IpID0+IHtcbiAgICBjb25zb2xlLmxvZyhlcnJvcik7XG4gIH0pXG59XG5cbmNvbnN0IGdldENvbXBhbnlEZXRhaWxzID0gYXN5bmMgKGNvbXBhbnk6IENvbXBhbnkpIDogUHJvbWlzZTxDb21wYW55PiA9PiB7XG4gIGxldCBvcHRpb25zID0ge1xuICAgIGhvc3Q6ICdodHRwczovL2F2b2luZGF0YS5wcmguZmknLFxuICAgIGhlYWRlcjogeydBY2NlcHQnOiAnYXBwbGljYXRpb24vanNvbid9LFxuICAgIHBhdGg6ICcvYmlzL3YxLycrY29tcGFueS5idXNpbmVzc0lkXG4gIH1cbiAgcmV0dXJuIGF4aW9zLmdldChvcHRpb25zLmhvc3QgKyBvcHRpb25zLnBhdGgsIHtoZWFkZXJzOm9wdGlvbnMuaGVhZGVyfSlcbiAgLnRoZW4oKHJlcykgPT4gcmVzLmRhdGEucmVzdWx0c1swXSlcbiAgLmNhdGNoKChlcnJvcikgPT4ge1xuICAgIGNvbnNvbGUubG9nKGVycm9yKTtcbiAgfSlcbn1cblxuY29uc3Qgd3JpdGVDb21wYW5pZXNUb0NzdiA9IChjb21wYW5pZXM6IENvbXBhbnlbXSkgPT4ge1xuICBjb25zdCBjc3ZXcml0ZXIgPSBjcmVhdGVDc3ZXcml0ZXIoe1xuICAgIHBhdGg6ICdvdXQuY3N2JyxcbiAgICBoZWFkZXI6IFtcbiAgICAgIHtpZDonYnVzaW5lc3NJZCcsIHRpdGxlOididXNpbmVzc0lkJ30sXG4gICAgICB7aWQ6J25hbWUnLCB0aXRsZTonbmFtZSd9XG4gICAgXVxuICB9KTtcbiAgY3N2V3JpdGVyXG4gIC53cml0ZVJlY29yZHMoY29tcGFuaWVzKVxuICAudGhlbigoKSA9PiBjb25zb2xlLmxvZygnQ1NWIGNyZWF0ZWQgc3VjY2VzZnVsbHknKSk7XG59XG5cbmNvbnN0IHdyaXRlQ29tcGFuaWVzVG9Kc29uID0gKGNvbXBhbmllczogQ29tcGFueVtdKSA9PiB7XG4gIGxldCBkYXRhID0gSlNPTi5zdHJpbmdpZnkoY29tcGFuaWVzLCBudWxsLCAyKTtcbiAgZnMud3JpdGVGaWxlU3luYygnY29tcGFuaWVzLmpzb24nLCBkYXRhKTtcblxufVxuXG5jb25zdCB3cml0ZUNvbXBhbmllc1RvTW9uZ29EYiA9IGFzeW5jIChjb21wYW5pZXM6IENvbXBhbnlbXSkgPT4ge1xuICB0cnkge1xuICAgIGF3YWl0IGNsaWVudC5jb25uZWN0KCk7XG4gICAgY29uc3QgZGIgPSBjbGllbnQuZGIoJ2RldicpO1xuICAgIGNvbnN0IGNvbXBhbmllc0NvbGxlY3Rpb24gPSBkYi5jb2xsZWN0aW9uPENvbXBhbnk+KCdjb21wYW5pZXMnKTtcblxuICAgIGNvbnN0IHJlc3VsdCA9IGF3YWl0IGNvbXBhbmllc0NvbGxlY3Rpb24uaW5zZXJ0TWFueShjb21wYW5pZXMpO1xuICAgIGNvbnNvbGUubG9nKHJlc3VsdCk7XG4gIH0gZmluYWxseSB7XG4gICAgYXdhaXQgY2xpZW50LmNsb3NlKCk7XG4gIH1cbn1cblxuY29uc3QgbWFpbiA9IGFzeW5jICgpID0+IHtcbiAgY29uc3QgcmVzdWx0cyA6IENvbXBhbnlbXSA9IFtdO1xuXG4gIGZvciAobGV0IGNpdHkgb2YgWydqeXbDpHNreWzDpCcsICdsYXVrYWEnLCAncGV0w6Rqw6R2ZXNpJywgJ2rDpG1zw6QnXSkge1xuICAgIGxldCBwYXJhbXMgPSB7YnVzaW5lc3NMaW5lQ29kZTogNDk0MTAsIGJ1c2luZXNzTGluZTogJycsIHN0cmVldEFkZHJlc3NQb3N0Q29kZTogJycsIHJlZ2lzdGVyZWRPZmZpY2U6IGNpdHl9O1xuICAgIChhd2FpdCBzZWFyY2hZdGoocGFyYW1zKSkubWFwKChjb21wKSA9PiB7XG4gICAgICByZXN1bHRzLnB1c2goY29tcCk7XG4gICAgfSk7XG4gIH1cbiAgY29uc29sZS5sb2coJ3Jlc3VsdHMnLCByZXN1bHRzKTtcblxuICAvKmxldCBjb21wYW55RGV0YWlscyA9IFtdO1xuICBmb3IgKGxldCBjb21wYW55IG9mIHJlc3VsdHMpIHtcbiAgICBsZXQgZGV0YWlscyA9IGF3YWl0IGdldENvbXBhbnlEZXRhaWxzKGNvbXBhbnkpO1xuICAgIGNvbXBhbnlEZXRhaWxzLnB1c2goZGV0YWlscyk7XG4gIH0qL1xuICAvL3dyaXRlQ29tcGFuaWVzVG9Dc3YocmVzdWx0cyk7XG4gIHdyaXRlQ29tcGFuaWVzVG9Kc29uKHJlc3VsdHMpO1xuICBhd2FpdCB3cml0ZUNvbXBhbmllc1RvTW9uZ29EYihyZXN1bHRzKTtcbn1cbm1haW4oKTtcbiJdfQ==