import { defaultErrorResponse, ErrorResponse } from "../../../../domain/models/ErrorResponse";
import { User } from "../../../../domain/models/User";
import { ApiRequestHandler } from "../api/ApiRequestHandler";
import mime from 'mime';

export class UserService {

    async update(user: User) {
        try {
            const response = await ApiRequestHandler.put<User>(`/users/${user.id}`, user);
            console.log('Response: ', response.data);
            
            return response.data;
        } catch (error: any) {
            if (error.response) {
                const errorData: ErrorResponse = error.response.data;
                if (Array.isArray(errorData.message)) {
                    console.error('Errores multiples del servidor', errorData.message.join(', '));    
                }
                else {
                    console.error('Error unico del servidor', errorData.message);
                }
                return errorData;
            }
            else {
                console.error('Error en la peticion', error.message);
                return defaultErrorResponse;
            }
        }
    }

    async updateWithImage(user: User, image: string) {
        try {
            const formData = new FormData();
            formData.append('file', {
                uri: image,
                name: image.split('/').pop(),
                type: mime.getType(image), 
            });
            formData.append('name', user.name);
            formData.append('lastname', user.lastname);
            formData.append('phone', user.phone);

            const response = await ApiRequestHandler.put<User>(`/users/upload/${user.id}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            console.log('Response: ', response.data);
            
            return response.data;
        } catch (error: any) {
            if (error.response) {
                const errorData: ErrorResponse = error.response.data;
                if (Array.isArray(errorData.message)) {
                    console.error('Errores multiples del servidor', errorData.message.join(', '));    
                }
                else {
                    console.error('Error unico del servidor', errorData.message);
                }
                return errorData;
            }
            else {
                console.error('Error en la peticion', error.message);
                return defaultErrorResponse;
            }
        }
    }

    async updateNotificationToken(id: number, token: string) {
        try {
            const response = await ApiRequestHandler.put<User>(`/users/notification_token/${id}`, {
                'notification_token': token
            });
            console.log('Response: ', response.data);
            
            return response.data;
        } catch (error: any) {
            if (error.response) {
                const errorData: ErrorResponse = error.response.data;
                if (Array.isArray(errorData.message)) {
                    console.error('Errores multiples del servidor', errorData.message.join(', '));    
                }
                else {
                    console.error('Error unico del servidor', errorData.message);
                }
                return errorData;
            }
            else {
                console.error('Error en la peticion', error.message);
                return defaultErrorResponse;
            }
        }
    }

}