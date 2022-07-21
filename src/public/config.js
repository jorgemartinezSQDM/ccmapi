export default {
  workflowApiVersion: "1.1",
  metaData: {
    icon: "images/icon.png",
    iconSmall: "images/iconSmall.png",
    category: "message"
  },
  type: "RESTDECISION",
  lang: {
    "en-US": {
      name: "CCM POC CLARO PROD",
      description: "A custom Journey Builder",
      step1Label: "Configure Message",
    },
  },
  arguments: {
    execute: {
      inArguments: [],
      outArguments: [],
      url: "https://ccm-ca-api.herokuapp.com/execute",
      verb: "POST",
      body: "",
      header: "",
      format: "json",
      useJwt: true,
      timeout: 10000,
    },
  },
  configurationArguments: {
    applicationExtensionKey: "e5fb3ffb-3510-46f2-baa6-0a720fdad3c6",
    save: {
      url: "https://ccm-ca-api.herokuapp.com/save",
      verb: "POST",
      useJwt: true,
    },
    publish: {
      url: "https://ccm-ca-api.herokuapp.com/publish",
      verb: "POST",
      useJwt: true,
    },
    stop: {
      url: "https://ccm-ca-api.herokuapp.com/stop",
      verb: "POST",
      useJwt: true,
    },
    validate: {
      url: "https://ccm-ca-api.herokuapp.com/validate",
      verb: "POST",
      useJwt: true,
    },
  },
  outcomes: [
    {
      arguments: {
        branchResult: "sent",
      },
      metaData: {
        label: "Sent",
      },
    },
    {
      arguments: {
        branchResult: "notsent",
      },
      metaData: {
        label: "Not Sent",
      },
    },
  ],
  userInterfaces: {
    configModal: {
      height: 680,
      width: 800,
      fullscreen: false,
    },
  },
  schema: {
    arguments: {
      execute: {
        inArguments: [],
        outArguments: [],
      },
    },
  },
  version: "1.0.0",
};
