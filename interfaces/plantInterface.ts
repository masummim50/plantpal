
export interface Event {
    id:string;
    name: string;
    date: string;
    past: boolean;
    completed: boolean
}
export interface Note{
    id: string;
    note:string;
}
export interface Plant {
    id: string;
    name: string;
    plantedAt: string;
    notes: Note[];
    events: Event[];
}

export interface LogEntry {
    title: string;
    plantedEvent?:boolean;
    date: string
}