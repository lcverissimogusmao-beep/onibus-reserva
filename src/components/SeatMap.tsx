'use client';

import React from 'react';

// Exemplo de componente para o layout do autocarro Double Decker
export default function SeatMap({ seats, selectedSeats, onSelectSeat }) {
  // Assentos do Piso Superior (1 a 48 + DD + Banheiro)
  // Lado esquerdo: pares (1, 3, 5...), Lado direito: pares (2, 4, 6...) mas organizados por filas
  const upperFloorRows = [
    { left: [1, 5], right: [3, 4] },   // Fila 1 (Esquerda: 1, 5; Direita: 3, 4 conforme a imagem)
    { left: [5, 6], right: [8, 7] },
    { left: [9, 10], right: [12, 11] },
    { left: [13, 14], type: 'stairs', right: ['DD', 'DD'] }, // Espaço da Escada DD
    { left: [15, 16], right: [20, 19] },
    { left: [17, 18], right: [24, 23] },
    { left: [21, 22], right: [28, 27] },
    { left: [25, 26], right: [32, 31] },
    { left: [29, 30], right: [36, 35] },
    { left: [33, 34], right: [40, 39] },
    { left: [37, 38], right: [44, 43] },
    { left: [41, 42], type: 'bathroom', right: ['BANHEIRO', 'BANHEIRO'] }, // Banheiro
    { left: [45, 46], right: null },
    { left: [47, 48], right: null },
  ];

  // Assentos do Piso Inferior (49 a 60)
  const lowerFloorRows = [
    { left: [49, 53, 57], right: [52, 56, 60] }, // Ajustado para as 3 filas traseiras da imagem
    { left: [50, 54, 58], right: [51, 55, 59] },
  ];

  return (
    <div className="flex flex-col items-center p-6 bg-slate-900 text-white rounded-xl shadow-xl max-w-md mx-auto">
      {/* 🚍 CABINE DO MOTORISTA */}
      <div className="w-full flex justify-between items-center bg-slate-800 p-3 rounded-t-3xl border-b-2 border-slate-700 mb-6">
        <span className="text-xs tracking-wider text-slate-400 font-semibold">FRENTE / MOTORISTA</span>
        <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-xs"> steering </div>
      </div>

      {/* 🏢 PISO SUPERIOR */}
      <div className="w-full bg-slate-800/60 p-4 rounded-xl border border-slate-700 mb-6">
        <h3 className="text-center text-amber-400 font-bold mb-4 tracking-wide text-sm border-b border-slate-700 pb-2">
          PISO SUPERIOR
        </h3>

        <div className="space-y-2">
          {/* Fila 1 e 2 */}
          <div className="grid grid-cols-5 gap-2 items-center text-center">
            <Seat id={1} /> <Seat id={2} />
            <div className="text-slate-600 text-xs"> corredor </div>
            <Seat id={4} /> <Seat id={3} />
          </div>
          <div className="grid grid-cols-5 gap-2 items-center text-center">
            <Seat id={5} /> <Seat id={6} />
            <div className="text-slate-600 text-xs">|</div>
            <Seat id={8} /> <Seat id={7} />
          </div>
          <div className="grid grid-cols-5 gap-2 items-center text-center">
            <Seat id={9} /> <Seat id={10} />
            <div className="text-slate-600 text-xs">|</div>
            <Seat id={12} /> <Seat id={11} />
          </div>

          {/* Bloco DD (Escada) */}
          <div className="grid grid-cols-5 gap-2 items-center text-center bg-red-900/40 p-2 rounded border border-red-500/30">
            <Seat id={13} /> <Seat id={14} />
            <div className="text-red-400 text-xs font-bold">ESCADA</div>
            <div className="col-span-2 bg-red-600 text-white text-xs font-bold py-2 rounded flex items-center justify-center">
              DD
            </div>
          </div>

          {/* Filas seguintes do Piso Superior */}
          {[
            { l1: 15, l2: 16, r1: 20, r2: 19 },
            { l1: 17, l2: 18, r1: 24, r2: 23 },
            { l1: 21, l2: 22, r1: 28, r2: 27 },
            { l1: 25, l2: 26, r1: 32, r2: 31 },
            { l1: 29, l2: 30, r1: 36, r2: 35 },
            { l1: 33, l2: 34, r1: 40, r2: 39 },
            { l1: 37, l2: 38, r1: 44, r2: 43 },
          ].map((row, index) => (
            <div key={index} className="grid grid-cols-5 gap-2 items-center text-center">
              <Seat id={row.l1} /> <Seat id={row.l2} />
              <div className="text-slate-600 text-xs">|</div>
              <Seat id={row.r1} /> <Seat id={row.r2} />
            </div>
          ))}

          {/* Bloco BANHEIRO */}
          <div className="grid grid-cols-5 gap-2 items-center text-center bg-amber-900/30 p-2 rounded border border-amber-500/30 mt-3">
            <Seat id={45} /> <Seat id={46} />
            <div className="text-amber-400 text-xs font-bold">WC</div>
            <div className="col-span-2 bg-amber-600 text-white text-xs font-bold py-2 rounded flex items-center justify-center">
              BANHEIRO 🚻
            </div>
          </div>
          <div className="grid grid-cols-5 gap-2 items-center text-center">
            <Seat id={47} /> <Seat id={48} />
            <div className="text-slate-600 text-xs">|</div>
            <div className="col-span-2"></div>
          </div>
        </div>
      </div>

      {/* 🔻 DIVISÃO DE PISOS */}
      <div className="w-full text-center my-2 border-t border-dashed border-slate-500 pt-2">
        <span className="text-xs uppercase tracking-widest text-amber-400 font-bold bg-slate-800 px-3 py-1 rounded-full border border-slate-700">
          Piso Inferior
        </span>
      </div>

      {/* 🏢 PISO INFERIOR (Assentos 49 a 60) */}
      <div className="w-full bg-slate-800/60 p-4 rounded-xl border border-slate-700 mt-2">
        <div className="space-y-2">
          <div className="grid grid-cols-4 gap-2 items-center text-center">
            <Seat id={49} /> <Seat id={50} />
            <Seat id={52} /> <Seat id={51} />
          </div>
          <div className="grid grid-cols-4 gap-2 items-center text-center">
            <Seat id={53} /> <Seat id={54} />
            <Seat id={56} /> <Seat id={55} />
          </div>
          <div className="grid grid-cols-4 gap-2 items-center text-center">
            <Seat id5={57} id={57} /> <Seat id={58} />
            <Seat id={60} /> <Seat id={59} />
          </div>
        </div>
      </div>
    </div>
  );
}

// Subcomponente auxiliar para estilizar o botão do assento
function Seat({ id }: { id: number }) {
  return (
    <button className="bg-yellow-500 hover:bg-yellow-400 text-slate-950 font-bold text-xs py-2 rounded shadow transition-all border-b-2 border-red-600">
      {id}
    </button>
  );
}