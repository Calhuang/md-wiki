const imagesSchema = `
CREATE TABLE IF NOT EXISTS Images
(
 id integer PRIMARY KEY NOT NULL,
 name text NOT NULL,
 data BLOB NOT NULL
);
`
module.exports = imagesSchema
