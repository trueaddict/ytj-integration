import axios from 'axios';
import {createObjectCsvWriter} from 'csv-writer';
import fs from 'fs';
import { MongoClient, ObjectId } from 'mongodb';

const createCsvWriter = createObjectCsvWriter;

const uri = process.env.MONGO_URI;
const client = new MongoClient(String(uri));

interface SearchParams {
  registeredOffice: string;
  streetAddressPostCode: string;
  businessLine: string;
  businessLineCode: number;
}

interface Company {
  id: ObjectId;
  businessId: {type: string, unique : true};
  name: string;
  registrationDate: string;
  companyForm: string;
  detailsUri: string;
  names?: object[];
  auxiliaryNames?: object[];
  addresses?: object[];
  companyForms?: object[];
  businessLines?: object[];
  languages?: object[];
  registedOffices?: object[];
  contactDetails?: Contact[];
}

interface Contact {
  version: string;
  value: string;
  type: string;
  registrationDate: string;
  endDate: string;
  language: string;
  source: number;
}

const searchYtj = async (params: SearchParams) : Promise<Company[]> => {
  let options = {
    host: 'https://avoindata.prh.fi',
    header: {'Accept':'application/json'},
    path: `/bis/v1?totalResults=false&maxResults=1000&resultsFrom=0&registeredOffice=`+ encodeURIComponent(params.registeredOffice) +`&streetAddressPostCode=${params.streetAddressPostCode}&businessLineCode=${params.businessLineCode}&companyRegistrationFrom=2014-02-28`,
  }

  return axios.get(options.host + options.path, {headers:options.header})
  .then((res) => res.data.results)
  .catch((error) => {
    console.log(error);
  })
}

const getCompanyDetails = async (company: Company) : Promise<Company> => {
  let options = {
    host: 'https://avoindata.prh.fi',
    header: {'Accept': 'application/json'},
    path: '/bis/v1/'+company.businessId
  }
  return axios.get(options.host + options.path, {headers:options.header})
  .then((res) => res.data.results[0])
  .catch((error) => {
    console.log(error);
  })
}

const writeCompaniesToCsv = (companies: Company[]) => {
  const csvWriter = createCsvWriter({
    path: 'out.csv',
    header: [
      {id:'businessId', title:'businessId'},
      {id:'name', title:'name'}
    ]
  });
  csvWriter
  .writeRecords(companies)
  .then(() => console.log('CSV created succesfully'));
}

const writeCompaniesToJson = (companies: Company[]) => {
  let data = JSON.stringify(companies, null, 2);
  fs.writeFileSync('companies.json', data);

}

const writeCompaniesToMongoDb = async (companies: Company[]) => {
  try {
    await client.connect();
    const db = client.db('dev');
    const companiesCollection = db.collection<Company>('companies');

    const result = await companiesCollection.insertMany(companies);
    console.log(result);
  } finally {
    await client.close();
  }
}

const main = async () => {
  const results : Company[] = [];

  for (let city of ['jyväskylä', 'laukaa', 'petäjävesi', 'jämsä']) {
    let params = {businessLineCode: 49410, businessLine: '', streetAddressPostCode: '', registeredOffice: city};
    (await searchYtj(params)).map((comp) => {
      results.push(comp);
    });
  }
  console.log('results', results);

  /*let companyDetails = [];
  for (let company of results) {
    let details = await getCompanyDetails(company);
    companyDetails.push(details);
  }*/
  //writeCompaniesToCsv(results);
  writeCompaniesToJson(results);
  await writeCompaniesToMongoDb(results);
}
main();
