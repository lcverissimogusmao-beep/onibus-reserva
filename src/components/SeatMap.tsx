'use client';

import React from 'react';

interface SeatMapProps {
  seats?: { id: number; status: string }[];
  selectedSeats?: number[];
  onSelectSeat?: (seatId: number) => void;
}

export default function SeatMap({ seats = [], selectedSeats = [], onSelectSeat }: SeatMapProps) {
  return (
    <div className="flex flex-col items-center p-6 bg-slate-900 text-white rounded-xl shadow-xl max-w-md mx-auto">
      {/* 🚍 CABINE DO MOTORISTA */}
      <div className="w-full flex justify-between items-center bg-slate-800 p-3 rounded-t-3xl border-b-2 border-slate-700 mb-6">
        <span className="text-xs tracking-wider text-slate-400 font-semibold">FRENTE / MOTORISTA</span>
        <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-xs"> 🚗 </div>
      </div>

      {/* 🏢 PISO SUPERIOR */}
      <div className="w-full bg-slate-800/60 p-4 rounded-xl border border-slate-700 mb-6">
        <h3 className="text-center text-amber-400 font-bold mb-4 tracking-wide text-sm border-b border-slate-700 pb-2">
          PISO SUPERIOR
        </h3>

        <div className="space-y-2">
          {/* Fila 1 */}
          <div className="grid grid-cols-5 gap-2 items-center text-center">
            <Seat id={1} seats={seats} selectedSeats={selectedSeats} onClick={onSelectSeat} />
            <Seat id={2} seats={seats} selectedSeats={selectedSeats} onClick={onSelectSeat} />
            <div className="text-slate-600 text-xs">|</div>
            <Seat id={4} seats={seats} selectedSeats={selectedSeats} onClick={onSelectSeat} />
            <Seat id={3} seats={seats} selectedSeats={selectedSeats} onClick={onSelectSeat} />
          </div>
          <div className="grid grid-cols-5 gap-2 items-center text-center">
            <Seat id={5} seats={seats} selectedSeats={selectedSeats} onClick={onSelectSeat} />
            <Seat id={6} seats={seats} selectedSeats={selectedSeats} onClick={onSelectSeat} />
            <div className="text-slate-600 text-xs">|</div>
            <Seat id={8} seats={seats} selectedSeats={selectedSeats} onClick={onSelectSeat} />
            <Seat id={7} seats={seats} selectedSeats={selectedSeats} onClick={onSelectSeat} />
          </div>
          <div className="grid grid-cols-5 gap-2 items-center text-center">
            <Seat id={9} seats={seats} selectedSeats={selectedSeats} onClick={onSelectSeat} />
            <Seat id={10} seats={seats} selectedSeats={selectedSeats} onClick={onSelectSeat} />
            <div className="text-slate-600 text-xs">|</div>
            <Seat id={12} seats={seats} selectedSeats={selectedSeats} onClick={onSelectSeat} />
            <Seat id={11} seats={seats} selectedSeats={selectedSeats} onClick={onSelectSeat} />
          </div>

          {/* Bloco DD (Escada) */}
          <div className="grid grid-cols-5 gap-2 items-center text-center bg-red-900/40 p-2 rounded border border-red-500/30">
            <Seat id={13} seats={seats} selectedSeats={selectedSeats} onClick={onSelectSeat} />
            <Seat id={14} seats={seats} selectedSeats={selectedSeats} onClick={onSelectSeat} />
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
              <Seat id={row.l1} seats={seats} selectedSeats={selectedSeats} onClick={onSelectSeat} />
              <Seat id={row.l2} seats={seats} selectedSeats={selectedSeats} onClick={onSelectSeat} />
              <div className="text-slate-600 text-xs">|</div>
              <Seat id={row.r1} seats={seats} selectedSeats={selectedSeats} onClick={onSelectSeat} />
              <Seat id={row.r2} seats={seats} selectedSeats={selectedSeats} onClick={onSelectSeat} />
            </div>
          ))}

          {/* Bloco BANHEIRO */}
          <div className="grid grid-cols-5 gap-2 items-center text-center bg-amber-900/30 p-2 rounded border border-amber-500/30 mt-3">
            <Seat id={45} seats={seats} selectedSeats={selectedSeats} onClick={onSelectSeat} />
            <Seat id={46} seats={seats} selectedSeats={selectedSeats} onClick={onSelectSeat} />
            <div className="text-amber-400 text-xs font-bold">WC</div>
            <div className="col-span-2 bg-amber-600 text-white text-xs font-bold py-2 rounded flex items-center justify-center">
              BANHEIRO 🚻
            </div>
          </div>
          <div className="grid grid-cols-5 gap-2 items-center text-center">
            <Seat id={47} seats={seats} selectedSeats={selectedSeats} onClick={onSelectSeat} />
            <Seat id={48} seats={seats} selectedSeats={selectedSeats} onClick={onSelectSeat} />
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
            <Seat id={49} seats={seats} selectedSeats={selectedSeats} onClick={onSelectSeat} />
            <Seat id={50} seats={seats} selectedSeats={selectedSeats} onClick={onSelectSeat} />
            <Seat id={52} seats={seats} selectedSeats={selectedSeats} onClick={onSelectSeat} />
            <Seat id={51} seats={seats} selectedSeats={selectedSeats} onClick={onSelectSeat} />
          </div>
          <div className="grid grid-cols-4 gap-2 items-center text-center">
            <Seat id={53} seats={seats} selectedSeats={selectedSeats} onClick={onSelectSeat} />
            <Seat id={54} seats={seats} selectedSeats={selectedSeats} onClick={onSelectSeat} />
            <Seat id={56} seats={seats} selectedSeats={selectedSeats} onClick={onSelectSeat} />
            <Seat id={55} seats={seats} selectedSeats={selectedSeats} onClick={onSelectSeat} />
          </div>
          <div className="grid grid-cols-4 gap-2 items-center text-center">
            <Seat id={57} seats={seats} selectedSeats={selectedSeats} onClick={onSelectSeat} />
            <Seat id={58} seats={seats} selectedSeats={selectedSeats} onClick={onSelectSeat} />
            <Seat id={60} seats={seats} selectedSeats={selectedSeats} onClick={onSelectSeat} />
            <Seat id={59} seats={seats} selectedSeats={selectedSeats} onClick={onSelectSeat} />
          </div>
        </div>
      </div>
    </div>
  );
}

interface SeatProps {
  id: number;
  seats?: { id: number; status: string }[];
  selectedSeats?: number[];
  onClick?: (id: number) => void;
}

function Seat({ id, seats = [], selectedSeats = [], onClick }: SeatProps) {
  // Verifica se o assento está ocupado na base de dados ou selecionado localmente
  const seatData = seats.find((s) => s.id === id);
  const isOccupied = seatData?.status === 'occupied';
  const isSelected = selectedSeats.includes(id);

  let bgColor = "bg-yellow-500 hover:bg-yellow-400 text-slate-950 border-b-2 border-red-600";
  
  if (isOccupied) {
    bgColor = "bg-red-700 text-white cursor-not-allowed opacity-60";
  } else if (isSelected) {
    bgColor = "bg-green-600 text-white border-b-2 border-green-800 scale-95";
  }

  return (
    <button 
      disabled={isOccupied}
      onClick={() => onClick && onClick(id)}
      className={`font-bold text-xs py-2 rounded shadow transition-all w-full ${bgColor}`}
    >
      {id}
    </button>
  );
}