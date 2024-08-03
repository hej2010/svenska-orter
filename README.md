# Svenska orter & städer
Svenska tätorter (med minst 200 invånare) i `.csv` och `.json` med koordinater. Swedish cities (with >= 200 population) in `.csv` and `.json` format with coordinates.

Source data is from [SCB](https://www.scb.se/mi0810) (2020).
Coordinates are converted from the given Sweref 99 TM to regular latitude/longitude using [proj4](https://github.com/proj4js/proj4js).

## Data format
Data is ordered by population.

### CSV
Population | Locality | Municipality | County | Latitude | Longitude | X-Sweref99TM | Y-Sweref99TM
--- | --- | --- | --- | --- | --- | --- | ---
1617407|Stockholm|Stockholm|Stockholm|59.3202|17.9545|668127.86|6579433.5
607882|Göteborg|Göteborg|Västra Götaland|57.657|11.9946|320691.15|6394498.93
325069|Malmö|Malmö|Skåne|55.5968|13.0123|374755.84|6163000.44

### JSON
```json
{
  "county": "Västra Götaland",
  "municipality": "Göteborg",
  "locality": "Göteborg",
  "population": 607882,
  "x-sweref99tm": 320691.15,
  "y-sweref99tm": 6394498.93,
  "lat": 57.657,
  "lon": 11.9946
}
```
