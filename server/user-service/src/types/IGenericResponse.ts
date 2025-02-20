export interface IGenericResponse<T> {
  status: 'success' | 'error';
  message: string;
  data?: T;
  error?: string;
}
