"use client";

import { useState, useEffect } from "react";
import { CheckCircle2, Circle, Trash2, Plus, GripVertical, ListTodo } from "lucide-react";
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

  useEffect(() => {
    setIsMounted(true);
  }, []);

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

    if (source.droppableId === destination.droppableId && source.index === destination.index) {
      return;
    }

    const items = Array.from(tasks);
    
    // Find the task being dragged
    const draggedTask = items.find(t => t.id.toString() === result.draggableId);
    if (!draggedTask) return;

    // Remove from old list
    const filteredItems = items.filter(t => t.id.toString() !== result.draggableId);
    
    // Update status if moved to different column
    if (source.droppableId !== destination.droppableId) {
      draggedTask.status = destination.droppableId as Task["status"];
      draggedTask.completed = destination.droppableId === "done";
    }

    // Insert into new list at correct index
    // Note: The destination index is relative to the specific column, not the global array.
    // So we first need to rebuild the global array while respecting the column order.
    
    // For simplicity with Zustand global state, if order within columns matters a lot, we would need 
    // a more complex sorting mechanism or separate arrays in state. 
    // Here we just append to the end or start of the global array and let the render filter them.
    // To respect visual order, let's just update the status for now in the global store.
    
    updateTask(draggedTask.id, { 
      status: destination.droppableId as Task["status"],
      completed: destination.droppableId === "done" 
    });
  };

  const handleAddTask = () => {
    if (!newTaskTitle.trim()) return;
    
    if (!user) return;
    addTask({
      text: newTaskTitle,
      category: newTaskCategory,
    }, user.id);
    
    setNewTaskTitle("");
    toast.success("Tâche ajoutée");
  };

  if (!isMounted) return null; // Avoid hydration mismatch for DnD

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Tâches Kanban</h1>
          <p className="text-muted-foreground mt-1">
            Gérez vos actions prioritaires pour atteindre vos objectifs.
          </p>
        </div>
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

      {tasks.length === 0 ? (
        <EmptyState 
          icon={ListTodo}
          title="Aucune tâche"
          description="Votre journée est libre ! Ajoutez votre première tâche ci-dessus."
        />
      ) : (
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
                      className={`flex-1 p-4 space-y-3 min-h-[200px] transition-colors ${snapshot.isDraggingOver ? 'bg-primary/5' : ''}`}
                    >
                      {tasks
                        .filter(t => t.status === col.id)
                        .map((task, index) => (
                          <Draggable key={task.id} draggableId={task.id.toString()} index={index}>
                            {(provided, snapshot) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                className={`bg-card border ${snapshot.isDragging ? 'border-primary shadow-lg shadow-primary/20' : 'border-border/50 shadow-sm'} p-4 rounded-xl flex flex-col gap-3 group`}
                              >
                                <div className="flex items-start justify-between gap-2">
                                  <div className="flex gap-2">
                                    <div {...provided.dragHandleProps} className="text-muted-foreground hover:text-foreground cursor-grab active:cursor-grabbing mt-0.5">
                                      <GripVertical className="w-4 h-4" />
                                    </div>
                                    <span className={`text-sm font-medium ${task.status === 'done' ? 'line-through text-muted-foreground' : 'text-foreground'}`}>
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
