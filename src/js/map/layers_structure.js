const strucuture_example_for_json = {
  baseMaps: [
    {
      titulo: "Argenmap",
      nombre: "argenmap",
      servicio: "tms",
      version: "1.0.0",
      attribution:
        "<a href='https://www.ign.gob.ar/AreaServicios/Argenmap/IntroduccionV2' target='_blank'>Instituto Geográfico Nacional</a> + <a href='https://www.osm.org/copyright' target='_blank'>OpenStreetMap</a>",
      source:
        "https://wms.ign.gob.ar/geoserver/gwc/service/tms/1.0.0/capabaseargenmap@EPSG%3A3857@png/{z}/{x}/{-y}.png",
      legendImg: "src/styles/images/argenmap.png",
      peso: 10,
      zoom: {
        min: 3,
        max: 21,
      },
      selected: true,
    },
    {
      titulo: "Argenmap gris",
      nombre: "argenmap_gris",
      servicio: "tms",
      version: "1.0.0",
      attribution:
        "<a href='https://www.ign.gob.ar/AreaServicios/Argenmap/IntroduccionV2' target='_blank'>Instituto Geográfico Nacional</a> + <a href='https://www.osm.org/copyright' target='_blank'>OpenStreetMap</a>",
      source:
        "https://wms.ign.gob.ar/geoserver/gwc/service/tms/1.0.0/mapabase_gris@EPSG%3A3857@png/{z}/{x}/{-y}.png",
      legendImg: "src/styles/images/argenmap-gris.png",
      peso: 20,
      zoom: {
        min: 3,
        max: 21,
      },
    },
  ],
  sections: [
    {
      tab: {
        id: "Datos",
        searcheable: true,
        content: "Datos",
      },
      type: "WMS",
      peso: 20,
      nombre: "Mapa cultural de la Defensa",
      resumen: "",
      short_abstract: "",
      class: "",
      seccion: "mapa-cultural-defensa",
      servicio: "wms",
      version: "1.3.0",
      source: "https://idemindef.ign.gob.ar/geoserver/cultura",
      hasSubSections: false,
    },
    {
      nombre:
        "Secretaría de Investigación, Política Industrial y Producción para la Defensa",
      resumen: "",
      hasSubSections: true,
      type: "SECTION",
      sections: [
        {
          tab: {
            id: "Datos",
            searcheable: true,
            content: "Datos",
          },
          type: "WMS",
          peso: 31,
          nombre: "Fabricaciones Militares",
          resumen: "",
          short_abstract: "",
          class: "",
          seccion: "fabricaciones-militares",
          servicio: "wms",
          version: "1.3.0",
          source: "https://idemindef.ign.gob.ar/geoserver/fabricas_empresas",
          allowed_layers: ["empresas_fm", "fabrica_militar"],
          hasSubSections: false,
        },
        {
          nombre: "Instituto Geográfico Nacional",
          resumen: "",
          type: "SECTION",
          sections: [
            {
              tab: {
                id: "Datos",
                searcheable: true,
                content: "Datos",
              },
              type: "WMS",
              peso: 40,
              nombre: "Límites y unidades territoriales",
              short_abstract:
                "Provincias, departamentos, municipios, áreas protegidas, etc.",
              class: "",
              seccion: "limites",
              servicio: "wms",
              version: "1.3.0",
              source: "https://wms.ign.gob.ar/geoserver/limites",
            },
          ],
        },
      ],
    },
    {
      title: "Cartografía",
      description: "Cartas topográficas, atlas topográficos, cartografía, etc.",
      sections: [],
      layers: [
        { type: "wmts",
          src: "https://imagenes.ign.gob.ar/geoserver/atlas_tucuman_100k",
          isMultiLayer: false,
          exclude_layers: [],
          selected: true,
          weight: 100,
          icon: null
        },
        { type: "wmts",
          src: "https://imagenes.ign.gob.ar/geoserver/atlas_argentina_500k",
          isMultiLayer: false,
          exclude_layers: [],
          selected: false,
          weight: 100,
          icon: null
        },
        { type: "wmts",
          src: "https://imagenes.ign.gob.ar/geoserver/cartas_mosaicos",
          isMultiLayer: true,
          exclude_layers: [],
          selected: false,
          weight: 100,
          icon: null
        }
      ],
      //Each layer has its on dependencies and is declared in its own section.
      dependencies: {
        "layer1": [
          { "sectionAbc": "layer32" },
          { "sectionXyz": "layer22" },
      ]
      }
    },
  ],
};

types = [WMS, TMS, WMTS, WFS, GEOJSON, KML]