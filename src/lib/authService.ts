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
    // Normalize email to lowercase for case-insensitive comparison
    const normalizedEmail = email.toLowerCase();
    
    // Check if user already exists
    if (this.users.some(user => user.email.toLowerCase() === normalizedEmail)) {
      return false;
    }

    // Add new user with normalized email
    this.users.push({ email: normalizedEmail, password, name });
    
    // For debugging
    console.log('Registered users:', this.users);
    return true;
  }

  login(email: string, password: string): { success: boolean; message: string } {
    // Normalize email for comparison
    const normalizedEmail = email.toLowerCase();
    
    // Find user with normalized email
    const user = this.users.find(u => 
      u.email.toLowerCase() === normalizedEmail && u.password === password
    );

    // For debugging
    console.log('Login attempt:', { email: normalizedEmail, found: !!user });
    console.log('Current users:', this.users);

    if (!user) {
      return { success: false, message: "Invalid credentials" };
    }

    // Check if user is already logged in
    const existingSession = this.activeSessions.find(session => 
      session.email.toLowerCase() === normalizedEmail
    );

    if (existingSession) {
      return { success: false, message: "This account is already logged in on another device" };
    }

    // Create new session
    this.activeSessions.push({
      email: normalizedEmail,
      timestamp: Date.now()
    });

    return { success: true, message: "Login successful" };
  }

  logout(email: string): void {
    const normalizedEmail = email.toLowerCase();
    this.activeSessions = this.activeSessions.filter(session => 
      session.email.toLowerCase() !== normalizedEmail
    );
  }

  isAuthenticated(email: string): boolean {
    const normalizedEmail = email.toLowerCase();
    return this.activeSessions.some(session => 
      session.email.toLowerCase() === normalizedEmail
    );
  }
}

export const authService = new AuthService();