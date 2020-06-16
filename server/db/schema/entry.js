const entrySchema = `
CREATE TABLE IF NOT EXISTS Entries
(
 id integer PRIMARY KEY NOT NULL,
 title text NOT NULL UNIQUE,
 createdOn integer(4) not null default (strftime('%s','now')),
 lastModifiedOn datetime NOT NULL,
 md text NOT NULL,
 changelog text
);

CREATE TABLE IF NOT EXISTS Entries_Log (
  EntriesLogId integer PRIMARY KEY NOT NULL, 
  EntryId INT, 
  title text NOT NULL,
  createdOn integer(4) NOT NULL,
  lastModifiedOn datetime NOT NULL,
  md text NOT NULL,
  changelog text
);

CREATE TRIGGER make_log_of_entry 
AFTER UPDATE ON Entries 
WHEN old.title <> new.title 
OR old.md <> new.md 
BEGIN INSERT INTO Entries_Log (
  EntryId,
  title,
  createdOn,
  lastModifiedOn,
  md,
  changelog
) VALUES (
  old.id,
  new.title,
  old.createdOn,
  new.lastModifiedOn,
  new.md,
  new.changelog
);
END;

CREATE TRIGGER make_log_of_entry_initial 
AFTER INSERT ON Entries 
BEGIN INSERT INTO Entries_Log (
  EntryId,
  title,
  createdOn,
  lastModifiedOn,
  md,
  changelog
) VALUES (
  new.id,
  new.title,
  new.createdOn,
  new.lastModifiedOn,
  new.md,
  new.changelog
);
END;
`
module.exports = entrySchema
