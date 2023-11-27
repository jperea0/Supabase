import { supabase } from "../supabaseClient"; 
import { useEffect, useState } from "react";
import * as tf from "@tensorflow/tfjs";
import Plot from "react-plotly.js"; 


// Componente funcional Forecasting
export default function Forecasting () {
  // Estados para almacenar predicciones y datos de grafica
  const [tempepre, setTempePre] = useState(null);
  const [himidipre, setHumidiPre] = useState(null);
  const [tempeDataPlot, setTempeDataPlot] = useState([]);
  const [humDataPlot, setHumDataPlot] = useState([]);

  useEffect(() => {
    const predictData = async () => {
      try {
        const { data: Datos, error: Error } = await supabase
          .from("measurements")
          .select("temperature, humidity")
          .order("created_at", { ascending: false })
          .limit(100);

        if (Error) {
          throw Error;
        }

        // datos para TensorFlow
        const inputData = Datos.map(row => [row.temperature, row.humidity]);
        const xs = tf.tensor2d(inputData, [Datos.length, 2]);
        const ys = tf.tensor2d(inputData, [Datos.length, 2]);

        // Definir y compilar un modelo de red neuronal secuencial con TensorFlow
        const model = tf.sequential();
        model.add(tf.layers.dense({ units: 8, inputShape: [2], activation: 'relu' }));
        model.add(tf.layers.dense({ units: 16, activation: 'relu' }));
        model.add(tf.layers.dense({ units: 2 }));
        model.compile({ loss: 'meanSquaredError', optimizer: 'adam' });

        // Entrenar el modelo con los datos de entrada
        await model.fit(xs, ys, { epochs: 100, batchSize: 32 });

        // Realizar prediccion basado en los últimos datos recibidos
        const ultimaTemp = Datos[Datos.length - 1].temperature;
        const ultimaHum = Datos[Datos.length - 1].humidity;
        const predictionInput = tf.tensor2d([[ultimaTemp, ultimaHum]]);
        const predictions = model.predict(predictionInput);

        const [prediccionTemp, prediccionHum] = predictions.arraySync()[0];

        // Establecer las predicciones en los estados correspondientes
        setTempePre(prediccionTemp);
        setHumidiPre(prediccionHum);

        // Preparar datos para graficar
        const temperaturePlot = Datos.map(temp => temp.temperature);
        const humidityPlot = Datos.map(hum => hum.humidity);

        // Establecer datos de temperatura y humedad en los estados respectivos
        setTempeDataPlot(temperaturePlot);
        setHumDataPlot(humidityPlot);
      } catch (error) {
        console.error("Error predicting:", error);
      }
    };

    predictData(); 
  }, []); 

  return (
    <div>
      <h2>Forecasting</h2>
      <p>Mediante TensorFlow, podemos predecir la temperatura y humedad del dia siguiente, en base a los datos obtenidos de la tabla de supabase y entrenando a tensorflow.</p>


      {tempepre !== null && himidipre !== null && (
        <div>
          <h3>Predictions:</h3>
          <p>Temperature: {tempepre} °C</p>
          <p>Humidity: {himidipre}%</p>
        </div>
      )}

      <h3>gráfico de dispersión de temperatura y humedad</h3>
      <Plot
        data={[
          {
            y: tempeDataPlot,
            type: 'scatter',
            mode: 'markers',
            marker: { color: 'green' },
            name: 'Temperature'
          }
        ]}
        layout={{ width: 1300, height: 400, title: 'Gráfica de Temperatura',plot_bgcolor: "#c997aa"}}
      />

      <Plot
        data={[
          {
            y: humDataPlot,
            type: 'scatter',
            mode: 'markers',
            marker: { color: 'black' },
            name: 'Humidity',
          }
        ]}
        layout={{ width: 1300, height: 400, title: 'Gráfica de Humedad', plot_bgcolor: '#8cc8de'}}
      />
    </div>
  );
}