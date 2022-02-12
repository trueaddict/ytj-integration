"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _axios = _interopRequireDefault(require("axios"));

var _csvWriter = require("csv-writer");

var _fs = _interopRequireDefault(require("fs"));

var createCsvWriter = _csvWriter.createObjectCsvWriter;

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

var main = /*#__PURE__*/function () {
  var _ref3 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee3() {
    var results, _i, _arr, city, params;

    return _regenerator["default"].wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            results = [];
            _i = 0, _arr = ['jyväskylä', 'laukaa', 'petäjävesi', 'jämsä'];

          case 2:
            if (!(_i < _arr.length)) {
              _context3.next = 11;
              break;
            }

            city = _arr[_i];
            params = {
              businessLineCode: 49410,
              businessLine: '',
              streetAddressPostCode: '',
              registeredOffice: city
            };
            _context3.next = 7;
            return searchYtj(params);

          case 7:
            _context3.sent.map(function (comp) {
              results.push(comp);
            });

          case 8:
            _i++;
            _context3.next = 2;
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

          case 13:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3);
  }));

  return function main() {
    return _ref3.apply(this, arguments);
  };
}();

main();
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9pbmRleC50cyJdLCJuYW1lcyI6WyJjcmVhdGVDc3ZXcml0ZXIiLCJjcmVhdGVPYmplY3RDc3ZXcml0ZXIiLCJzZWFyY2hZdGoiLCJwYXJhbXMiLCJvcHRpb25zIiwiaG9zdCIsImhlYWRlciIsInBhdGgiLCJlbmNvZGVVUklDb21wb25lbnQiLCJyZWdpc3RlcmVkT2ZmaWNlIiwic3RyZWV0QWRkcmVzc1Bvc3RDb2RlIiwiYnVzaW5lc3NMaW5lQ29kZSIsImF4aW9zIiwiZ2V0IiwiaGVhZGVycyIsInRoZW4iLCJyZXMiLCJkYXRhIiwicmVzdWx0cyIsImVycm9yIiwiY29uc29sZSIsImxvZyIsImdldENvbXBhbnlEZXRhaWxzIiwiY29tcGFueSIsImJ1c2luZXNzSWQiLCJ3cml0ZUNvbXBhbmllc1RvQ3N2IiwiY29tcGFuaWVzIiwiY3N2V3JpdGVyIiwiaWQiLCJ0aXRsZSIsIndyaXRlUmVjb3JkcyIsIndyaXRlQ29tcGFuaWVzVG9Kc29uIiwiSlNPTiIsInN0cmluZ2lmeSIsImZzIiwid3JpdGVGaWxlU3luYyIsIm1haW4iLCJjaXR5IiwiYnVzaW5lc3NMaW5lIiwibWFwIiwiY29tcCIsInB1c2giXSwibWFwcGluZ3MiOiI7Ozs7Ozs7O0FBQUE7O0FBQ0E7O0FBQ0E7O0FBRUEsSUFBTUEsZUFBZSxHQUFHQyxnQ0FBeEI7O0FBbUNBLElBQU1DLFNBQVM7QUFBQSwyRkFBRyxpQkFBT0MsTUFBUDtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFDWkMsWUFBQUEsT0FEWSxHQUNGO0FBQ1pDLGNBQUFBLElBQUksRUFBRSwwQkFETTtBQUVaQyxjQUFBQSxNQUFNLEVBQUU7QUFBQywwQkFBUztBQUFWLGVBRkk7QUFHWkMsY0FBQUEsSUFBSSxFQUFFLCtFQUE4RUMsa0JBQWtCLENBQUNMLE1BQU0sQ0FBQ00sZ0JBQVIsQ0FBaEcsb0NBQXFKTixNQUFNLENBQUNPLHFCQUE1SiwrQkFBc01QLE1BQU0sQ0FBQ1EsZ0JBQTdNO0FBSE0sYUFERTtBQUFBLDZD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LEVBQXhDO0FBQTRDNUIsY0FBQUEscUJBQXFCLEVBQUUsRUFBbkU7QUFBdUVELGNBQUFBLGdCQUFnQixFQUFFNEI7QUFBekYsYUFKSjtBQUFBO0FBQUEsbUJBS0ZuQyxTQUFTLENBQUNDLE1BQUQsQ0FMUDs7QUFBQTtBQUFBLDJCQUtpQm9DLEdBTGpCLENBS3FCLFVBQUNDLElBQUQsRUFBVTtBQUN0Q3RCLGNBQUFBLE9BQU8sQ0FBQ3VCLElBQVIsQ0FBYUQsSUFBYjtBQUNELGFBUFE7O0FBQUE7QUFBQTtBQUFBO0FBQUE7O0FBQUE7QUFTWHBCLFlBQUFBLE9BQU8sQ0FBQ0MsR0FBUixDQUFZLFNBQVosRUFBdUJILE9BQXZCO0FBRUE7QUFDRjtBQUNBO0FBQ0E7QUFDQTtBQUNFOztBQUNBYSxZQUFBQSxvQkFBb0IsQ0FBQ2IsT0FBRCxDQUFwQjs7QUFqQlc7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsR0FBSDs7QUFBQSxrQkFBSmtCLElBQUk7QUFBQTtBQUFBO0FBQUEsR0FBVjs7QUFtQkFBLElBQUkiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgYXhpb3MgZnJvbSAnYXhpb3MnO1xuaW1wb3J0IHtjcmVhdGVPYmplY3RDc3ZXcml0ZXJ9IGZyb20gJ2Nzdi13cml0ZXInO1xuaW1wb3J0IGZzIGZyb20gJ2ZzJztcblxuY29uc3QgY3JlYXRlQ3N2V3JpdGVyID0gY3JlYXRlT2JqZWN0Q3N2V3JpdGVyO1xuXG5pbnRlcmZhY2UgU2VhcmNoUGFyYW1zIHtcbiAgcmVnaXN0ZXJlZE9mZmljZTogc3RyaW5nO1xuICBzdHJlZXRBZGRyZXNzUG9zdENvZGU6IHN0cmluZztcbiAgYnVzaW5lc3NMaW5lOiBzdHJpbmc7XG4gIGJ1c2luZXNzTGluZUNvZGU6IG51bWJlcjtcbn1cblxuaW50ZXJmYWNlIENvbXBhbnkge1xuICBidXNpbmVzc0lkOiBzdHJpbmc7XG4gIG5hbWU6IHN0cmluZztcbiAgcmVnaXN0cmF0aW9uRGF0ZTogc3RyaW5nO1xuICBjb21wYW55Rm9ybTogc3RyaW5nO1xuICBkZXRhaWxzVXJpOiBzdHJpbmc7XG4gIG5hbWVzPzogb2JqZWN0W107XG4gIGF1eGlsaWFyeU5hbWVzPzogb2JqZWN0W107XG4gIGFkZHJlc3Nlcz86IG9iamVjdFtdO1xuICBjb21wYW55Rm9ybXM/OiBvYmplY3RbXTtcbiAgYnVzaW5lc3NMaW5lcz86IG9iamVjdFtdO1xuICBsYW5ndWFnZXM/OiBvYmplY3RbXTtcbiAgcmVnaXN0ZWRPZmZpY2VzPzogb2JqZWN0W107XG4gIGNvbnRhY3REZXRhaWxzPzogQ29udGFjdFtdO1xufVxuXG5pbnRlcmZhY2UgQ29udGFjdCB7XG4gIHZlcnNpb246IHN0cmluZztcbiAgdmFsdWU6IHN0cmluZztcbiAgdHlwZTogc3RyaW5nO1xuICByZWdpc3RyYXRpb25EYXRlOiBzdHJpbmc7XG4gIGVuZERhdGU6IHN0cmluZztcbiAgbGFuZ3VhZ2U6IHN0cmluZztcbiAgc291cmNlOiBudW1iZXI7XG59XG5cbmNvbnN0IHNlYXJjaFl0aiA9IGFzeW5jIChwYXJhbXM6IFNlYXJjaFBhcmFtcykgOiBQcm9taXNlPENvbXBhbnlbXT4gPT4ge1xuICBsZXQgb3B0aW9ucyA9IHtcbiAgICBob3N0OiAnaHR0cHM6Ly9hdm9pbmRhdGEucHJoLmZpJyxcbiAgICBoZWFkZXI6IHsnQWNjZXB0JzonYXBwbGljYXRpb24vanNvbid9LFxuICAgIHBhdGg6IGAvYmlzL3YxP3RvdGFsUmVzdWx0cz1mYWxzZSZtYXhSZXN1bHRzPTEwMDAmcmVzdWx0c0Zyb209MCZyZWdpc3RlcmVkT2ZmaWNlPWArIGVuY29kZVVSSUNvbXBvbmVudChwYXJhbXMucmVnaXN0ZXJlZE9mZmljZSkgK2Amc3RyZWV0QWRkcmVzc1Bvc3RDb2RlPSR7cGFyYW1zLnN0cmVldEFkZHJlc3NQb3N0Q29kZX0mYnVzaW5lc3NMaW5lQ29kZT0ke3BhcmFtcy5idXNpbmVzc0xpbmVDb2RlfSZjb21wYW55UmVnaXN0cmF0aW9uRnJvbT0yMDE0LTAyLTI4YCxcbiAgfVxuXG4gIHJldHVybiBheGlvcy5nZXQob3B0aW9ucy5ob3N0ICsgb3B0aW9ucy5wYXRoLCB7aGVhZGVyczpvcHRpb25zLmhlYWRlcn0pXG4gIC50aGVuKChyZXMpID0+IHJlcy5kYXRhLnJlc3VsdHMpXG4gIC5jYXRjaCgoZXJyb3IpID0+IHtcbiAgICBjb25zb2xlLmxvZyhlcnJvcik7XG4gIH0pXG59XG5cbmNvbnN0IGdldENvbXBhbnlEZXRhaWxzID0gYXN5bmMgKGNvbXBhbnk6IENvbXBhbnkpIDogUHJvbWlzZTxDb21wYW55PiA9PiB7XG4gIGxldCBvcHRpb25zID0ge1xuICAgIGhvc3Q6ICdodHRwczovL2F2b2luZGF0YS5wcmguZmknLFxuICAgIGhlYWRlcjogeydBY2NlcHQnOiAnYXBwbGljYXRpb24vanNvbid9LFxuICAgIHBhdGg6ICcvYmlzL3YxLycrY29tcGFueS5idXNpbmVzc0lkXG4gIH1cbiAgcmV0dXJuIGF4aW9zLmdldChvcHRpb25zLmhvc3QgKyBvcHRpb25zLnBhdGgsIHtoZWFkZXJzOm9wdGlvbnMuaGVhZGVyfSlcbiAgLnRoZW4oKHJlcykgPT4gcmVzLmRhdGEucmVzdWx0c1swXSlcbiAgLmNhdGNoKChlcnJvcikgPT4ge1xuICAgIGNvbnNvbGUubG9nKGVycm9yKTtcbiAgfSlcbn1cblxuY29uc3Qgd3JpdGVDb21wYW5pZXNUb0NzdiA9IChjb21wYW5pZXM6IENvbXBhbnlbXSkgPT4ge1xuICBjb25zdCBjc3ZXcml0ZXIgPSBjcmVhdGVDc3ZXcml0ZXIoe1xuICAgIHBhdGg6ICdvdXQuY3N2JyxcbiAgICBoZWFkZXI6IFtcbiAgICAgIHtpZDonYnVzaW5lc3NJZCcsIHRpdGxlOididXNpbmVzc0lkJ30sXG4gICAgICB7aWQ6J25hbWUnLCB0aXRsZTonbmFtZSd9XG4gICAgXVxuICB9KTtcbiAgY3N2V3JpdGVyXG4gIC53cml0ZVJlY29yZHMoY29tcGFuaWVzKVxuICAudGhlbigoKSA9PiBjb25zb2xlLmxvZygnQ1NWIGNyZWF0ZWQgc3VjY2VzZnVsbHknKSk7XG59XG5cbmNvbnN0IHdyaXRlQ29tcGFuaWVzVG9Kc29uID0gKGNvbXBhbmllczogQ29tcGFueVtdKSA9PiB7XG4gIGxldCBkYXRhID0gSlNPTi5zdHJpbmdpZnkoY29tcGFuaWVzLCBudWxsLCAyKTtcbiAgZnMud3JpdGVGaWxlU3luYygnY29tcGFuaWVzLmpzb24nLCBkYXRhKTtcblxufVxuXG5jb25zdCBtYWluID0gYXN5bmMgKCkgPT4ge1xuICBjb25zdCByZXN1bHRzIDogQ29tcGFueVtdID0gW107XG5cbiAgZm9yIChsZXQgY2l0eSBvZiBbJ2p5dsOkc2t5bMOkJywgJ2xhdWthYScsICdwZXTDpGrDpHZlc2knLCAnasOkbXPDpCddKSB7XG4gICAgbGV0IHBhcmFtcyA9IHtidXNpbmVzc0xpbmVDb2RlOiA0OTQxMCwgYnVzaW5lc3NMaW5lOiAnJywgc3RyZWV0QWRkcmVzc1Bvc3RDb2RlOiAnJywgcmVnaXN0ZXJlZE9mZmljZTogY2l0eX07XG4gICAgKGF3YWl0IHNlYXJjaFl0aihwYXJhbXMpKS5tYXAoKGNvbXApID0+IHtcbiAgICAgIHJlc3VsdHMucHVzaChjb21wKTtcbiAgICB9KTtcbiAgfVxuICBjb25zb2xlLmxvZygncmVzdWx0cycsIHJlc3VsdHMpO1xuXG4gIC8qbGV0IGNvbXBhbnlEZXRhaWxzID0gW107XG4gIGZvciAobGV0IGNvbXBhbnkgb2YgcmVzdWx0cykge1xuICAgIGxldCBkZXRhaWxzID0gYXdhaXQgZ2V0Q29tcGFueURldGFpbHMoY29tcGFueSk7XG4gICAgY29tcGFueURldGFpbHMucHVzaChkZXRhaWxzKTtcbiAgfSovXG4gIC8vd3JpdGVDb21wYW5pZXNUb0NzdihyZXN1bHRzKTtcbiAgd3JpdGVDb21wYW5pZXNUb0pzb24ocmVzdWx0cyk7XG59XG5tYWluKCk7XG4iXX0=