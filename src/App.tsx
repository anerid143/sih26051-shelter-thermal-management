import { useState, useEffect } from 'react';
import { NavModule, UnitSystem, TimeStep } from './types';
import { ProjectsProvider, useProjects } from './context/ProjectsContext';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { QuickSimModal } from './components/QuickSimModal';
import { ExportModal } from './components/ExportModal';

import { OverviewView } from './views/OverviewView';
import { ShelterDesignView } from './views/ShelterDesignView';
import { ProjectsView } from './views/ProjectsView';
import { ClimateView } from './views/ClimateView';
import { MaterialsView } from './views/MaterialsView';
import { SimulationView } from './views/SimulationView';
import { AnalysisView } from './views/AnalysisView';
import { CompareDesignsView } from './views/CompareDesignsView';
import { ReportsView } from './views/ReportsView';
import { SettingsView } from './views/SettingsView';

function AppContent() {
  const [activeModule, setActiveModule] = useState<NavModule>('overview');
  const [unitSystem, setUnitSystem] = useState<UnitSystem>('SI');
  const [timeStep, setTimeStep] = useState<TimeStep>('1h');
  const [isQuickSimOpen, setIsQuickSimOpen] = useState(false);
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [isSimulating, setIsSimulating] = useState(false);
  
  // Navigation drawer state: hidden by default
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const {
    projects,
    activeProject,
    selectProject,
    createProject,
    updateActiveProjectIteration,
  } = useProjects();

  // Left-edge swipe gesture for mobile/touch screens
  useEffect(() => {
    let touchStartX = 0;
    const handleTouchStart = (e: TouchEvent) => {
      touchStartX = e.touches[0].clientX;
    };

    const handleTouchEnd = (e: TouchEvent) => {
      const touchEndX = e.changedTouches[0].clientX;
      // If touch started near left edge (< 35px) and swiped right (> 60px)
      if (touchStartX < 35 && touchEndX - touchStartX > 60) {
        setIsDrawerOpen(true);
      }
    };

    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchend', handleTouchEnd, { passive: true });

    return () => {
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchend', handleTouchEnd);
    };
  }, []);

  const handleRunSim = () => {
    setIsQuickSimOpen(true);
    setIsSimulating(true);
  };

  const handleSimCompleted = () => {
    setIsSimulating(false);
  };

  return (
    <div className="min-h-screen bg-[#f8f9ff] text-[#0b1c30] flex flex-col font-sans">
      {/* Collapsible Slide-Out Left Navigation Drawer */}
      <Sidebar
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        activeModule={activeModule}
        onSelectModule={setActiveModule}
        projectName={activeProject.name}
        solverStatus={activeProject.meshEngine || activeProject.solverMesh}
        projectLocation={`${activeProject.location.split(',')[0]} ${activeProject.elevation.toLocaleString()}m`}
        projectIteration={activeProject.iteration}
      />

      {/* Main Workspace Frame (Full Width when drawer is closed) */}
      <div className="min-h-screen flex flex-col w-full">
        {/* Top Sticky Engineering Header with Hamburger Toggle */}
        <Header
          currentProject={activeProject}
          unitSystem={unitSystem}
          onToggleUnit={setUnitSystem}
          timeStep={timeStep}
          onToggleTimeStep={setTimeStep}
          onRunQuickSim={handleRunSim}
          onExportReport={() => setIsExportOpen(true)}
          isSimulating={isSimulating}
          isDrawerOpen={isDrawerOpen}
          onToggleDrawer={() => setIsDrawerOpen((prev) => !prev)}
        />

        {/* Viewport Content Stage */}
        <main className="relative pt-16 min-h-screen bg-[#f8f9ff] w-full">
          {activeModule === 'overview' && (
            <OverviewView
              currentProject={activeProject}
              unitSystem={unitSystem}
              timeStep={timeStep}
              onNavigateToDesign={() => setActiveModule('shelter-design')}
              onNavigateToCompare={() => setActiveModule('compare-designs')}
              onRunSimulation={handleRunSim}
              onExportDossier={() => setIsExportOpen(true)}
            />
          )}

          {activeModule === 'shelter-design' && (
            <ShelterDesignView
              onSubmitSolver={handleRunSim}
              onExportIDF={() => setIsExportOpen(true)}
            />
          )}

          {activeModule === 'projects' && (
            <ProjectsView
              currentProject={activeProject}
              projects={projects}
              onSelectProject={(proj) => {
                selectProject(proj.id);
              }}
              onCreateProject={createProject}
              onNavigateToOverview={() => setActiveModule('overview')}
            />
          )}

          {activeModule === 'climate' && <ClimateView />}

          {activeModule === 'materials' && <MaterialsView />}

          {activeModule === 'simulation' && (
            <SimulationView
              currentProject={activeProject}
              onTriggerQuickSim={handleRunSim}
            />
          )}

          {activeModule === 'analysis' && <AnalysisView />}

          {activeModule === 'compare-designs' && (
            <CompareDesignsView
              currentProject={activeProject}
              onSelectIteration={(iter) => {
                updateActiveProjectIteration(iter);
                setActiveModule('shelter-design');
              }}
            />
          )}

          {activeModule === 'reports' && <ReportsView currentProject={activeProject} />}

          {activeModule === 'settings' && (
            <SettingsView
              unitSystem={unitSystem}
              onToggleUnit={setUnitSystem}
              timeStep={timeStep}
              onToggleTimeStep={setTimeStep}
            />
          )}
        </main>
      </div>

      {/* Interactive Simulation Runner Dialog */}
      <QuickSimModal
        isOpen={isQuickSimOpen}
        onClose={() => setIsQuickSimOpen(false)}
        onComplete={handleSimCompleted}
      />

      {/* Export & Technical Dossier Dialog */}
      <ExportModal
        isOpen={isExportOpen}
        onClose={() => setIsExportOpen(false)}
      />
    </div>
  );
}

export default function App() {
  return (
    <ProjectsProvider>
      <AppContent />
    </ProjectsProvider>
  );
}
