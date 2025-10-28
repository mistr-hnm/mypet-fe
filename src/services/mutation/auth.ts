import { useMutation } from "@tanstack/react-query";
import { axiosInstance } from "../../utils/interceptor";
import type { LoginUserBody } from "../../schema/auth";

const url = `${import.meta.env.VITE_BE_BASE_URL}`;

export function useLoginUser() {
  return useMutation({
    mutationFn : async (body : LoginUserBody) => {
        const response = await axiosInstance.post(`${url}/users/login`, body)
        return response.data;
     }
  })
}