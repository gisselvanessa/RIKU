// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  // apiURL: 'https://devjakapi.internetsoft.com/api/v1',
  // adminApiURL: 'https://devjakapi.internetsoft.com/api/v1/admin',
  apiURL: 'http://localhost:4000/api/v1',
  adminApiURL: 'http://localhost:4000/api/v1/admin',
  ckeConfig: {
    toolbar: ['undo', 'redo', '|', 'heading', 'fontSize', 'bold', 'italic', 'underline', 'fontColor', 'highlight', 'link', 'alignment', '|', 'bulletedList', 'numberedList', 'alignment', 'indent', 'outdent', 'specialCharacters', 'blockQuote'],
    heading: {
      options: [
        { model: 'paragraph', title: 'Paragraph', class: 'ck-heading_paragraph' },
        { model: 'heading1', view: 'h1', title: 'Heading 1', class: 'ck-heading_heading1' },
        { model: 'heading2', view: 'h2', title: 'Heading 2', class: 'ck-heading_heading2' }
      ]
    }
  }
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
// {
//   "type": "seller",
//   "first_name": "uttam",
//   "last_name": "gelot",
//   "email": "uttam@internetsoft1.site",
//   "confirm_email": "uttam@internetsoft1.site",
//   "mobile_no": "7203919931",
//   "password": "Test@1234",
//   "gender": "male",
//   "address": {
//       "state": "Gujarat",
//       "city": "surat",
//       "zip": 382481
//   },
//   "dob": "23/03/1999",
//   "vehicle_types": ["cars"],
//   "is_agreed": "true"
// }
