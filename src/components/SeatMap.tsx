'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

const ADMIN_PASSWORD = 'jocerlanadm' // Palavra-passe de administrador desejada 

interface Reserva {
  id: number
  assento: string
  nome: string
  documento: string
  email: string
}

export default function SeatMap() {
  const [reservas, setReservas] = useState<Reserva[]>([])
  const [selectedSeat, setSelectedSeat] = useState<string | null>(null)
  const [nome, setNome] = useState('')
  const [documento, setDocumento] = useState('')
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)

  // Gerar linhas de assentos no formato exato da planta do autocarro (Pares cruzados: ex. 1, 2, corredor, 4, 3)
  // Total de 15 fileiras para 60 lugares
  const rows = Array.from({ length: 15 }, (_, rowIndex) => {
    const base = rowIndex * 4
    return {
      left1: `A${base + 1}`,
      left2: `A${base + 2}`,
      right1: `A${base + 4}`,
      right2: `A${base + 3}`,
    }
  })

  const fetchReservas = async () => {
    const { data, error } = await supabase.from('reservas').select('*')
    if (error) {
      console.error('Erro ao buscar reservas:', error.message)
    } else if (data) {
      setReservas(data)
    }
  }

  useEffect(() => {
    fetchReservas()
  }, [])

  const getAssentoOcupado = (seatNumber: string) => {
    return reservas.find((r) => r.assento === seatNumber)
  }

  const handleSeatClick = async (seatNumber: string) => {
    const ocupado = getAssentoOcupado(seatNumber)

    if (ocupado) {
      const pass = window.prompt(
        `O assento ${seatNumber} está reservado por ${ocupado.nome}.\nDigite a palavra-passe de administrador para cancelar esta reserva:`
      )

      if (pass === null) return 

      if (pass !== ADMIN_PASSWORD) {
        alert('Palavra-passe incorreta! Apenas administradores podem cancelar reservas.')
        return
      }

      setLoading(true)
      const { error } = await supabase.from('reservas').delete().eq('id', ocupado.id)
      setLoading(false)

      if (error) {
        alert('Erro ao cancelar reserva: ' + error.message)
      } else {
        alert(`Reserva do assento ${seatNumber} cancelada com sucesso!`)
        fetchReservas()
      }
    } else {
      setSelectedSeat(seatNumber)
    }
  }

  const handleReserve = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedSeat) return

    setLoading(true)

    const { error } = await supabase.from('reservas').insert([
      {
        assento: selectedSeat,
        nome,
        documento,
        email,
      },
    ])

    setLoading(false)

    if (error) {
      alert('Erro ao realizar reserva: ' + error.message)
    } else {
      alert(`Assento ${selectedSeat} reservado com sucesso!`)
      setSelectedSeat(null)
      setNome('')
      setDocumento('')
      setEmail('')
      fetchReservas()
    }
  }

  // Função auxiliar para renderizar cada botão de assento com o estilo correto
  const renderSeatButton = (seat: string) => {
    const ocupado = getAssentoOcupado(seat)
    const isSelected = selectedSeat === seat

    let bgColor = 'bg-emerald-500 hover:bg-emerald-600 text-white'
    if (ocupado) {
      bgColor = 'bg-red-500 hover:bg-red-600 text-white cursor-pointer'
    } else if (isSelected) {
      bgColor = 'bg-blue-600 text-white ring-2 ring-blue-300'
    }

    return (
      <button
        key={seat}
        onClick={() => handleSeatClick(seat)}
        className={`py-3 px-1 rounded-lg font-medium transition-all flex flex-col items-center justify-center text-xs shadow-sm ${bgColor}`}
      >
        <span className="font-bold text-sm">{seat.replace('A', '')}</span>
        <span className="text-[9px] font-semibold mt-0.5 text-white">
          {ocupado ? 'Ocupado' : isSelected ? 'Selecionado' : 'Livre'}
        </span>
      </button>
    )
  }

  return (
    <div className="max-w-5xl mx-auto p-3 sm:p-6 md:p-8 bg-slate-900 min-h-screen text-slate-100">
      <h1 className="text-xl sm:text-2xl font-bold text-center mb-2 text-white">
        Mapa do Ônibus
      </h1>
      <p className="text-center text-xs sm:text-sm text-slate-400 mb-6">
        Selecione uma poltrona disponível
      </p>

      {/* Legenda */}
      <div className="flex flex-wrap justify-center gap-4 sm:gap-6 mb-6 text-xs sm:text-sm bg-slate-800 p-3 rounded-xl border border-slate-700">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-emerald-500 rounded-md"></div>
          <span className="text-slate-200">Livre</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-blue-600 rounded-md"></div>
          <span className="text-slate-200">Selecionado</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-red-500 rounded-md"></div>
          <span className="text-slate-200">Ocupado (Admin)</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8 items-start">
        {/* Layout Visual do Autocarro */}
        <div className="lg:col-span-2 bg-slate-800 p-4 sm:p-6 rounded-2xl shadow-xl border border-slate-700">
          <div className="text-center font-bold text-slate-300 mb-4 py-2 bg-slate-700/50 rounded-lg text-xs sm:text-sm tracking-wider uppercase">
            Piso Superior 🚌
          </div>
          
          <div className="max-h-[500px] overflow-y-auto pr-2 space-y-2">
            {rows.map((row, idx) => (
              <div key={idx} className="grid grid-cols-9 gap-1.5 items-center">
                {/* Lado esquerdo (2 assentos) */}
                <div className="col-span-2 grid grid-cols-2 gap-1.5">
                  {renderSeatButton(row.left1)}
                  {renderSeatButton(row.left2)}
                </div>

                {/* Corredor central */}
                <div className="col-span-5 text-center text-[10px] sm:text-xs font-semibold text-slate-400 uppercase tracking-widest bg-slate-900/40 py-2.5 rounded">
                  Corredor
                </div>

                {/* Lado direito (2 assentos) */}
                <div className="col-span-2 grid grid-cols-2 gap-1.5">
                  {renderSeatButton(row.right1)}
                  {renderSeatButton(row.right2)}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Formulário / Lateral */}
        <div className="bg-slate-800 p-4 sm:p-6 rounded-2xl shadow-xl border border-slate-700 lg:sticky lg:top-6">
          <h2 className="text-base sm:text-lg font-semibold mb-4 text-white">
            {selectedSeat ? `Reservar Assento: ${selectedSeat.replace('A', '')}` : 'Selecione um assento'}
          </h2>

          {selectedSeat ? (
            <form onSubmit={handleReserve} className="space-y-3 sm:space-y-4">
              <div>
                <label className="block text-xs sm:text-sm font-medium text-slate-300 mb-1">Nome Completo</label>
                <input
                  type="text"
                  required
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white text-sm"
                  placeholder="Ex: João da Silva"
                />
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-medium text-slate-300 mb-1">Documento (CPF/RG)</label>
                <input
                  type="text"
                  required
                  value={documento}
                  onChange={(e) => setDocumento(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white text-sm"
                  placeholder="Ex: 000.000.000-00"
                />
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-medium text-slate-300 mb-1">E-mail</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white text-sm"
                  placeholder="exemplo@email.com"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 rounded-lg transition-colors disabled:opacity-50 text-sm shadow-md"
                >
                  {loading ? 'Salvando...' : 'Confirmar Reserva'}
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedSeat(null)}
                  className="px-4 py-2.5 bg-slate-700 hover:bg-slate-600 text-slate-200 font-medium rounded-lg transition-colors text-sm"
                >
                  Cancelar
                </button>
              </div>
            </form>
          ) : (
            <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
              Toque em qualquer poltrona verde no mapa ao lado para preencher os dados de reserva. Os assentos vermelhos exigem a senha de administrador (<code className="text-blue-400">123</code>) para remoção.
            </p>
          )}
        </div>
      </div>
    </div>
  )
}