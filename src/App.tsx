import { MapContainer, Polygon, TileLayer } from 'react-leaflet';
import { useState } from 'react'
import { LatLngExpression, LatLngTuple } from 'leaflet';

class LatLong {
  public lat: number
  public long: number

  public constructor(lat: number, long: number) {
    this.lat = lat;
    this.long = long;
  }
}

function App() {

  const [initialPositions, setInitialPositions] = useState<LatLong[]>([])
  const [csvFile, setCsvFile] = useState<File>();
  const [center, setCenter] = useState<LatLngTuple>([56.13183278080259, 10.199092388367777])
  const [positions, setPositions] = useState<LatLngExpression[]>([]);

  const normal = () => {
    console.log(initialPositions);
    let paths: LatLngExpression[] = initialPositions.map(item => {
      return [item.lat, item.long]
    })

    setPositions(paths);
  }

  const median = () => {
    console.log(initialPositions);
    const neighbors = 2;
    let newPositions: LatLngExpression[] = []

    let locations = initialPositions;
    let bound = locations.length;

    console.log(bound, locations, initialPositions);

    for (let i: number = 0; i < bound; i++) {
      let pointsX : Number[] = [];
      let pointsY : Number[] = [];

      console.log(pointsX, pointsY);

      for (let l: number = Math.abs(neighbors) * -1; l <= neighbors; l++) {
        let index = (l + i) % bound;
        if (index < 0)
          index = bound + index;

        pointsX.push(locations[index].lat)
        pointsY.push(locations[index].long)
      }
      console.log(pointsX, pointsY)
      return;
    }
  }

  const mean = () => {

  }

  const submit = () => {
    const file = csvFile;
    const reader = new FileReader();

    reader.onload = function (e) {
      if (e.target == null || typeof (e.target.result) != "string")
        return;
      const text: string = e.target.result;
      const positions = text.split("\n").slice(1).map(line => {
        let items = line.split(",");
        const x = Number(items[3])
        const y = Number(items[4])

        return new LatLong(x, y)
      });
      const valid = positions.filter(item => !(Number.isNaN(item.lat) || Number.isNaN(item.long)));
      setInitialPositions(valid);

      console.log(initialPositions)

      let averageX: number = valid.map(x => x.lat).reduce((a, b) => a + b) / valid.length;
      let averageY: number = valid.map(y => y.long).reduce((a, b) => a + b) / valid.length;
      setCenter([averageX, averageY])
      normal();
    }
    if (file == null)
      return
    reader.readAsText(file);
  }


  return <div>
    <MapContainer style={{ height: "80vh" }} center={center} zoom={13} scrollWheelZoom={false}>
      <TileLayer
        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Polygon pathOptions={{ color: "lime", fillColor: 'blue' }} positions={positions} />
    </MapContainer>
    <div style={{ margin: "2px" }}>
      <form>
        <input
          type='file'
          accept='.csv'
          id='csvFile'
          onChange={(e) => {
            if (!e.target.files)
              return;
            setCsvFile(e.target!.files[0])
          }}
        >
        </input>
        <button type="submit"
          onClick={(e) => {
            e.preventDefault()
            if (csvFile) submit()
          }}>
          Load
        </button>
      </form>
      <button onClick={() => median()} >Median</button>
      <button>Reset</button>
      <button>Reset</button>
    </div>
  </div>;
}

export default App;
