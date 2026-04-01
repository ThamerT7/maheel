import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface ProgressStore {
  completedModules: string[]
  currentModule: string | null
  completeModule: (id: string) => void
  setCurrentModule: (id: string | null) => void
  isCompleted: (id: string) => boolean
}

export const useProgressStore = create<ProgressStore>()(
  persist(
    (set, get) => ({
      completedModules: [],
      currentModule: 's1-shahada',
      completeModule: (id) =>
        set((s) => ({
          completedModules: s.completedModules.includes(id)
            ? s.completedModules
            : [...s.completedModules, id],
        })),
      setCurrentModule: (id) => set({ currentModule: id }),
      isCompleted: (id) => get().completedModules.includes(id),
    }),
    { name: 'maheel_progress' }
  )
)
