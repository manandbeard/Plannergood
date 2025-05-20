import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { Photo } from '@shared/schema';

export const usePhotos = () => {
  const queryClient = useQueryClient();
  
  // Query for fetching photos
  const {
    data: photos,
    isLoading,
    isError,
    error
  } = useQuery<Photo[]>({
    queryKey: ['/api/photos'],
  });

  // Mutation for uploading a single photo
  const uploadPhotoMutation = useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append('photo', file);
      
      const response = await fetch('/api/photos/upload', {
        method: 'POST',
        body: formData,
        credentials: 'include'
      });
      
      if (!response.ok) {
        throw new Error('Failed to upload photo');
      }
      
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/photos'] });
    },
  });
  
  // Mutation for uploading multiple photos
  const uploadBulkPhotosMutation = useMutation({
    mutationFn: async (files: File[]) => {
      // For each file, create and send a separate request
      const uploadPromises = files.map(file => {
        const formData = new FormData();
        formData.append('photo', file);
        
        return fetch('/api/photos/upload', {
          method: 'POST',
          body: formData,
          credentials: 'include'
        })
        .then(res => {
          if (!res.ok) {
            throw new Error(`Failed to upload photo: ${file.name}`);
          }
          return res.json();
        });
      });
      
      // Wait for all uploads to complete
      const results = await Promise.all(uploadPromises);
      
      return {
        success: true,
        count: results.length,
        photos: results
      };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/photos'] });
    },
  });

  // Mutation for deleting a photo
  const deletePhotoMutation = useMutation({
    mutationFn: (id: number) => {
      return apiRequest('DELETE', `/api/photos/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/photos'] });
    },
  });

  // Build photo URL
  const getPhotoUrl = (photo: Photo) => {
    // For demonstration, we'll use a simple path
    return `/api/photos/files/${photo.filename}`;
  };

  return {
    photos,
    isLoading,
    isError,
    error,
    uploadPhoto: uploadPhotoMutation.mutate,
    uploadBulkPhotos: uploadBulkPhotosMutation.mutate,
    deletePhoto: deletePhotoMutation.mutate,
    isUploading: uploadPhotoMutation.isPending || uploadBulkPhotosMutation.isPending,
    isDeleting: deletePhotoMutation.isPending,
    getPhotoUrl
  };
};
