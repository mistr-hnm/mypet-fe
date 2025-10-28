import { axiosInstance } from "../../utils/interceptor";
import { useMutation, useQueryClient } from "@tanstack/react-query";
const url = `${import.meta.env.VITE_BE_BASE_URL}`;


export function useCreateMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn : async (body :  any) => {
        const response = await axiosInstance.post(`${url}/pets`, body)
        
        return response.data.data;
     },
     onSuccess :() => {
      queryClient.invalidateQueries({ queryKey : ["pets"]})
    }
  })
}


export function useUpdateMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn : async ({id , body} : {id: number, body : any}) => {
        const response = await axiosInstance.put(`${url}/pets/${id}`, body);
        
        if(response.status !== 200 ) throw await response.data; 
        return response.data.data;
     },
     onSuccess :() => {
      queryClient.invalidateQueries({ queryKey : ["pets"]})
    }
  })
}


export function useDeleteMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn : async ({id} : { id: number }) => {
        const response = await axiosInstance.delete(`${url}/pets/${id}`);
        
        if(response.status !== 200 ) throw await response.data; 
        return response.data.data;
     },
     onSuccess :() => {
      queryClient.invalidateQueries({ queryKey : ["pets"]})
    }
  })
}


export function useStatusUpdateMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn : async ({ body } : { body : any }) => {
        const response = await axiosInstance.put(`${url}/petadoptions/`, body);
       
        
        if(response.status !== 200) throw response.data; 
        return response.data;
     },
     onSuccess :() => {
      queryClient.invalidateQueries({ queryKey : ["pets"]})
    }
  })
}


export function usestatusAllocateUpdateMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn : async ({ body } : { body : any }) => {
        const response = await axiosInstance.put(`${url}/petadoptions/allocate`, body);
       
        
        if(response.status !== 200) throw response.data; 
        return response.data;
     },
     onSuccess :() => {
      queryClient.invalidateQueries({ queryKey : ["pets"]})
    }
  })
}