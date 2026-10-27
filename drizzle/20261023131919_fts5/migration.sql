-- Custom SQL migration file, put your code below! --
CREATE VIRTUAL TABLE IF NOT EXISTS passages_fts USING fts5(
  body,
  section,
  content='passages',
  content_rowid='id'
);

CREATE TRIGGER IF NOT EXISTS passages_ai
AFTER INSERT ON passages
BEGIN
  INSERT INTO passages_fts(
    rowid,
    body,
    section
  )
  VALUES (
    new.id,
    new.body,
    new.section
  );
END;

CREATE TRIGGER IF NOT EXISTS passages_ad
AFTER DELETE ON passages
BEGIN
  INSERT INTO passages_fts(
    passages_fts,
    rowid,
    body,
    section
  )
  VALUES (
    'delete',
    old.id,
    old.body,
    old.section
  );
END;

CREATE TRIGGER IF NOT EXISTS passages_au
AFTER UPDATE ON passages
BEGIN
  INSERT INTO passages_fts(
    passages_fts,
    rowid,
    body,
    section
  )
  VALUES (
    'delete',
    old.id,
    old.body,
    old.section
  );

  INSERT INTO passages_fts(
    rowid,
    body,
    section
  )
  VALUES (
    new.id,
    new.body,
    new.section
  );
END;