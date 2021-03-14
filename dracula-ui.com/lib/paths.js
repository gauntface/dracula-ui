import dspComponents from "../../dsp/data/components.json";

const paths = dspComponents.entities.map((entity) => {
  return {
    params: {
      guide: entity.name.toLowerCase(),
      title: entity.name,
      description: entity.description,
      docgen: entity.ext_com_draculaui_docgen,
      sections: Object.values(entity.ext_com_draculaui_variations).map(
        (example) => {
          return {
            ...example,
            code: example.html,
            description: example.docs,
          };
        }
      ),
    },
  };
});

module.exports = paths;
