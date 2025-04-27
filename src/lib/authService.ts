interface User {
  email: string;
  password: string;
  name?: string;
}

interface Session {
  email: string;
  timestamp: number;
}

class AuthService {
  private users: User[] = [];
  private activeSessions: Session[] = [];

  register(email: string, password: string, name?: string): boolean {
    // Check if user already exists
    if (this.users.some(user => user.email === email)) {
      return false;
    }

    this.users.push({ email, password, name });
    return true;
  }

  login(email: string, password: string): { success: boolean; message: string } {
    // Check if user exists and password matches
    const user = this.users.find(u => u.email === email && u.password === password);
    if (!user) {
      return { success: false, message: "Invalid credentials" };
    }

    // Check if user is already logged in
    const existingSession = this.activeSessions.find(session => session.email === email);
    if (existingSession) {
      return { success: false, message: "This account is already logged in on another device" };
    }

    // Create new session
    this.activeSessions.push({
      email,
      timestamp: Date.now()
    });

    return { success: true, message: "Login successful" };
  }

  logout(email: string): void {
    this.activeSessions = this.activeSessions.filter(session => session.email !== email);
  }

  isAuthenticated(email: string): boolean {
    return this.activeSessions.some(session => session.email === email);
  }
}

export const authService = new AuthService();