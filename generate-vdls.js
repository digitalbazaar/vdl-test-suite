/*!
 * Copyright (c) 2021 Digital Bazaar, Inc. All rights reserved.
 */
'use strict';

const {join} = require('path');
const {writeJSON} = require('./files.cjs');
const {paths} = require('./paths.cjs');
const {v4: uuidv4} = require('uuid');
const {CONTEXT_URL} = require('vdl-context');
const stateList = require('./states');

function createVC(state) {
  const contexts = [
    'https://www.w3.org/2018/credentials/v1',
    CONTEXT_URL,
  ];
  const type = [
    'VerifiableCredential',
    'Iso18013DriversLicense'
  ];
  const fileName = `${state.name}.json`;
  const certificate = {
    '@context': contexts,
    type,
    credentialSubject: {
      id: `did:license:${uuidv4()}`,
      type: 'Iso18013DriversLicense',
      license: {
        type: 'Iso18013DriversLicense',
        document_number: '542426814',
        family_name: 'TURNER',
        given_name: 'SUSAN',
        portrait: '/9j/4AAQSkZJRgABAQEAkACQA...gcdgck5HtRRSClooooP/2Q==',
        birth_date: '1998-08-28',
        issue_date: '2018-01-15T10:00:00.0000000-07:00',
        expiry_date: '2022-08-27T12:00:00.0000000-06:00',
        issuing_country: 'US',
        issuing_authority: state.code,
        /*
        driving_privileges: [{
          codes: [{code: 'D'}],
          vehicle_category_code: 'D',
          issue_date: '2019-01-01',
          expiry_date: '2027-01-01'
        },
        {
          codes: [{code: 'C'}],
          vehicle_category_code: 'C',
          issue_date: '2019-01-01',
          expiry_date: '2017-01-01'
        }],
        */
        un_distinguishing_sign: 'USA',
      }
    }
  };
  return {fileName, certificate};
}

/**
 * Formats data into VCs.
 *
 * @returns {Promise} Writes data to `/certificates` and exits.
*/
async function generateCertificates() {
  try {
    await Promise.all(stateList.flatMap(state => {
      const {fileName, certificate} = createVC(state);
      const filePath = join(paths.certificates, fileName);
      return writeJSON({path: filePath, data: certificate});
    }));
  } catch(e) {
    console.error(e);
  }
}

generateCertificates();
