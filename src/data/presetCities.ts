export type PresetCity = {
  id: string;
  name: string;
  lat: number;
  lon: number;
};

export const presetCities: PresetCity[] = [
  // Skåne
  { id: "malmo", name: "Malmö", lat: 55.6050, lon: 13.0038 },
  { id: "lund", name: "Lund", lat: 55.7047, lon: 13.1910 },
  { id: "helsingborg", name: "Helsingborg", lat: 56.0465, lon: 12.6945 },
  { id: "landskrona", name: "Landskrona", lat: 55.8710, lon: 12.8318 },
  { id: "trelleborg", name: "Trelleborg", lat: 55.3751, lon: 13.1569 },
  { id: "ystad", name: "Ystad", lat: 55.4295, lon: 13.8200 },
  { id: "kristianstad", name: "Kristianstad", lat: 56.0294, lon: 14.1567 },

  // Halland / Västra Götaland
  { id: "halmstad", name: "Halmstad", lat: 56.6745, lon: 12.8578 },
  { id: "varberg", name: "Varberg", lat: 57.1056, lon: 12.2508 },
  { id: "goteborg", name: "Göteborg", lat: 57.7089, lon: 11.9746 },
  { id: "boras", name: "Borås", lat: 57.7210, lon: 12.9401 },
  { id: "trollhattan", name: "Trollhättan", lat: 58.2837, lon: 12.2886 },
  { id: "skovde", name: "Skövde", lat: 58.3912, lon: 13.8451 },
  { id: "uddevalla", name: "Uddevalla", lat: 58.3478, lon: 11.9424 },

  // Småland / Blekinge
  { id: "jonkoping", name: "Jönköping", lat: 57.7826, lon: 14.1618 },
  { id: "vaxjo", name: "Växjö", lat: 56.8777, lon: 14.8091 },
  { id: "kalmar", name: "Kalmar", lat: 56.6634, lon: 16.3568 },
  { id: "karlskrona", name: "Karlskrona", lat: 56.1612, lon: 15.5869 },

  // Östergötland / Södermanland
  { id: "linkoping", name: "Linköping", lat: 58.4109, lon: 15.6216 },
  { id: "norrkoping", name: "Norrköping", lat: 58.5877, lon: 16.1924 },
  { id: "eskilstuna", name: "Eskilstuna", lat: 59.3710, lon: 16.5098 },

  // Stockholm / Uppsala
  { id: "stockholm", name: "Stockholm", lat: 59.3293, lon: 18.0686 },
  { id: "solna", name: "Solna", lat: 59.3600, lon: 18.0000 },
  { id: "sodertalje", name: "Södertälje", lat: 59.1955, lon: 17.6253 },
  { id: "uppsala", name: "Uppsala", lat: 59.8586, lon: 17.6389 },

  // Västmanland / Dalarna / Gävleborg
  { id: "vasteras", name: "Västerås", lat: 59.6099, lon: 16.5448 },
  { id: "falun", name: "Falun", lat: 60.6036, lon: 15.6250 },
  { id: "gavle", name: "Gävle", lat: 60.6749, lon: 17.1413 },

  // Värmland / Örebro
  { id: "karlstad", name: "Karlstad", lat: 59.3793, lon: 13.5036 },
  { id: "orebro", name: "Örebro", lat: 59.2753, lon: 15.2134 },

  // Norrland
  { id: "sundsvall", name: "Sundsvall", lat: 62.3908, lon: 17.3069 },
  { id: "ostersund", name: "Östersund", lat: 63.1792, lon: 14.6357 },
  { id: "umea", name: "Umeå", lat: 63.8258, lon: 20.2630 },
  { id: "skelleftea", name: "Skellefteå", lat: 64.7507, lon: 20.9528 },
  { id: "lulea", name: "Luleå", lat: 65.5848, lon: 22.1547 },
  { id: "kiruna", name: "Kiruna", lat: 67.8557, lon: 20.2251 },
];

