"use server"

import { getCurrentToken } from "@/lib/get-current-token";
import { getCurrentUser } from "@/lib/get-current-user"
import { TaskSchema } from "@/schemas";
import axios from "axios";
import * as z from "zod";

export const updateTask = async (values: any) => {
    try {
        const currentUser = await getCurrentUser();
        if(!currentUser){
            return {
                error: true,
                errorMessage: "User not found",
            }
        }

        const currentToken = await getCurrentToken();
        if(!currentToken){
            return {
                error: true,
                errorMessage: "Token not found",
            }
        }

        const { id } = values;

        const apiUrl = `${process.env.API_URL}/task?taskId=${id}`
        console.log(apiUrl)
        const response = await axios.put(apiUrl, values, {
            headers: {
                Authorization: `Bearer ${currentToken}`,
            },
        });

        console.log(response.data.data)

        return {
            success: true,
            // data: response.data.data,
        };

    } catch(error: any) {
        console.log(error.message)
        return {
            error: true,
            errorMessage: error.message,
        }
    }
}