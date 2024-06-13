export const environment = {
    production: true,
     apiURL: 'https://api.rikusa.com/api/v1',
    adminApiURL: 'https://api.rikusa.com/api/v1/admin',
    ckeConfig : {
    toolbar: [  'undo', 'redo', '|', 'heading', 'fontSize', 'bold', 'italic', 'underline', 'fontColor', 'highlight', 'link', 'alignment', '|', 'bulletedList', 'numberedList', 'alignment', 'indent', 'outdent', 'specialCharacters', 'blockQuote'],
    heading: {
      options: [
        { model: 'paragraph', title: 'Paragraph', class: 'ck-heading_paragraph' },
        { model: 'heading1', view: 'h1', title: 'Heading 1', class: 'ck-heading_heading1' },
        { model: 'heading2', view: 'h2', title: 'Heading 2', class: 'ck-heading_heading2' }
      ]
    }
  },
};
