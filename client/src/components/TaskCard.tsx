import { useState } from 'react';
import { useTasks } from '@/hooks/useCalendar';
import { 
  CheckCircle,
  Circle,
  Plus,
  Trash2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Task } from '@shared/schema';

const TaskCard = () => {
  const { tasks, isLoading, addTask, updateTask, deleteTask } = useTasks();
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  
  const handleAddTask = () => {
    if (newTaskTitle.trim()) {
      addTask({ title: newTaskTitle.trim() });
      setNewTaskTitle('');
      setIsAdding(false);
    }
  };
  
  const toggleTaskComplete = (task: Task) => {
    updateTask({ id: task.id, completed: !task.completed });
  };

  return (
    <div className="calendar-card bg-white rounded-xl shadow-[0_2px_10px_rgba(0,0,0,0.05)] overflow-hidden flex flex-col h-full">
      <div className="bg-[#F8A9A0] text-white text-center py-2 px-3 flex justify-between items-center">
        <h2 className="text-xl font-semibold">Family Notes</h2>
        {!isAdding && (
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-white hover:bg-[#F8A9A0]/80 p-1 h-auto"
            onClick={() => setIsAdding(true)}
          >
            <Plus className="h-5 w-5" />
          </Button>
        )}
      </div>
      
      {isAdding && (
        <div className="p-3 border-b border-[#DADADA]">
          <Input
            placeholder="Enter task..."
            value={newTaskTitle}
            onChange={(e) => setNewTaskTitle(e.target.value)}
            className="mb-2"
            autoFocus
          />
          <div className="flex justify-end space-x-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setIsAdding(false)}
            >
              Cancel
            </Button>
            <Button 
              size="sm"
              onClick={handleAddTask}
              className="bg-[#F8A9A0] hover:bg-[#F8A9A0]/90"
            >
              Add Task
            </Button>
          </div>
        </div>
      )}
      
      <div className="flex-1 p-3 overflow-y-auto custom-scrollbar">
        {isLoading ? (
          <p className="text-center text-[#7A7A7A] p-4">Loading tasks...</p>
        ) : !tasks || tasks.length === 0 ? (
          <p className="text-center text-[#7A7A7A] p-4">No family notes yet</p>
        ) : (
          <ul>
            {tasks.map((task: Task) => (
              <li key={task.id} className="flex items-start mb-3 pb-3 border-b border-[#DADADA] last:border-0">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="p-0 mr-2 h-auto text-[#7A7A7A] hover:text-[#111]"
                  onClick={() => toggleTaskComplete(task)}
                >
                  {task.completed ? (
                    <CheckCircle className="h-5 w-5" />
                  ) : (
                    <Circle className="h-5 w-5" />
                  )}
                </Button>
                
                <div className="flex-1">
                  <p className={`font-medium ${task.completed ? 'line-through text-[#7A7A7A]' : ''}`}>
                    {task.title}
                  </p>
                  {task.description && (
                    <p className="text-sm text-[#7A7A7A]">{task.description}</p>
                  )}
                </div>
                
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="p-1 h-auto text-[#7A7A7A] hover:text-red-500"
                  onClick={() => deleteTask(task.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default TaskCard;
