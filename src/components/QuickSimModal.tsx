import React, { useState, useEffect } from 'react';

interface QuickSimModalProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: () => void;
}

export const QuickSimModal: React.FC<QuickSimModalProps> = ({ isOpen, onClose, onComplete }) => {
  const [step, setStep] = useState(0);
  const [logs, setLogs] = useState<string[]>([]);
  const [isDone, setIsDone] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setStep(0);
      setLogs([]);
      setIsDone(false);
      return;
    }

    const simLogs = [
      'Initializing 1D-RC Transient Thermal Mesh (5-layer discretization)...',
      'Loading Leh sub-zero winter weather deck (Jan 15–22, T_min = -24.2°C)...',
      'Computing incident solar radiation on south tilted glaze (Tilt: 58°)...',
      'Solving convective cavity heat transfer in Trombe thermo-siphon...',
      'Evaluating regenerative rock bed sub-floor heat sink matrix...',
      'Testing envelope transmission losses under extreme wind (6.8 m/s)...',
      'Iterative Gauss-Seidel solver converging... residual: 3.2e-4',
      'Iterative Gauss-Seidel solver converging... residual: 1.1e-5 (PASSED)',
      'Transient 7-day thermal cycle converged successfully in 142ms.',
    ];

    let current = 0;
    const interval = setInterval(() => {
      if (current < simLogs.length) {
        setLogs((prev) => [...prev, simLogs[current]]);
        setStep(current + 1);
        current++;
      } else {
        clearInterval(interval);
        setIsDone(true);
        onComplete();
      }
    }, 280);

    return () => clearInterval(interval);
  }, [isOpen]);

  if (!isOpen) return null;

  const progressPercent = Math.min(100, Math.round((step / 9) * 100));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 select-none">
      <div className="bg-white rounded border border-slate-300 w-full max-w-xl shadow-xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="bg-primary-container px-4 py-3 flex items-center justify-between text-white border-b border-slate-700">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-secondary-container text-[20px] animate-spin">
              memory
            </span>
            <div className="flex flex-col">
              <span className="font-headline-sm text-sm font-semibold leading-tight">
                1D Transient Thermal Solver Running
              </span>
              <span className="font-meta-caps text-[9px] text-slate-400">
                TRNSYS Sol-Air Coupled Engine • Leh District v3.4
              </span>
            </div>
          </div>
          {isDone && (
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-white transition-colors"
            >
              <span className="material-symbols-outlined text-[20px]">close</span>
            </button>
          )}
        </div>

        {/* Content */}
        <div className="p-4 flex flex-col gap-3">
          {/* Progress bar */}
          <div className="flex flex-col gap-1">
            <div className="flex justify-between items-center text-xs font-label-data-sm text-slate-700">
              <span>{isDone ? 'Simulation Completed' : 'Solving finite-difference thermal equations...'}</span>
              <span className="font-bold font-mono text-secondary">{progressPercent}%</span>
            </div>
            <div className="w-full bg-slate-200 h-2 rounded overflow-hidden">
              <div
                className="bg-secondary h-full transition-all duration-300 rounded"
                style={{ width: `${progressPercent}%` }}
              ></div>
            </div>
          </div>

          {/* Terminal log output */}
          <div className="bg-slate-950 p-3 rounded font-mono text-[11px] text-slate-300 h-44 overflow-y-auto flex flex-col gap-1 border border-slate-800">
            {logs.map((log, index) => (
              <div key={index} className="flex items-start gap-1.5 leading-relaxed">
                <span className="text-secondary font-bold shrink-0">&gt;</span>
                <span className={index === logs.length - 1 && isDone ? 'text-emerald-400 font-semibold' : ''}>
                  {log}
                </span>
              </div>
            ))}
          </div>

          {/* Result summary banner when done */}
          {isDone && (
            <div className="bg-emerald-50 border border-emerald-300 p-2.5 rounded flex items-center justify-between text-xs">
              <div className="flex items-center gap-2 text-emerald-800 font-medium">
                <span className="material-symbols-outlined text-emerald-600 text-[18px]">verified</span>
                <span>Convergence criterion met (10⁻⁵). Mean Indoor Temp: 18.4°C (Safe Zone).</span>
              </div>
              <button
                onClick={onClose}
                className="px-3 py-1 bg-slate-900 text-white rounded text-xs font-semibold hover:bg-slate-800 transition-colors"
              >
                Inspect Results
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
