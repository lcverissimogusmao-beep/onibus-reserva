'use client';

import React, { useState, useEffect } from 'react';
import SeatMap from '@/components/SeatMap';
import { supabase } from '@/lib/supabase'; // Ajusta o caminho conforme o teu projeto se necessário

export default function Home() {
  const [selectedSeats, setSelectedSeats] = useState<number[]>([]);
  const [seatsFromDB, setSeatsFromDB] = useState<{ id: number; status: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const [passengerName, setPassengerName] = useState('');

  // Função para carregar o estado dos assentos do Supabase
  useEffect(() => {
    async function fetchSeats() {
      const { data, error } = await supabase.from('seats').select('*');
      if (data && !error) {
        setSeatsFromDB(data);
      }
    }
    fetchSeats();
  }, []);

  // Função acionada ao clicar num assento
  const handleSelectSeat = (seatId: number) => {
    if (selectedSeats.includes(seatId)) {
      setSelectedSeats(selectedSeats.filter(id => id !== seatId));
    } else {
      setSelectedSeats([...selectedSeats, seatId]);
    }
  };

  // Função para confirmar a reserva
  const handleBooking = async () => {
    if (selectedSeats.length === 0) {
      alert('Por favor, seleciona pelo menos um assento.');
      return;
    }
    if (!passengerName.trim()) {
      alert('Por favor, insere o nome do passageiro.');
      return;
    }

    setLoading(true);

    try {
      // Atualiza os assentos na base de dados do Supabase como ocupados
      for (const seatId of selectedSeats) {
        await supabase
          .from('seats')
          .upsert({ id: seatId, status: 'occupied', passenger: passengerName });
      }

      alert('Reserva efetuada com sucesso!');
      setSelectedSeats([]);
      setPassengerName('');
      
      // Recarrega os assentos
      const { data } = await supabase.from('seats').select('*');
      if (data) setSeatsFromDB(data);

    } catch (err) {
      console.error(err);
      alert('Erro ao realizar a reserva.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-950 text-white py-10 px-4">
      <h1 className="text-2xl font-bold text-center mb-6 text-amber-400">Reserva de Assentos - Autocarro</h1>
      
      {/* Mapa interativo */}
      <SeatMap 
        seats={seatsFromDB} 
        selectedSeats={selectedSeats} 
        onSelectSeat={handleSelectSeat} 
      />

      {/* Painel de Confirmação */}
      <div className="max-w-md mx-auto mt-6 p-4 bg-slate-900 rounded-xl border border-slate-800 shadow-xl">
        <p className="text-sm text-slate-400 mb-2">Assentos selecionados:</p>
        <p className="font-bold text-amber-400 text-lg mb-4">
          {selectedSeats.length > 0 ? selectedSeats.join(', ') : 'Nenhum selecionado'}
        </p>

        <div className="mb-4">
          <label className="block text-xs text-slate-400 mb-1">Nome do Passageiro:</label>
          <input 
            type="text" 
            value={passengerName}
            onChange={(e) => setPassengerName(e.target.value)}
            placeholder="Digite o seu nome..."
            className="w-full p-2 rounded bg-slate-800 border border-slate-700 text-white text-sm focus:outline-none focus:border-amber-500"
          />
        </div>

        <button 
          onClick={handleBooking}
          disabled={loading || selectedSeats.length === 0}
          className="w-full bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-slate-950 font-bold py-2 rounded transition-all shadow"
        >
          {loading ? 'A processar...' : 'Confirmar Reserva'}
        </button>
      </div>
    </main>
  );
}