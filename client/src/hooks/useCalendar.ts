import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { DayEvents } from '@shared/types';
import { parseEventsFromServer } from '@/lib/utils/calendar';
import { apiRequest } from '@/lib/queryClient';

export const useCalendar = (date?: string) => {
  const queryClient = useQueryClient();
  
  // Query for fetching weekly calendar data
  const {
    data: calendarData,
    isLoading,
    isError,
    error,
    refetch
  } = useQuery<DayEvents[]>({
    queryKey: ['/api/calendar', date],
    select: (data) => parseEventsFromServer(data),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  // Extract weekday events (Monday to Friday)
  const weekdayEvents = calendarData?.slice(0, 5) || [];
  
  // Extract weekend events (Saturday and Sunday)
  const weekendEvents = calendarData?.slice(5, 7) || [];

  // Force refresh calendar data
  const refreshCalendar = () => {
    return refetch();
  };

  return {
    weekdayEvents,
    weekendEvents,
    isLoading,
    isError,
    error,
    refreshCalendar
  };
};

export const useTasks = () => {
  const queryClient = useQueryClient();
  
  // Query for fetching tasks
  const {
    data: tasks,
    isLoading,
    isError,
    error
  } = useQuery({
    queryKey: ['/api/tasks'],
  });

  // Mutation for adding a task
  const addTaskMutation = useMutation({
    mutationFn: (newTask: { title: string; description?: string }) => {
      return apiRequest('POST', '/api/tasks', newTask);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/tasks'] });
    },
  });

  // Mutation for updating a task
  const updateTaskMutation = useMutation({
    mutationFn: ({ id, ...task }: { id: number; title?: string; description?: string; completed?: boolean }) => {
      return apiRequest('PUT', `/api/tasks/${id}`, task);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/tasks'] });
    },
  });

  // Mutation for deleting a task
  const deleteTaskMutation = useMutation({
    mutationFn: (id: number) => {
      return apiRequest('DELETE', `/api/tasks/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/tasks'] });
    },
  });

  return {
    tasks,
    isLoading,
    isError,
    error,
    addTask: addTaskMutation.mutate,
    updateTask: updateTaskMutation.mutate,
    deleteTask: deleteTaskMutation.mutate,
    isAdding: addTaskMutation.isPending,
    isUpdating: updateTaskMutation.isPending,
    isDeleting: deleteTaskMutation.isPending
  };
};
