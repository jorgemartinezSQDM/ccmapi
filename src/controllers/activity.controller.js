const { response } = require("express");
const { JWT } = require("./helpers/activity.helper");
const logic_controller = require("./logic.controller");

/*
 * POST Handler for / route of Activity (this is the edit route).
 */
const edit = function (req, res) {
  // Data from the req and put it in an array accessible to the main app.
  ////console.log( req.body );
  //logData(req);
  res.status(200).send("Edit");
};
/*
 * POST Handler for /save/ route of Activity.
 */
const save = function (req, res) {
  // Data from the req and put it in an array accessible to the main app.
  ////console.log( req.body );
  //logData(req);
  res.status(200).send("Save");
};
/*
 * POST Handler for /execute/ route of Activity.
 */
const execute = async function (req, res) {
  const jwt = req.body.toString("utf8"); //esto se recibe por parametro
  console.log("-----------------------");
  console.log("jwt => " + jwt);
  //console.log("-----------------------");
  /*request(
    {
      method: "POST",
      url: "https://env9nclj3z9o.x.pipedream.net",
      body: jwt,
    },
    function (error, response) {
      //console.log(response);
    }
  );*/
  JWT(jwt, process.env.jwtSecret, async (err, decoded) => {
    if (decoded && decoded.inArguments && decoded.inArguments.length > 0) {
      var decodedArgs = decoded.inArguments[0];

      ////console.log("-----------------------");

      console.log("decodedArgs => ", decodedArgs);
      const args = {
        campana: decodedArgs.cod_campana,
        tipo_documento: decodedArgs.tipo_documento,
        numero_documento: decodedArgs.numero_documento,
      };
      logic_controller.index_logic_helper(args, res, true)
      .then(response => {
        console.log("response => " + JSON.stringify(response));
        console.log("-----------------------");
        res.status(response.status).json(response.response);
        return;
      }).catch(error => {
        res.status(400).json({ branchResult: "notsent" });
        return;
      })
      
      

      
      
      //decodedArgs.nombre esta esla variable declarada en el customactivity.js metodo save

      //res.status(200).json({ branchResult: "notsent" });
      //res.status(200).json({ branchResult: "sent" });
    } else {
      res.status(400).json({ branchResult: "notsent" });
      return;
    }
  });
  //res.status(200).json({ branchResult: "sent" });

  //TODO..
};
/*
 * POST Handler for /publish/ route of Activity.
 */
const publish = function (req, res) {
  // Data from the req and put it in an array accessible to the main app.
  res.status(200).send("Publish");
};
/*
 * POST Handler for /stop/ route of Activity.
 */
const stop = function (req, res) {
  // Data from the req and put it in an array accessible to the main app.
  res.status(200).send("stop");
};
/*
 * POST Handler for /validate/ route of Activity.
 */
const validate = function (req, res) {
  // Data from the req and put it in an array accessible to the main app.
  ////console.log( req.body );
  //logData(req);
  res.status(200).send("Validate");
};

module.exports = {
  validate,
  stop,
  publish,
  execute,
  save,
  edit,
};
