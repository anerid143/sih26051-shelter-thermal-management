import React, { useEffect, useRef } from 'react';
import { NavModule } from '../types';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  activeModule: NavModule;
  onSelectModule: (module: NavModule) => void;
  solverStatus?: string;
  projectName?: string;
  projectLocation?: string;
  projectIteration?: string;
}

export const Sidebar: React.FC<SidebarProps> = ({
  isOpen,
  onClose,
  activeModule,
  onSelectModule,
  solverStatus = 'Transient 1D-RC Thermal Mesh',
  projectName = 'Himalayan Passive Shelter',
  projectLocation = 'Ladakh Sector',
  projectIteration = 'v3.4',
}) => {
  const drawerRef = useRef<HTMLElement>(null);
  const touchStartX = useRef<number | null>(null);

  const navItems: { id: NavModule; label: string; icon: string }[] = [
    { id: 'overview', label: 'Overview', icon: 'grid_view' },
    { id: 'projects', label: 'Projects', icon: 'folder_open' },
    { id: 'climate', label: 'Climate', icon: 'thermostat' },
    { id: 'shelter-design', label: 'Shelter Design', icon: 'architecture' },
    { id: 'materials', label: 'Materials', icon: 'layers' },
    { id: 'simulation', label: 'Simulation', icon: 'memory' },
    { id: 'analysis', label: 'Analysis', icon: 'monitoring' },
    { id: 'compare-designs', label: 'Compare Designs', icon: 'compare_arrows' },
    { id: 'reports', label: 'Reports', icon: 'description' },
  ];

  // Close drawer on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Touch swipe to close on drawer (swipe left)
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const currentX = e.touches[0].clientX;
    const diffX = currentX - touchStartX.current;
    // If swiped left by more than 50px, close drawer
    if (diffX < -50) {
      touchStartX.current = null;
      onClose();
    }
  };

  const handleTouchEnd = () => {
    touchStartX.current = null;
  };

  const handleItemClick = (id: NavModule) => {
    onSelectModule(id);
    onClose();
  };

  return (
    <>
      {/* Dimmed Backdrop Overlay */}
      <div
        onClick={onClose}
        aria-hidden="true"
        className={`fixed inset-0 bg-black/45 backdrop-blur-[2px] z-50 transition-opacity duration-300 ease-in-out ${
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      />

      {/* Slide-out Drawer */}
      <aside
        ref={drawerRef}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        aria-label="Navigation Drawer"
        className={`fixed left-0 top-0 h-full w-[280px] bg-primary-container z-50 flex flex-col justify-between shadow-[0_4px_28px_rgba(0,0,0,0.35)] transition-transform duration-300 ease-in-out select-none ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col">
          {/* Header Branding + Close Action */}
          <div className="p-3.5 border-b border-white/10">
            <div className="flex items-center justify-between mb-2">
              <div
                className="flex items-center gap-2 cursor-pointer"
                onClick={() => handleItemClick('overview')}
              >
                <img
                  alt="ShelterTherm Thermal Engineering Logo"
                  className="h-8 w-auto object-contain shrink-0"
                  src="https://lh3.googleusercontent.com/aida/AEtjO1VSRgA-BjvA56bBAAyHA5us4UO4fQcnd_uNWCV0mQGTX5rTX_Rs8BNc-RQhuTijpedvXk5FKnCt4C110STFgMIj52WXJniJLThz-8cfns83XLetcp0cCx0XM9j3xVzfhev-TDtZJrIbE9UeefuoINkuXD2yzzquNA8QSLZbkhezgcgvhZG6NbN9kWUsBbJiy9Sq2KRYD0MgOGsgf2gKlnAxcNmdY2khb78xvUSUGK9DrZ6HVAp83jV7Xy0"
                />
                <div className="flex flex-col">
                  <span className="font-headline-sm text-base text-white font-semibold leading-none tracking-tight">
                    ShelterTherm
                  </span>
                  <span className="font-meta-caps text-[9px] uppercase tracking-wider text-slate-400 mt-1">
                    Passive Thermal Lab | SIH26051
                  </span>
                </div>
              </div>

              {/* Close Button */}
              <button
                onClick={onClose}
                className="p-1 rounded-sm text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                title="Close navigation drawer"
                aria-label="Close navigation drawer"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <div className="mt-2 flex items-center justify-between">
              <span className="inline-flex items-center px-2 py-0.5 rounded-sm bg-secondary text-white font-label-data-sm text-[11px] truncate max-w-[180px]">
                <span className="material-symbols-outlined text-[13px] mr-1 shrink-0">explore</span>
                <span className="truncate">{projectLocation}</span>
              </span>
              <span className="font-label-data-sm text-[11px] text-slate-400 font-mono shrink-0 ml-1 truncate max-w-[70px]">
                {projectIteration.split(' ')[0]}
              </span>
            </div>
          </div>

          {/* Section Title */}
          <div className="px-3.5 pt-3 pb-1">
            <span className="font-meta-caps text-[10px] text-slate-400 uppercase tracking-wider">
              Analytical Modules
            </span>
          </div>

          {/* Navigation Items */}
          <nav className="flex flex-col px-2 gap-0.5">
            {navItems.map((item) => {
              const isActive = activeModule === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleItemClick(item.id)}
                  className={`flex items-center w-full px-2.5 py-1.5 rounded-sm transition-colors text-left text-sm ${
                    isActive
                      ? 'bg-surface-container text-on-surface font-semibold shadow-sm'
                      : 'text-slate-300 hover:bg-slate-800/80 hover:text-white font-normal'
                  }`}
                >
                  <span
                    className={`material-symbols-outlined text-[18px] mr-2.5 ${
                      isActive ? 'text-secondary' : 'text-slate-400'
                    }`}
                  >
                    {item.icon}
                  </span>
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Footer Area: Active Solver & Analyst Profile */}
        <div className="flex flex-col p-2 gap-1.5">
          <div className="bg-[#1e293b] p-2 rounded-sm border border-slate-700/50">
            <div className="font-meta-caps text-[9px] text-[#188ace] uppercase tracking-wider mb-0.5 font-bold">
              Active Solver
            </div>
            <div className="font-label-data-sm text-[11px] text-white truncate font-medium">
              {projectName}
            </div>
            <div className="font-label-data-sm text-[10px] text-slate-400 mt-0.5">
              {solverStatus}
            </div>
          </div>

          <button
            onClick={() => handleItemClick('settings')}
            className={`flex items-center px-2.5 py-1.5 rounded-sm text-xs transition-colors ${
              activeModule === 'settings'
                ? 'bg-surface-container text-on-surface font-semibold'
                : 'text-slate-300 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <span className="material-symbols-outlined text-[17px] mr-2">tune</span>
            <span>Settings & Solver Mesh</span>
          </button>

          <div className="pt-2 border-t border-white/10 flex items-center justify-between px-1">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-slate-900 border border-slate-700 flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-white text-[16px]">person</span>
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-xs text-white font-semibold leading-tight truncate">
                  Dr. S. Norbu
                </span>
                <span className="text-[10px] text-slate-400">Lead Analyst</span>
              </div>
            </div>
            <span className="px-1.5 py-0.5 rounded-sm bg-tertiary-container text-[#188ace] font-label-data-sm text-[10px] border border-[#188ace]/30 shrink-0">
              SIH-TEAM
            </span>
          </div>
        </div>
      </aside>
    </>
  );
};
