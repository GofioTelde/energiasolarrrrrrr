import React from "react";

interface CompassProps {
  geographicSouth: number; // Cambiado de geographicNorth
  magneticSouth: number; // Cambiado de magneticNorth
  declination: number; // Declinación en grados
  declinationDirection: "E" | "W";
}

const Compass: React.FC<CompassProps> = ({
  geographicSouth,
  magneticSouth,
  declination,
  declinationDirection,
}) => {
  const radius = 140;
  const center = radius + 30;

  // Crear puntos cardinales con SUD en lugar de NORTE como principal
  const cardinalPoints = [
    { label: "S", angle: 180, color: "text-red-600", bgColor: "bg-red-500" },
    { label: "SO", angle: 225, color: "text-gray-700", bgColor: "bg-gray-500" },
    { label: "O", angle: 270, color: "text-gray-700", bgColor: "bg-gray-500" },
    { label: "NO", angle: 315, color: "text-gray-700", bgColor: "bg-gray-500" },
    { label: "N", angle: 0, color: "text-gray-700", bgColor: "bg-gray-500" },
    { label: "NE", angle: 45, color: "text-gray-700", bgColor: "bg-gray-500" },
    { label: "E", angle: 90, color: "text-gray-700", bgColor: "bg-gray-500" },
    { label: "SE", angle: 135, color: "text-gray-700", bgColor: "bg-gray-500" },
  ];

  // Convertir ángulo a coordenadas
  const angleToCoordinates = (angle: number, r: number) => {
    const rad = (angle - 90) * (Math.PI / 180);
    return {
      x: center + r * Math.cos(rad),
      y: center + r * Math.sin(rad),
    };
  };

  return (
    <div className="relative flex justify-center items-center">
      <div
        className="relative mx-auto w-full max-w-md"
        style={{ width: center * 2, height: center * 2 }}
      >
        <svg width={center * 2} height={center * 2} className="mx-auto">
          {/* Fondo del círculo */}
          <circle
            cx={center}
            cy={center}
            r={radius}
            fill="url(#compassGradient)"
            stroke="#e5e7eb"
            strokeWidth="2"
          />

          <defs>
            <linearGradient
              id="compassGradient"
              x1="0%"
              y1="0%"
              x2="100%"
              y2="100%"
            >
              <stop offset="0%" stopColor="#f8fafc" />
              <stop offset="100%" stopColor="#f1f5f9" />
            </linearGradient>
          </defs>

          {/* Líneas de grados */}
          {Array.from({ length: 72 }).map((_, i) => {
            const angle = i * 5;
            const isMajor = angle % 15 === 0;
            const start = angleToCoordinates(
              angle,
              radius - (isMajor ? 15 : 8)
            );
            const end = angleToCoordinates(angle, radius);
            return (
              <line
                key={i}
                x1={start.x}
                y1={start.y}
                x2={end.x}
                y2={end.y}
                stroke={isMajor ? "#94a3b8" : "#cbd5e1"}
                strokeWidth={isMajor ? 2 : 1}
              />
            );
          })}

          {/* Líneas cardinales principales - SUR resaltado */}
          {[0, 90, 180, 270].map((angle) => {
            const start = angleToCoordinates(angle, radius - 25);
            const end = angleToCoordinates(angle, radius);
            const isSouth = angle === 180;
            return (
              <line
                key={angle}
                x1={start.x}
                y1={start.y}
                x2={end.x}
                y2={end.y}
                stroke={isSouth ? "#dc2626" : "#64748b"}
                strokeWidth={isSouth ? 4 : 3}
                strokeDasharray={isSouth ? "none" : "5,5"}
              />
            );
          })}

          {/* Puntos cardinales */}
          {cardinalPoints.map((point, i) => {
            const pos = angleToCoordinates(point.angle, radius - 35);
            const isSouth = point.label === "S";
            return (
              <g key={i}>
                <circle
                  cx={pos.x}
                  cy={pos.y}
                  r={isSouth ? 24 : 18}
                  fill={isSouth ? "#fef2f2" : "#f8fafc"}
                  stroke={isSouth ? "#dc2626" : "#cbd5e1"}
                  strokeWidth={isSouth ? 2 : 1}
                />
                <text
                  x={pos.x}
                  y={pos.y}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  className={`font-bold ${isSouth ? "text-xl" : "text-sm"} ${
                    point.color
                  }`}
                >
                  {point.label}
                </text>
              </g>
            );
          })}

          {/* Centro */}
          <circle cx={center} cy={center} r="8" fill="#1e293b" />

          {/* Aguja SUR GEOGRÁFICO (rojo oscuro) */}
          <g>
            <line
              x1={center}
              y1={center}
              x2={angleToCoordinates(geographicSouth, radius - 40).x}
              y2={angleToCoordinates(geographicSouth, radius - 40).y}
              stroke="#dc2626"
              strokeWidth="5"
              strokeLinecap="round"
              strokeDasharray="10,5"
            />
            {/* Punta de flecha del sur geográfico */}
            <polygon
              points={`
                ${angleToCoordinates(geographicSouth, radius - 25).x},${
                angleToCoordinates(geographicSouth, radius - 25).y
              }
                ${angleToCoordinates(geographicSouth - 10, radius - 35).x},${
                angleToCoordinates(geographicSouth - 10, radius - 35).y
              }
                ${angleToCoordinates(geographicSouth + 10, radius - 35).x},${
                angleToCoordinates(geographicSouth + 10, radius - 35).y
              }
              `}
              fill="#dc2626"
              stroke="#dc2626"
              strokeWidth="1"
            />
            <circle cx={center} cy={center} r="6" fill="#dc2626" />

            {/* Etiqueta SUR GEOGRÁFICO */}
            <text
              x={angleToCoordinates(geographicSouth, radius - 55).x}
              y={angleToCoordinates(geographicSouth, radius - 55).y}
              textAnchor="middle"
              dominantBaseline="middle"
              className="text-xs font-bold"
              fill="#dc2626"
            >
              SUR GEOGRÁFICO
            </text>
          </g>

          {/* Aguja SUR MAGNÉTICO (azul) */}
          <g>
            <line
              x1={center}
              y1={center}
              x2={angleToCoordinates(magneticSouth, radius - 20).x}
              y2={angleToCoordinates(magneticSouth, radius - 20).y}
              stroke="#3b82f6"
              strokeWidth="4"
              strokeLinecap="round"
            />
            {/* Punta de flecha del sur magnético */}
            <polygon
              points={`
                ${angleToCoordinates(magneticSouth, radius - 15).x},${
                angleToCoordinates(magneticSouth, radius - 15).y
              }
                ${angleToCoordinates(magneticSouth - 8, radius - 25).x},${
                angleToCoordinates(magneticSouth - 8, radius - 25).y
              }
                ${angleToCoordinates(magneticSouth + 8, radius - 25).x},${
                angleToCoordinates(magneticSouth + 8, radius - 25).y
              }
              `}
              fill="#3b82f6"
              stroke="#3b82f6"
              strokeWidth="1"
            />
            <circle cx={center} cy={center} r="4" fill="#3b82f6" />

            {/* Etiqueta SUR MAGNÉTICO */}
            <text
              x={angleToCoordinates(magneticSouth, radius - 40).x}
              y={angleToCoordinates(magneticSouth, radius - 40).y}
              textAnchor="middle"
              dominantBaseline="middle"
              className="text-xs font-bold"
              fill="#3b82f6"
            >
              SUR MAGNÉTICO
            </text>
          </g>

          {/* Ángulo de declinación */}
          {Math.abs(declination) > 0.5 && (
            <path
              d={`
                M ${center} ${center}
                L ${angleToCoordinates(geographicSouth, radius - 50).x} ${
                angleToCoordinates(geographicSouth, radius - 50).y
              }
                A ${radius - 50} ${radius - 50} 0 ${declination > 0 ? 1 : 0} 1
                ${angleToCoordinates(magneticSouth, radius - 50).x} ${
                angleToCoordinates(magneticSouth, radius - 50).y
              }
                Z
              `}
              fill="#8b5cf6"
              fillOpacity="0.15"
              stroke="#8b5cf6"
              strokeWidth="1"
              strokeDasharray="4,4"
            />
          )}

          {/* Texto de declinación en el centro */}
          <text
            x={center}
            y={center}
            textAnchor="middle"
            dominantBaseline="middle"
            className="font-bold"
            fontSize="14"
            fill="#1e40af"
          >
            {declination.toFixed(2)}° {declinationDirection}
          </text>
          <text
            x={center}
            y={center + 20}
            textAnchor="middle"
            dominantBaseline="middle"
            className="text-xs font-medium"
            fill="#475569"
          >
            Declinación
          </text>
        </svg>

        {/* Indicadores de sur */}
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-2">
          <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 dark:from-yellow-600 dark:to-yellow-700 text-white text-xs font-bold px-3 py-1 rounded-full shadow-sm">
            NORTE GEOGRÁFICO (0°)
          </div>
        </div>
        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-2">
          <div className="bg-gradient-to-r from-red-500 to-red-600 dark:from-red-600 dark:to-red-700 text-white text-xs font-bold px-3 py-1 rounded-full shadow-sm">
            SUR GEOGRÁFICO (180°)
          </div>
        </div>
      </div>
    </div>
  );
};

export default Compass;
