export default {
  workflowApiVersion: "1.1",
  metaData: {
    icon: "images/icon.png",
    iconSmall: "images/iconSmall.png",
    category: "custom"
  },
  type: "REST",
  arguments: {
    execute: {
      inArguments: [],
      outArguments: [],
      url: "https://ccm-api-ca.herokuapp.com/execute/",
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
      url: "https://ccm-api-ca.herokuapp.com/save/",
      verb: "POST",
      useJwt: true,
    },
    publish: {
      url: "https://ccm-api-ca.herokuapp.com/publish",
      verb: "POST",
      useJwt: true,
    },
    stop: {
      url: "https://ccm-api-ca.herokuapp.com/stop",
      verb: "POST",
      useJwt: true,
    },
    validate: {
      url: "https://ccm-api-ca.herokuapp.com/validate",
      verb: "POST",
      useJwt: true,
    },
  },
  outcomes: [
    {
      arguments: {
        branchResult: "sent",
      }
    },
    {
      arguments: {
        branchResult: "notsent",
      }
    },
  ],
  lang: {
    "en-US": {
      name: "CCM POC CLARO",
      description: "A custom Activity Journey Builder POC CCM",
      "i18n_sent": "Sent",
      "i18n_notsent": "Not Sent"
    },
  },
  "outcomeLabelLanguageMap": {
    "sent": "i18n_sent",
    "notsent": "i18n_notsent"
  },
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
