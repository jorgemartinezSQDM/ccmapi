define(["postmonger"], function (Postmonger) {
  "use strict";
  var connection = new Postmonger.Session();
  var payload = {};
  var personalizations = [];
  var personalizationsUrl = [];
  var inArgument = {};
  var eventDefinitionKey = '';
  var hasInArguments = false;
  var steps = [{ label: "Configure Message", key: "step1" }];
  $(window).ready(onRender);
  connection.on("initActivity", initialize);
  connection.on("clickedNext", onClickedNext);
  connection.on(
    "requestedTriggerEventDefinition",
    function (eventDefinitionModel) {
      eventDefinitionKey = eventDefinitionModel.eventDefinitionKey;
    }
  );

  function onRender() {
    connection.trigger('requestTriggerEventDefinition');
    connection.trigger("ready");
  }

  function initialize(data) {
    console.log('____________________________')
    console.log('hola mundo' + eventDefinitionKey)
    console.log('____________________________')
    if (data) {
      payload = data;
    }
    hasInArguments = Boolean(
      payload["arguments"] &&
        payload["arguments"].execute &&
        payload["arguments"].execute.inArguments &&
        payload["arguments"].execute.inArguments.length > 0
    );
    var inArguments = hasInArguments
      ? payload["arguments"].execute.inArguments
      : {};
    // Load attribute sets
    if (inArguments.length > 0) {
      inArgument = inArguments[inArguments.length - 1];
      /***
       *
       *
       * configurar datos para UI
       *
       *
       *
       *
       *
       */
    }
    connection.trigger("updateButton", {
      button: "next",
      text: "done",
      visible: true,
    });
  }
  // Navigation functions
  function onClickedNext() {
    if (ValidateStep1()) save();
    else connection.trigger("ready");
  }
  // Validates step 1 required fields
  function ValidateStep1() {
    var step1Valid = true;
    return step1Valid;
  }
  // Save function
  function save() {
    var inArgs = [];
    var arg = {};
    //arg.nombre = '{{Event.' + eventDefinitionKey +'.numero_doc}}'
    arg.tipo_doc = '{{Event.' + eventDefinitionKey +'.tipo_doc}}'
    arg.numero_doc = '{{Event.' + eventDefinitionKey +'.numero_doc}}'
    inArgs.push(arg);
    payload["arguments"].execute.inArguments = inArgs;
    payload["metaData"].isConfigured = true;
    connection.trigger("updateActivity", payload);
  }
});
