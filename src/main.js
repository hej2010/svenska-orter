const readXlsxFile = require('read-excel-file/node');
const proj4 = require('proj4');
const fs = require('fs');

// Hämta filen "Statistiska tätorter 2020, befolkning, landareal, befolkningstäthet per tätort" från https://www.scb.se/hitta-statistik/statistik-efter-amne/miljo/markanvandning/tatorter-och-smaorter/
// döp om filen till "data-scb.xlsx" och ta bort de första 8 raderna och ta bort newlines i titeln på kolumnerna som används nedan:

const schema = {
    'Länsnamn': {
        prop: 'county'
    },
    'Kommunnamn': {
        prop: 'municipality'
    },
    'Beteckning på tätort': {
        prop: 'locality'
    },
    'Befolkning 2020-12-31': {
        prop: 'population'
    },
    'x-koordinat Sweref 99TM': {
        prop: 'x-sweref99tm'
    },
    'y-koordinat Sweref 99TM': {
        prop: 'y-sweref99tm'
    }
}

readXlsxFile('./src/data-scb.xlsx', { schema }).then(({ rows, errors }) => {
    const fromProjection = '+proj=utm +zone=33 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs +type=crs'; // https://epsg.io/3006
    const toProjection = "+proj=longlat +datum=WGS84 +no_defs +type=crs"; // https://epsg.io/4326

    for (const r of rows) {
        const xSweref = r["x-sweref99tm"];
        const ySweref = r["y-sweref99tm"];

        const latLong = proj4(fromProjection, toProjection, [xSweref, ySweref]);
        r.lat = Math.round(latLong[1] * 10000) / 10000;
        r.lon = Math.round(latLong[0] * 10000) / 10000;
        r.locality = r.locality.replace("*", "");
    }

    rows.sort((a, b) => (a.population < b.population ? 1 : -1));

    fs.writeFile('./src/svenska-orter.json', JSON.stringify(rows, null, 2), { encoding: "utf8" }, (err) => {
        if (err) {
            console.log(err);
        }
    });
    return rows;
}).then(rows => {
    let csv = "Population,Locality,Municipality,County,Latitude,Longitude,X-Sweref99TM,Y-Sweref99TM\n";
    for (let i = 0; i < rows.length; i++) {
        const r = rows[i];
        csv += `${r.population},"${r.locality}",${r.municipality},${r.county},${r.lat},${r.lon},${r["x-sweref99tm"]},${r["y-sweref99tm"]}${i + 1 < rows.length ? '\n': ''}`;
    }
    fs.writeFile('./src/svenska-orter.csv', csv, (err) => {
        if (err) {
            console.log(err);
        }
    });
});