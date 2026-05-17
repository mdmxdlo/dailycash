"use client";

import { useState, useEffect } from "react";
import {
  CheckCircle2, Circle, Trash2, Plus, GripVertical, ListTodo,
  LayoutGrid, List, CalendarDays, ChevronLeft, ChevronRight
} from "lucide-react";
import { useStore, Task } from "@/store/useStore";
import { DragDropContext, Droppable, Draggable, DropResult } from "@hello-pangea/dnd";
import { toast } from "sonner";
import { EmptyState } from "@/components/ui/EmptyState";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";

const COLUMNS = [
  { id: "todo", title: "À faire" },
  { id: "in-progress", title: "En cours" },
  { id: "done", title: "Terminé" },
] as const;

const DAYS_FR = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"];
const MONTHS_FR = ["Janvier", "Février", "Mars", "Avril", "Mai", "Juin",
  "Juil.", "Août", "Sept.", "Oct.", "Nov.", "Déc."];

type ViewMode = "kanban" | "list" | "calendar";

export default function TasksPage() {
  const [isMounted, setIsMounted] = useState(false);
  const tasks = useStore((state) => state.tasks);
  const user = useStore((state) => state.user);
  const addTask = useStore((state) => state.addTask);
  const updateTask = useStore((state) => state.updateTask);
  const deleteTask = useStore((state) => state.deleteTask);
  const reorderTasks = useStore((state) => state.reorderTasks);

  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newTaskCategory, setNewTaskCategory] = useState<Task["category"]>("Prospection");
  const [confirmId, setConfirmId] = useState<number | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>("kanban");
  const [weekOffset, setWeekOffset] = useState(0); // for calendar view

  useEffect(() => { setIsMounted(true); }, []);

  const completedToday = tasks.filter((t) => t.status === "done").length;

  const categoryColors: Record<string, string> = {
    Prospection: "text-blue-500 bg-blue-500/10 border-blue-500/20",
    Production: "text-primary bg-primary/10 border-primary/20",
    Contenu: "text-purple-500 bg-purple-500/10 border-purple-500/20",
    Apprentissage: "text-orange-500 bg-orange-500/10 border-orange-500/20",
  };

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    const { source, destination } = result;
    if (source.droppableId === destination.droppableId && source.index === destination.index) return;
    const draggedTask = tasks.find(t => t.id.toString() === result.draggableId);
    if (!draggedTask) return;
    updateTask(draggedTask.id, {
      status: destination.droppableId as Task["status"],
      completed: destination.droppableId === "done",
    });
  };

  const handleAddTask = () => {
    if (!newTaskTitle.trim() || !user) return;
    addTask({ text: newTaskTitle, category: newTaskCategory }, user.id);
    setNewTaskTitle("");
    toast.success("Tâche ajoutée");
  };

  const toggleTaskStatus = (task: Task) => {
    const next = task.status === "done" ? "todo" : "done";
    updateTask(task.id, { status: next, completed: next === "done" });
  };

  // --- Calendar helpers ---
  const getWeekDays = (offset: number) => {
    const now = new Date();
    const day = now.getDay(); // 0=Sun
    const monday = new Date(now);
    monday.setDate(now.getDate() - ((day + 6) % 7) + offset * 7);
    monday.setHours(0, 0, 0, 0);
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(monday);
      d.setDate(monday.getDate() + i);
      return d;
    });
  };

  const weekDays = getWeekDays(weekOffset);
  const todayStr = new Date().toDateString();

  if (!isMounted) return null;

  // ---- VIEW SWITCHER BUTTONS ----
  const ViewSwitcher = () => (
    <div className="flex items-center bg-background border border-border/50 rounded-xl p-1 gap-0.5">
      {([
        { mode: "kanban", icon: LayoutGrid, label: "Kanban" },
        { mode: "list",   icon: List,       label: "Liste" },
        { mode: "calendar", icon: CalendarDays, label: "Calendrier" },
      ] as { mode: ViewMode; icon: React.ElementType; label: string }[]).map(({ mode, icon: Icon, label }) => (
        <button
          key={mode}
          onClick={() => setViewMode(mode)}
          title={label}
          className={`p-2 rounded-lg transition-all ${
            viewMode === mode
              ? "bg-primary/10 text-primary"
              : "text-muted-foreground hover:text-foreground hover:bg-white/5"
          }`}
        >
          <Icon className="w-4 h-4" />
        </button>
      ))}
    </div>
  );

  // ---- LIST VIEW ----
  const ListView = () => (
    <div className="bg-card border border-border/50 rounded-2xl shadow-sm overflow-hidden">
      {COLUMNS.map((col) => {
        const colTasks = tasks.filter(t => t.status === col.id);
        if (colTasks.length === 0) return null;
        return (
          <div key={col.id}>
            <div className="px-6 py-3 border-b border-border/50 bg-card flex items-center justify-between">
              <span className="text-sm font-semibold text-foreground">{col.title}</span>
              <span className="text-xs bg-muted text-muted-foreground px-2 py-0.5 rounded-full">{colTasks.length}</span>
            </div>
            {colTasks.map((task, idx) => (
              <div
                key={task.id}
                className={`flex items-center gap-4 px-6 py-4 group transition-colors hover:bg-white/5 ${idx < colTasks.length - 1 ? "border-b border-border/30" : ""}`}
              >
                <button
                  onClick={() => toggleTaskStatus(task)}
                  className="shrink-0 text-muted-foreground hover:text-primary transition-colors"
                >
                  {task.status === "done"
                    ? <CheckCircle2 className="w-5 h-5 text-primary" />
                    : <Circle className="w-5 h-5" />}
                </button>
                <span className={`flex-1 text-sm ${task.status === "done" ? "line-through text-muted-foreground" : "text-foreground"}`}>
                  {task.text}
                </span>
                <span className={`text-[10px] px-2 py-1 rounded-full border shrink-0 ${categoryColors[task.category]}`}>
                  {task.category}
                </span>
                <button
                  onClick={() => setConfirmId(task.id)}
                  className="opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-destructive transition-all shrink-0"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        );
      })}
      {tasks.length === 0 && (
        <div className="py-16 text-center text-muted-foreground text-sm">Aucune tâche</div>
      )}
    </div>
  );

  // ---- CALENDAR VIEW ----
  const CalendarView = () => {
    const monthLabel = (() => {
      const months = new Set(weekDays.map(d => d.getMonth()));
      if (months.size === 1) return `${MONTHS_FR[weekDays[0].getMonth()]} ${weekDays[0].getFullYear()}`;
      return `${MONTHS_FR[weekDays[0].getMonth()]} — ${MONTHS_FR[weekDays[6].getMonth()]} ${weekDays[6].getFullYear()}`;
    })();

    return (
      <div className="bg-card border border-border/50 rounded-2xl shadow-sm overflow-hidden">
        {/* Calendar header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border/50">
          <button
            onClick={() => setWeekOffset(w => w - 1)}
            className="p-1.5 rounded-lg hover:bg-white/5 text-muted-foreground hover:text-foreground transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="text-sm font-semibold text-foreground">{monthLabel}</span>
          <button
            onClick={() => setWeekOffset(w => w + 1)}
            className="p-1.5 rounded-lg hover:bg-white/5 text-muted-foreground hover:text-foreground transition-colors"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Day columns */}
        <div className="grid grid-cols-7 divide-x divide-border/30 min-h-[400px]">
          {weekDays.map((day, i) => {
            const isToday = day.toDateString() === todayStr;
            const isPast = day < new Date(new Date().setHours(0, 0, 0, 0));
            const dayTasks = isToday
              ? tasks
              : isPast
              ? tasks.filter(t => t.status === "done")
              : [];

            return (
              <div key={i} className={`flex flex-col ${isToday ? "bg-primary/5" : ""}`}>
                {/* Day header */}
                <div className={`text-center py-3 border-b border-border/30 ${isToday ? "border-primary/20" : ""}`}>
                  <p className="text-[11px] text-muted-foreground font-medium">{DAYS_FR[i]}</p>
                  <p className={`text-lg font-bold mt-0.5 ${isToday ? "text-primary" : "text-foreground"}`}>
                    {day.getDate()}
                  </p>
                </div>

                {/* Tasks */}
                <div className="flex-1 p-1.5 space-y-1 overflow-y-auto max-h-72">
                  {dayTasks.map(task => (
                    <div
                      key={task.id}
                      className={`text-[11px] px-2 py-1.5 rounded-lg leading-tight ${
                        task.status === "done"
                          ? "bg-primary/5 text-muted-foreground line-through"
                          : task.status === "in-progress"
                          ? "bg-primary/10 text-primary font-medium"
                          : "bg-muted/50 text-foreground"
                      }`}
                    >
                      {task.text}
                    </div>
                  ))}
                  {isToday && dayTasks.length === 0 && (
                    <p className="text-[10px] text-muted-foreground text-center pt-4">Aucune tâche</p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Tâches</h1>
          <p className="text-muted-foreground mt-1">
            Gérez vos actions prioritaires pour atteindre vos objectifs.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <ViewSwitcher />
          <div className="bg-card border border-border/50 px-4 py-2 rounded-xl flex items-center gap-3 shadow-sm">
            <div className="p-1.5 bg-primary/10 rounded-lg">
              <CheckCircle2 className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-sm font-semibold">{completedToday} tâches</p>
              <p className="text-xs text-muted-foreground">complétées</p>
            </div>
          </div>
        </div>
      </div>

      {/* Add task */}
      <div id="tour-add-task" className="bg-card border border-border/50 rounded-2xl p-6 shadow-sm flex flex-col md:flex-row gap-4">
        <input
          type="text"
          value={newTaskTitle}
          onChange={(e) => setNewTaskTitle(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleAddTask()}
          placeholder="Que devez-vous faire ?"
          className="flex-1 bg-background border border-border/50 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-primary/50 transition-all"
        />
        <select
          value={newTaskCategory}
          onChange={(e) => setNewTaskCategory(e.target.value as Task["category"])}
          className="bg-background border border-border/50 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-primary/50 transition-all md:w-48 text-muted-foreground"
        >
          <option value="Prospection">Prospection</option>
          <option value="Production">Production</option>
          <option value="Contenu">Contenu</option>
          <option value="Apprentissage">Apprentissage</option>
        </select>
        <button
          onClick={handleAddTask}
          className="bg-primary text-primary-foreground px-6 py-2.5 rounded-xl font-medium hover:bg-primary/90 transition-colors flex items-center justify-center gap-2 shadow-sm shadow-primary/20"
        >
          <Plus className="w-4 h-4" />
          Ajouter
        </button>
      </div>

      {/* Views */}
      {tasks.length === 0 && viewMode !== "calendar" ? (
        <EmptyState
          icon={ListTodo}
          title="Aucune tâche"
          description="Votre journée est libre ! Ajoutez votre première tâche ci-dessus."
        />
      ) : viewMode === "kanban" ? (
        <DragDropContext onDragEnd={handleDragEnd}>
          <div id="tour-kanban" className="flex gap-4 md:grid md:grid-cols-3 md:gap-6 overflow-x-auto pb-4 md:overflow-visible md:pb-0">
            {COLUMNS.map((col) => (
              <div key={col.id} className="bg-card/50 border border-border/50 rounded-2xl flex flex-col h-full overflow-hidden min-w-[280px] md:min-w-0 flex-shrink-0 md:flex-shrink">
                <div className="p-4 border-b border-border/50 bg-card">
                  <h2 className="font-semibold text-foreground flex justify-between items-center">
                    {col.title}
                    <span className="text-xs bg-muted text-muted-foreground px-2 py-0.5 rounded-full">
                      {tasks.filter(t => t.status === col.id).length}
                    </span>
                  </h2>
                </div>
                <Droppable droppableId={col.id}>
                  {(provided, snapshot) => (
                    <div
                      {...provided.droppableProps}
                      ref={provided.innerRef}
                      className={`flex-1 p-4 space-y-3 min-h-[200px] transition-colors ${snapshot.isDraggingOver ? "bg-primary/5" : ""}`}
                    >
                      {tasks.filter(t => t.status === col.id).map((task, index) => (
                        <Draggable key={task.id} draggableId={task.id.toString()} index={index}>
                          {(provided, snapshot) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              className={`bg-card border ${snapshot.isDragging ? "border-primary shadow-lg shadow-primary/20" : "border-border/50 shadow-sm"} p-4 rounded-xl flex flex-col gap-3 group`}
                            >
                              <div className="flex items-start justify-between gap-2">
                                <div className="flex gap-2">
                                  <div {...provided.dragHandleProps} className="text-muted-foreground hover:text-foreground cursor-grab active:cursor-grabbing mt-0.5">
                                    <GripVertical className="w-4 h-4" />
                                  </div>
                                  <span className={`text-sm font-medium ${task.status === "done" ? "line-through text-muted-foreground" : "text-foreground"}`}>
                                    {task.text}
                                  </span>
                                </div>
                                <button
                                  onClick={() => setConfirmId(task.id)}
                                  className="opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-destructive transition-all"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                              <div className="flex justify-between items-center pl-6">
                                <span className={`text-[10px] px-2 py-1 rounded-full border ${categoryColors[task.category]}`}>
                                  {task.category}
                                </span>
                                {task.status === "done" && <CheckCircle2 className="w-4 h-4 text-primary" />}
                              </div>
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </div>
            ))}
          </div>
        </DragDropContext>
      ) : viewMode === "list" ? (
        <ListView />
      ) : (
        <CalendarView />
      )}

      <ConfirmDialog
        isOpen={confirmId !== null}
        onClose={() => setConfirmId(null)}
        onConfirm={() => {
          if (confirmId !== null) deleteTask(confirmId);
          setConfirmId(null);
        }}
        title="Supprimer la tâche"
        description="Cette action est irréversible. La tâche sera définitivement supprimée."
        confirmLabel="Supprimer"
      />
    </div>
  );
}
