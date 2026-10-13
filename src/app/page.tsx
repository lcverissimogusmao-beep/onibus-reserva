'use client';

import React, { useState, useEffect } from 'react';
import SeatMap from '@/components/SeatMap';
import { supabase } from '@/lib/supabase';

const SeatMapComponent = SeatMap as React.ComponentType<any>;

export default function Home() {
  const [selectedSeats, setSelectedSeats] = useState<number[]>([]);
  const [seatsFromDB, setSeatsFromDB] = useState<{ id: number; status: string; passenger?: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const [passengerName, setPassengerName] = useState('');
  
  // Estados para o modo Administrador
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [adminPassword, setAdminPassword] = useState('');
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);

  // Função para carregar os assentos da base de dados
  const fetchSeats = async () => {
    const { data, error } = await supabase.from('seats').select('*');
    if (data && !error) {
      setSeatsFromDB(data);
    }
  };

  useEffect(() => {
    fetchSeats();
  }, []);

  // Selecionar ou desselionar assento localmente
  const handleSelectSeat = (seatId: number) => {
    const seatData = seatsFromDB.find((s) => s.id === seatId);
    if (seatData?.status === 'occupied') {
      alert('Este assento já está ocupado!');
      return;
    }

    if (selectedSeats.includes(seatId)) {
      setSelectedSeats(selectedSeats.filter(id => id !== seatId));
    } else {
      setSelectedSeats([...selectedSeats, seatId]);
    }
  };

  // Confirmar reserva e enviar para o Supabase
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
      for (const seatId of selectedSeats) {
        // Tenta atualizar se já existir
        const { error: updateError } = await supabase
          .from('seats')
          .update({ status: 'occupied', passenger: passengerName })
          .eq('id', seatId);

        // Se não existir, insere
        if (updateError) {
          await supabase
            .from('seats')
            .insert({ id: seatId, status: 'occupied', passenger: passengerName });
        }
      }

      alert('Reserva efetuada com sucesso!');
      setSelectedSeats([]);
      setPassengerName('');
      await fetchSeats();

    } catch (err) {
      console.error(err);
      alert('Erro ao realizar a reserva.');
    } finally {
      setLoading(false);
    }
  };

  // Função para liberar (desocupar) um assento como Administrador
  const handleFreeSeat = async (seatId: number) => {
    if (!confirm(`Tens a certeza que queres liberar o assento ${seatId}?`)) return;

    try {
      const { error } = await supabase
        .from('seats')
        .update({ status: 'available', passenger: null })
        .eq('id', seatId);

      if (error) {
        await supabase.from('seats').upsert({ id: seatId, status: 'available', passenger: null });
      }

      alert(`Assento ${seatId} liberado com sucesso!`);
      await fetchSeats();
    } catch (err) {
      console.error(err);
      alert('Erro ao liberar o assento.');
    }
  };

  // Validar senha do Administrador
  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (adminPassword === '123456') {
      setIsAdminAuthenticated(true);
      alert('Modo Administrador ativado!');
    } else {
      alert('Senha incorreta!');
    }
  };

  return (
    <main className="min-h-screen bg-slate-950 text-white py-10 px-4">
      <h1 className="text-2xl font-bold text-center mb-6 text-amber-400">Reserva de Assentos - Autocarro</h1>
      
      {/* Mapa de Assentos */}
      <SeatMapComponent 
        seats={seatsFromDB} 
        selectedSeats={selectedSeats} 
        onSelectSeat={handleSelectSeat} 
      />

      {/* Painel de Reserva do Passageiro */}
      <div className="max-w-md mx-auto mt-6 p-4 bg-slate-900 rounded-xl border border-slate-800 shadow-xl">
        <p className="text-sm text-slate-400 mb-2">Assentos selecionados:</p>
        <p className="font-bold text-blue-400 text-lg mb-4">
          {selectedSeats.length > 0 ? selectedSeats.join(', ') : 'Nenhum selecionado'}
        </p>

        <div className="mb-4">
          <label className="block text-xs text-slate-400 mb-1">Nome do Passageiro:</label>
          <input 
            type="text" 
            value={passengerName}
            onChange={(e) => setPassengerName(e.target.value)}
            placeholder="Digite o seu nome..."
            className="w-full p-2 rounded bg-slate-800 border border-slate-700 text-white text-sm focus:outline-none focus:border-blue-500"
          />
        </div>

        <button 
          onClick={handleBooking}
          disabled={loading || selectedSeats.length === 0}
          className="w-full bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-bold py-2 rounded transition-all shadow"
        >
          {loading ? 'A processar...' : 'Confirmar Reserva'}
        </button>
      </div>

      {/* Área de Administração */}
      <div className="max-w-md mx-auto mt-8 p-4 bg-slate-900/50 rounded-xl border border-slate-800 text-center">
        {!isAdminOpen ? (
          <button 
            onClick={() => setIsAdminOpen(true)}
            className="text-xs text-slate-500 hover:text-slate-300 underline"
          >
            Painel Administrativo (Liberar Assentos)
          </button>
        ) : !isAdminAuthenticated ? (
          <form onSubmit={handleAdminLogin} className="space-y-3 mt-2">
            <p className="text-xs font-semibold text-amber-400">Digite a senha de Administrador:</p>
            <input 
              type="password"
              value={adminPassword}
              onChange={(e) => setAdminPassword(e.target.value)}
              placeholder="Senha..."
              className="w-full p-2 rounded bg-slate-800 border border-slate-700 text-white text-xs text-center"
            />
            <div className="flex gap-2">
              <button type="submit" className="flex-1 bg-amber-600 text-xs py-1.5 rounded font-bold">Entrar</button>
              <button type="button" onClick={() => setIsAdminOpen(false)} className="flex-1 bg-slate-700 text-xs py-1.5 rounded">Fechar</button>
            </div>
          </form>
        ) : (
          <div className="mt-3">
            <p className="text-xs font-bold text-green-400 mb-2">🔓 Modo Admin Ativo: Clica num assento para o liberar:</p>
            <div className="flex flex-wrap gap-1.5 justify-center max-h-40 overflow-y-auto p-2 bg-slate-950 rounded">
              {seatsFromDB.filter(s => s.status === 'occupied').length === 0 ? (
                <p className="text-xs text-slate-500">Nenhum assento ocupado no momento.</p>
              ) : (
                seatsFromDB
                  .filter(s => s.status === 'occupied')
                  .map(seat => (
                    <button
                      key={seat.id}
                      onClick={() => handleFreeSeat(seat.id)}
                      className="bg-red-900/60 hover:bg-red-700 text-red-200 text-xs px-2.5 py-1 rounded border border-red-600"
                    >
                      Liberar #{seat.id}
                    </button>
                  ))
              )}
            </div>
            <button 
              onClick={() => { setIsAdminAuthenticated(false); setIsAdminOpen(false); }}
              className="mt-3 text-xs text-slate-400 underline"
            >
              Sair do modo Admin
            </button>
          </div>
        )}
      </div>
    </main>
  );
}