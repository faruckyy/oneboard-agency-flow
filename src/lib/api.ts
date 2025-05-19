
// This is a simple client-side data storage API that uses localStorage
// In a real application, you would replace this with actual API calls

const STORAGE_KEYS = {
  PEOPLE: 'oneboard-people',
  CLEANING_TASKS: 'oneboard-cleaning-tasks',
  CLEANING_SETTINGS: 'oneboard-cleaning-settings',
  DESIGN_TASKS: 'oneboard-design-tasks',
  COMMERCIAL_TASKS: 'oneboard-commercial-tasks',
  CLEANING_HISTORY: 'oneboard-cleaning-history',
};

export type PersonRole = 'Designer' | 'Comercial' | 'Social Media';

export interface Person {
  id: string;
  name: string;
  role: PersonRole;
}

export interface CleaningSettings {
  cycleDuration: number;
}

export interface CleaningTask {
  id: string;
  personName: string;
  task: string;
  completed: boolean;
}

export interface CleaningCycle {
  id: string;
  date: string;
  tasks: CleaningTask[];
}

export type TaskStatus = 
  | "Na fila" 
  | "Aguardando Informações" 
  | "Fazendo" 
  | "Pausado" 
  | "Aguardando Material" 
  | "Aguardando Aprovação"
  | "Concluído";

export type TaskPriority = "Urgente" | "Normal" | "Leve";

export interface BriefingData {
  title: string;
  subtitle: string;
  description: string;
  links: string[];
  visualReferences: string[];
}

export interface Task {
  id: string;
  title: string;
  description: string;
  assignedTo: string;
  status: TaskStatus;
  priority: TaskPriority;
  briefing?: BriefingData;
}

// Helper functions to interact with localStorage
const getItem = <T>(key: string, defaultValue: T): T => {
  const item = localStorage.getItem(key);
  if (!item) return defaultValue;
  try {
    return JSON.parse(item) as T;
  } catch (e) {
    return defaultValue;
  }
};

const setItem = <T>(key: string, value: T): void => {
  localStorage.setItem(key, JSON.stringify(value));
};

// API functions
export const api = {
  // People management
  getPeople: (): Person[] => {
    return getItem<Person[]>(STORAGE_KEYS.PEOPLE, []);
  },
  
  addPerson: (person: Person): Person[] => {
    const people = api.getPeople();
    const newPeople = [...people, person];
    setItem(STORAGE_KEYS.PEOPLE, newPeople);
    return newPeople;
  },
  
  deletePerson: (id: string): Person[] => {
    const people = api.getPeople();
    const newPeople = people.filter(p => p.id !== id);
    setItem(STORAGE_KEYS.PEOPLE, newPeople);
    return newPeople;
  },
  
  // Cleaning tasks management
  getCleaningTasks: (): string[] => {
    return getItem<string[]>(STORAGE_KEYS.CLEANING_TASKS, []);
  },
  
  setCleaningTasks: (tasks: string[]): void => {
    setItem(STORAGE_KEYS.CLEANING_TASKS, tasks);
  },
  
  // Cleaning settings
  getCleaningSettings: (): CleaningSettings => {
    return getItem<CleaningSettings>(STORAGE_KEYS.CLEANING_SETTINGS, { cycleDuration: 7 });
  },
  
  setCleaningSettings: (settings: CleaningSettings): void => {
    setItem(STORAGE_KEYS.CLEANING_SETTINGS, settings);
  },
  
  // Cleaning cycles history
  getCleaningHistory: (): CleaningCycle[] => {
    return getItem<CleaningCycle[]>(STORAGE_KEYS.CLEANING_HISTORY, []);
  },
  
  addCleaningCycle: (cycle: CleaningCycle): void => {
    const history = api.getCleaningHistory();
    const newHistory = [cycle, ...history.slice(0, 29)]; // Keep only 30 most recent cycles
    setItem(STORAGE_KEYS.CLEANING_HISTORY, newHistory);
  },
  
  // Design tasks
  getDesignTasks: (): Task[] => {
    return getItem<Task[]>(STORAGE_KEYS.DESIGN_TASKS, []);
  },
  
  setDesignTasks: (tasks: Task[]): void => {
    setItem(STORAGE_KEYS.DESIGN_TASKS, tasks);
  },
  
  updateDesignTask: (task: Task): Task[] => {
    const tasks = api.getDesignTasks();
    const newTasks = tasks.map(t => t.id === task.id ? task : t);
    setItem(STORAGE_KEYS.DESIGN_TASKS, newTasks);
    return newTasks;
  },
  
  // Commercial tasks
  getCommercialTasks: (): Task[] => {
    return getItem<Task[]>(STORAGE_KEYS.COMMERCIAL_TASKS, []);
  },
  
  setCommercialTasks: (tasks: Task[]): void => {
    setItem(STORAGE_KEYS.COMMERCIAL_TASKS, tasks);
  },
  
  updateCommercialTask: (task: Task): Task[] => {
    const tasks = api.getCommercialTasks();
    const newTasks = tasks.map(t => t.id === task.id ? task : t);
    setItem(STORAGE_KEYS.COMMERCIAL_TASKS, newTasks);
    return newTasks;
  },
};
