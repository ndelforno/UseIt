export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  address: string;
  city: string;
  profilePictureUrl?: string | null;
  userName: string;
  displayName: string;
  isProfileComplete: boolean;
}
