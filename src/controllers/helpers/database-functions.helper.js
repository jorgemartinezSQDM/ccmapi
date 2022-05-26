const bulk_create = (batabaseObject, recordList, res) => {
  batabaseObject
    .bulkCreate(recordList)
    .then((results) => {
      results = JSON.parse(JSON.stringify(results));
      results = results.map((result) => {
        delete result.Contrasena;
        return result;
      });
      res.json(results).status(200);
    })
    .catch((error) => {
      res.json(error).status(500);
    });
};

const single_create = (batabaseObject, record, res) => {
  batabaseObject
    .create(record)
    .then((result) => {
      result = JSON.parse(JSON.stringify(result));
      delete result.Contrasena;
      res.json(result).status(200);
    })
    .catch((error) => {
      res.json(error).status(500);
    });
};

module.exports = {
  bulk_create,
  single_create,
};
