import { Field } from "../components/js/interfaceModels/Field";
import { FieldRecipe } from "../components/js/interfaceModels/FieldRecipe";
import { SpecimenDataObject } from "../components/js/interfaceModels/Specimen";
import { Sterilization } from "../components/js/interfaceModels/Sterilization";
import { TaskDataObject } from "../components/js/interfaceModels/TaskDataObjects";

export const API_URL = "http://10.0.0.45:5000/api";

// Define the allowed HTTP methods
type HttpMethod = "GET" | "POST" | "PUT" | "DELETE";

// Generic API response type
export interface ApiResponse<T> {
    tasks?: TaskDataObject[];
    specimen?: SpecimenDataObject[];
    fields?: Field[];
    sterilizations?: Sterilization[];
    success?: boolean;
    data?: T;
    error?: string;
}

/**
 * Generic fetch wrapper
 * @param endpoint - API endpoint (after /api/)
 * @param method - HTTP method
 * @param token - Optional auth token
 * @param body - Optional request body
 */
export async function apiFetch<T>(
  endpoint: string,
  method: HttpMethod = "GET",
  token?: string,
  body?: unknown,
): Promise<T> {
  try {
    const res = await fetch(`${API_URL}/${endpoint}`, {
      method,
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      credentials: "include",
      ...(body ? { body: JSON.stringify(body) } : {}),
    });

    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(`API Error ${res.status}: ${errorText}`);
    }

    const data = (await res.json()) as T;
    return data
  } catch (error) {
    console.error("apiFetch error:", error);
    throw error;
  }
}
