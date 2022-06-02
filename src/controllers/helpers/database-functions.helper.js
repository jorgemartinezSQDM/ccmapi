const userHelper = require("./general.helper");

const bulk_create = (batabaseObject, recordList, res) => {
  console.log(recordList)
  batabaseObject
    .bulkCreate(recordList)
    .then((results) => {
      results = userHelper.deletePasswordFromResponse(results);
      res.json(results).status(200);
    })
    .catch((error) => {
      res.json(error).status(500);
    });
};

const single_create = (batabaseObject, record) => {

  if (record.Tipo_Documento) {
    record.llaveUnicaCliente = record.Tipo_Documento + record.Numero_Documento
  }

  return batabaseObject
    .create(record)
    .then((result) => {
      result = userHelper.deletePasswordFromResponse(result);
      return { result: result, status: 200, success: true }; //res.json(result).status(200);
    })
    .catch((error) => {
      return { result: error, status: 500 };
      //res.json(error).status(500);
    });
};

const getById = (batabaseObject, recordId, res) => {
  batabaseObject
    .findOne({ where: { Id: parseInt(recordId) } })
    .then((result) => {
      result = JSON.parse(JSON.stringify(result));
      if (result !== null) {
        result = userHelper.deletePasswordFromResponse(result);
        res.json(result).status(200);
      } else {
        res.json({ message: "No data to show" }).status(200);
      }
    })
    .catch((error) => {
      res.json(error).status(500);
    });
};

const getByAttributes = (batabaseObject, attributes) => {
  return batabaseObject
    .findOne({ where: attributes })
    .then((result) => {
      result = JSON.parse(JSON.stringify(result));
      if (result !== null) {
        result = userHelper.deletePasswordFromResponse(result);
        return { result: result, status: 200, success: true }; //res.json(result).status(200);
      } else {
        return { result: { message: "No data to show" }, status: 404 };
        //res.json({ message: "No data to show" }).status(200);
      }
    })
    .catch((error) => {
      return { result: error, status: 500 };
      //res.json(error).status(500);
    });
};

const getAll = (batabaseObject, res) => {
  batabaseObject
    .findAll()
    .then((result) => {
      result = userHelper.deletePasswordFromResponse(result);
      res.json(result).status(200);
    })
    .catch((error) => {
      res.json(error).status(500);
    });
};

const updateOne = (batabaseObject, recordId, record, res) => {
  batabaseObject
    .update(record, {
      where: {
        Id: recordId,
      },
    })
    .then((result) => {
      res
        .json({ Message: "The record has been successfully updated" })
        .status(200);
    })
    .catch((error) => {
      res.json(error).status(500);
    });
};

const bulk_update = (batabaseObject, index, recordList, length, res) => {
  const current_record = recordList[index];
  delete current_record.Contrasena;
  batabaseObject
    .update(current_record, {
      where: {
        Id: current_record.Id,
      },
    })
    .then((result) => {
      if (length - 1 === index) {
        res
          .json({
            Message: "The records have been successfully updated",
            Records_Updated: length,
          })
          .status(200);
      } else {
        bulk_update(batabaseObject, index + 1, recordList, length, res);
      }
    })
    .catch((error) => {
      res.json(error).status(500);
    });
};

module.exports = {
  bulk_create,
  single_create,
  getById,
  getAll,
  updateOne,
  bulk_update,
  getByAttributes,
};
