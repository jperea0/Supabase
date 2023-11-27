import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { supabase } from "../supabaseClient";

export default function Table(){
  const [estaciones, setEstaciones] = useState([]);
  const [tData, setTableData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Obtener datos para la tabla
        const { data: tData, error: tableError } = await supabase
        .from("measurements")
        .select("id, created_at, station_id, temperature, humidity, latitude, longitude")
        .order('created_at', { ascending: false })
        .limit(10);

        if (tableError) {
          throw tableError;
        }

        setTableData(tData);

        // Obtener datos para el mapa
        const { data: mapData, error: mapError } = await supabase
          .from('measurements')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(1);

        if (mapError) {
          throw mapError;
        }

        setEstaciones(mapData);
      } catch (error) {
        console.error("Error al obtener datos desde Supabase:", error.message);
      }
    };

    fetchData();
  }, []);

  // Icono marcador del mapa
  const customIcon = new L.Icon({
    iconUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTrSXlMEEZyhwNtl42MP6dw5d65Ugw9O9IBeEw1fL8dlxxs1SdoInyuMWWnngR74qORcDg&usqp=CAU",
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
  });

  return (
    <div style={{ display: "flex" }}>
      <MapContainer
        center={{ lat: 19.249902310432407, lng: -103.69634091854097 }}
        zoom={16}
        style={{ height: "500px", width: "60%" }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        {estaciones.map((estacion) => (
          <Marker
            key={estacion.id}
            icon={customIcon}
            position={[estacion.latitude, estacion.longitude]}
          >
            <Popup>
              <div>
                <h3>Estación Meteorológica</h3>
                <p>ID: {estacion.id}</p>
                <p>Temperatura: {estacion.temperature}</p>
                <p>Humedad: {estacion.humidity}</p>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>

<div style={{ width: '60%' }}>
            <b><p style={{ textAlign: 'center', fontSize: '1.3em', fontWeight: 'bold',}}>Table component</p> <br /></b>
            <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '20px', margin: "12.5px"}}>
              <thead style={{ backgroundColor: '#f2f2f2' }}>
                  <tr>
                      <th style={{ border: '1px solid #ccc', padding: '8px', textAlign: 'left', backgroundColor: '#333', color: 'white' }}>Station name</th>
                      <th style={{ border: '1px solid #ccc', padding: '8px', textAlign: 'left', backgroundColor: '#333', color: 'white' }}>Create Date</th>
                      <th style={{ border: '1px solid #ccc', padding: '8px', textAlign: 'left', backgroundColor: '#333', color: 'white' }}>Temperature</th>
                      <th style={{ border: '1px solid #ccc', padding: '8px', textAlign: 'left', backgroundColor: '#333', color: 'white' }}>Humidity</th>
                  </tr>
              </thead>
              <tbody>
                  {tData.map((measurement) => (
                      <tr key={measurement.id} style={{ backgroundColor: '#f2f2f2' }}>
                          <td style={{ border: '1px solid #ccc', padding: '8px', textAlign: 'left' }}>{measurement.station_id}</td>
                          <td style={{ border: '1px solid #ccc', padding: '8px', textAlign: 'left' }}>{measurement.created_at}</td>
                          <td style={{ border: '1px solid #ccc', padding: '8px', textAlign: 'left' }}>{measurement.temperature}</td>
                          <td style={{ border: '1px solid #ccc', padding: '8px', textAlign: 'left' }}>{measurement.humidity}</td>
                      </tr>
                  ))}
              </tbody>
          </table>
          </div>
    </div>
  );
}
