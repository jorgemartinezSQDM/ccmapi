const userHelper = require("./general.helper");
const { QueryTypes } = require("sequelize");
const sequelize = require("../../../bin/config/database");

const bulk_create = (batabaseObject, recordList, res) => {
  //console.log(recordList);
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
        return {
          result: { message: "No data to show" },
          status: 404,
          success: false,
        };
        //res.json({ message: "No data to show" }).status(200);
      }
    })
    .catch((error) => {
      return { result: error, status: 500 };
      //res.json(error).status(500);
    });
};

const rawQuery = (res, query, pagination, page, pageSize) => {
  query =
    'SELECT frecuencia.*, "clientes"."Nombres" AS "Clientes_Nombres", "clientes"."Apellidos" AS "Clientes_Apellidos", ' +
    '"campanas"."Nombre" AS "Campanas_Nombre" ' +
    "FROM frecuencia  " +
    'JOIN "clientes" ON frecuencia."ClienteId" = "clientes"."Id" ' +
    'JOIN "campanas" ON frecuencia."CampanaId" = "campanas"."Id" ' +
    (query !== "" ? "WHERE " + query + pagination : pagination);
  sequelize
    .query(query)
    .then((results, metadata) => {
      res.status(200).json({
        Page: page + 1,
        Total_Records: results[0].length,
        Next_Page: pageSize === results[0].length,
        Records: results[0],
      });
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
  getByAttributes(batabaseObject, { Id: recordId }).then((response) => {
    if (response.success) {
      batabaseObject
        .update(record, {
          where: {
            Id: recordId,
          },
        })
        .then((result) => {
          //console.log("UPDATE", result);
          res
            .status(200)
            .json({ Message: "The record has been successfully updated" });

          return;
        })
        .catch((error) => {
          res.json(error).status(500);
          return;
        });
    } else {
      res.status(404).json({ Message: "The record does not exist" });
    }
  });
};

const bulk_update = (
  batabaseObject,
  index,
  recordList,
  length,
  res,
  final_response
) => {
  const current_record = recordList[index];
  delete current_record.Contrasena;
  //console.log('current_record => ', current_record)
  //console.log('final_response => ', final_response)
  getByAttributes(batabaseObject, { Id: current_record.Id }).then(
    (response) => {
      if (response.success) {
        batabaseObject
          .update(current_record, {
            where: {
              Id: current_record.Id,
            },
          })
          .then((result) => {
            final_response.success.push({
              Id: current_record.Id,
              Message: "The record has been successfully updated",
            });
            if (length - 1 === index) {
              res.status(200).json({
                result: final_response,
                Records_Updated: final_response.success.length,
              });
              return;
            } else {
              bulk_update(
                batabaseObject,
                index + 1,
                recordList,
                length,
                res,
                final_response
              );
            }
          })
          .catch((error) => {
            res.status(400).json(error);
            return;
          });
      } else {
        final_response.errors.push({
          Id: current_record.Id,
          Message: "The record does not exist",
        });
        if (length - 1 === index) {
          res.status(200).json({
            result: final_response,
            Records_Updated: final_response.success.length,
          });
          return;
        } else {
          bulk_update(
            batabaseObject,
            index + 1,
            recordList,
            length,
            res,
            final_response
          );
        }
      }
    }
  );
};

const deleteById = (batabaseObject, attributes, res) => {
  batabaseObject
    .destroy({
      where: attributes,
    })
    .then((result) => {
      
      if (!result) {
        return res.status(404).send({ Message: "No record(s) found(s)" });
      } else {
        res.status(200).json({
          deleted_records: result,
          Message: "The record(s) have been successfully deleted",
        });
      }

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
