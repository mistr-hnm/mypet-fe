import { axiosInstance } from "../../utils/interceptor";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import type { PaginationState } from "@tanstack/react-table";

const url = `${import.meta.env.VITE_BE_BASE_URL}`;

export function useGetPets(searchText : string ,pagination : PaginationState) {
    return useQuery({
        queryKey : ["pets", pagination, searchText],
        retry : false,
        queryFn : async () => {
            let uri = `${url}/pets?page=${pagination.pageIndex}&limit=${pagination.pageSize}`;
            if(searchText) uri += `&searchTerm=${searchText}`;
           const response = await axiosInstance.get(uri) 
           
           if(response.status !== 200) throw await response.data; 
           return response.data;
        },
        placeholderData: keepPreviousData
    })
}


export function useGetPetById(id : string) {
    
    return useQuery({
        queryKey : ["pets",id],
        retry : false,
        queryFn : async () => {
           const response = await axiosInstance.get(`${url}/pets/${id}`)    
             
           if(response.status !== 200) throw await response.data; 
           return response.data;
        }
    })
}