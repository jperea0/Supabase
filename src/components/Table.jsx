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


/*import { supabase } from "../supabaseClient";
import { useEffect, useState } from 'react';

export default function Table(){
    const [tData, setTableData] = useState([]);

    useEffect(() => {
     async function fetchTableData() {
      try {
        const { data, error } = await supabase
          .from("measurements")
          .select("id, created_at, station_id, temperature, humidity")
          .order("created_at", { ascending: false })
          .limit(10);

        if (error) {
          throw error;
        }

        setTableData(data);
      } catch (error) {
        console.error("Error al obtener datos de Supabase:", error.message);
      }
    }

    fetchTableData();
    const interval = setInterval(fetchTableData, 300000); // Actualiza cada 5 minutos

    return () => clearInterval(interval); // Limpia el intervalo cuando el componente se desmonta
  }, []);

    return (
      <div style={{ display: 'flex', flexDirection: 'row' }}>
          <div style={{ width: '40%' }}>
            <iframe style={{ width: "100%", border: 0 }}width="425" height="350" src="https://www.openstreetmap.org/export/embed.html?bbox=-103.69837939739229%2C19.248418407806984%2C-103.69634091854097%2C19.249902310432407&amp;layer=mapnik"></iframe>
            <br/><small><a href="https://www.openstreetmap.org/#map=19/19.24916/-103.69736">Ver el mapa más grande</a></small>
          </div>
          <div style={{ width: '60%' }}>
            <p>Table component</p> <br />
            <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '20px',}}>
              <thead style={{ backgroundColor: '#f2f2f2' }}>
                  <tr>
                      <th style={{ border: '1px solid #ccc', padding: '8px', textAlign: 'left', backgroundColor: '#333', color: 'white' }}>Station name</th>
                      <th style={{ border: '1px solid #ccc', padding: '8px', textAlign: 'left', backgroundColor: '#333', color: 'white' }}>Create Date</th>
                      <th style={{ border: '1px solid #ccc', padding: '8px', textAlign: 'left', backgroundColor: '#333', color: 'white' }}>Temperature</th>
                      <th style={{ border: '1px solid #ccc', padding: '8px', textAlign: 'left', backgroundColor: '#333', color: 'white' }}>Humidity</th>
                  </tr>
              </thead>
              <tbody>
                  {tData.map((measurement, index) => (
                      <tr key={index.id} style={{ backgroundColor: '#f2f2f2' }}>
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
}*/