const userHelper = require("./general.helper");
const { QueryTypes } = require("sequelize");
const sequelize = require("../../../bin/config/database");

const bulk_create = (batabaseObject, recordList, res) => {
  console.log(recordList);
  batabaseObject
    .bulkCreate(recordList)
    .then((results) => {
      results = userHelper.deletePasswordFromResponse(results);
      res.status(200).json(results);
      return;
    })
    .catch((error) => {
      res.status(400).json(error);
      return;
    });
};

const single_create = (batabaseObject, record) => {
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

/*const getById = (batabaseObject, recordId, res) => {
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
};*/

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

const rawQuery = (res, query) => {
  query =
    'SELECT frecuencia.*, "clientes"."Nombres" AS "Clientes_Nombres", "clientes"."Apellidos" AS "Clientes_Apellidos", ' +
    '"campanas"."Nombre" AS "Campanas_Nombre" ' +
    "FROM frecuencia  " +
    'JOIN "clientes" ON frecuencia."ClienteId" = "clientes"."Id" ' +
    'JOIN "campanas" ON frecuencia."CampanaId" = "campanas"."Id" ' +
    "WHERE " +
    query;
  sequelize
    .query(query)
    .then((results, metadata) => {
      res.status(200).json({ results: results[0], metadata });
      return;
    })
    .catch((error) => {
      res.status(401).json(error);
      return;
    });
};
const getAll = (batabaseObject, res, page, pageSize, where) => {
  const offset = page * pageSize;
  const limit = pageSize;
  batabaseObject
    .findAll({ limit, offset, where: where })
    .then((result) => {
      result = userHelper.deletePasswordFromResponse(result);
      const Next_Page = pageSize === result.length;
      res.status(200).json({
        Page: page + 1,
        Total_Records: result.length,
        Next_Page,
        Records: result,
      });
      return;
    })
    .catch((error) => {
      res.status(400).json(error);
      return;
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
      console.log('UPDATE',  result)
      res
        .json({ Message: "The record has been successfully updated" })
        .status(200);
      return;
    })
    .catch((error) => {
      res.json(error).status(500);
      return;
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
        res.status(200).json({
          Message: "The records have been successfully updated",
          Records_Updated: length,
        });
        return;
      } else {
        bulk_update(batabaseObject, index + 1, recordList, length, res);
      }
    })
    .catch((error) => {
      res.status(400).json(error);
      return;
    });
};

const deleteById = (batabaseObject, attributes, res) => {
  batabaseObject;
  batabaseObject
    .destroy({
      where: attributes,
    })
    .then((result) => {
      res.status(200).json({
        Message: "The record have been successfully deleted",
      });
      return;
    })
    .catch((error) => {
      res.status(400).json(error);
      return;
    });
};
module.exports = {
  bulk_create,
  single_create,
  //getById,
  getAll,
  updateOne,
  bulk_update,
  getByAttributes,
  deleteById,
  rawQuery,
};
