import { 
  users, type User, type InsertUser,
  parkingSpots, type ParkingSpot, type InsertParkingSpot,
  activities, type Activity, type InsertActivity,
  contacts, type Contact, type InsertContact
} from "@shared/schema";

// Interface for storage operations
export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Parking spot operations
  getAllParkingSpots(): Promise<ParkingSpot[]>;
  getParkingSpot(id: number): Promise<ParkingSpot | undefined>;
  getParkingSpotByName(spotName: string): Promise<ParkingSpot | undefined>;
  createParkingSpot(spot: InsertParkingSpot): Promise<ParkingSpot>;
  updateParkingSpot(id: number, spot: Partial<ParkingSpot>): Promise<ParkingSpot | undefined>;
  getAvailableParkingSpots(): Promise<ParkingSpot[]>;
  getOccupiedParkingSpots(): Promise<ParkingSpot[]>;
  getReservedParkingSpots(): Promise<ParkingSpot[]>;
  
  // Activity operations
  getAllActivities(limit?: number): Promise<Activity[]>;
  createActivity(activity: InsertActivity): Promise<Activity>;
  
  // Contact operations
  createContact(contact: InsertContact): Promise<Contact>;
  
  // Dashboard statistics
  getDashboardStats(): Promise<{
    totalSpots: number;
    availableSpots: number;
    occupiedSpots: number;
    reservedSpots: number;
  }>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private parkingSpots: Map<number, ParkingSpot>;
  private activities: Map<number, Activity>;
  private contacts: Map<number, Contact>;
  
  private userCurrentId: number;
  private parkingSpotCurrentId: number;
  private activityCurrentId: number;
  private contactCurrentId: number;

  constructor() {
    this.users = new Map();
    this.parkingSpots = new Map();
    this.activities = new Map();
    this.contacts = new Map();
    
    this.userCurrentId = 1;
    this.parkingSpotCurrentId = 1;
    this.activityCurrentId = 1;
    this.contactCurrentId = 1;
    
    // Initialize with some parking spots
    this.initializeParkingSpots();
  }
  
  private initializeParkingSpots() {
    const rows = ['A', 'B', 'C'];
    const columns = [1, 2, 3, 4, 5, 6, 7, 8];
    
    for (const row of rows) {
      for (const column of columns) {
        const spotName = `${row}${column}`;
        const status = Math.random() > 0.5 ? "available" : "occupied";
        
        this.createParkingSpot({
          spotName,
          status,
          vehicleNumber: status === "occupied" ? `ABC${Math.floor(Math.random() * 1000)}` : undefined,
          bookingDuration: status === "occupied" ? 60 : undefined
        });
        
        if (status === "occupied") {
          this.createActivity({
            spotName,
            action: "booked",
            vehicleNumber: `ABC${Math.floor(Math.random() * 1000)}`
          });
        }
      }
    }
  }

  // User operations
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userCurrentId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }
  
  // Parking spot operations
  async getAllParkingSpots(): Promise<ParkingSpot[]> {
    return Array.from(this.parkingSpots.values());
  }
  
  async getParkingSpot(id: number): Promise<ParkingSpot | undefined> {
    return this.parkingSpots.get(id);
  }
  
  async getParkingSpotByName(spotName: string): Promise<ParkingSpot | undefined> {
    return Array.from(this.parkingSpots.values()).find(
      (spot) => spot.spotName === spotName,
    );
  }
  
  async createParkingSpot(insertSpot: InsertParkingSpot): Promise<ParkingSpot> {
    const id = this.parkingSpotCurrentId++;
    const now = new Date();
    const spot: ParkingSpot = { 
      ...insertSpot, 
      id, 
      lastUpdated: now,
      bookedAt: insertSpot.status === "occupied" || insertSpot.status === "reserved" ? now : undefined
    };
    this.parkingSpots.set(id, spot);
    return spot;
  }
  
  async updateParkingSpot(id: number, updatedSpot: Partial<ParkingSpot>): Promise<ParkingSpot | undefined> {
    const spot = this.parkingSpots.get(id);
    if (!spot) return undefined;
    
    const now = new Date();
    const updated: ParkingSpot = { 
      ...spot, 
      ...updatedSpot,
      lastUpdated: now,
      bookedAt: updatedSpot.status === "occupied" || updatedSpot.status === "reserved" ? now : spot.bookedAt
    };
    
    this.parkingSpots.set(id, updated);
    return updated;
  }
  
  async getAvailableParkingSpots(): Promise<ParkingSpot[]> {
    return Array.from(this.parkingSpots.values()).filter(
      (spot) => spot.status === "available",
    );
  }
  
  async getOccupiedParkingSpots(): Promise<ParkingSpot[]> {
    return Array.from(this.parkingSpots.values()).filter(
      (spot) => spot.status === "occupied",
    );
  }
  
  async getReservedParkingSpots(): Promise<ParkingSpot[]> {
    return Array.from(this.parkingSpots.values()).filter(
      (spot) => spot.status === "reserved",
    );
  }
  
  // Activity operations
  async getAllActivities(limit: number = 10): Promise<Activity[]> {
    return Array.from(this.activities.values())
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
      .slice(0, limit);
  }
  
  async createActivity(insertActivity: InsertActivity): Promise<Activity> {
    const id = this.activityCurrentId++;
    const now = new Date();
    const activity: Activity = { ...insertActivity, id, timestamp: now };
    this.activities.set(id, activity);
    return activity;
  }
  
  // Contact operations
  async createContact(insertContact: InsertContact): Promise<Contact> {
    const id = this.contactCurrentId++;
    const now = new Date();
    const contact: Contact = { ...insertContact, id, timestamp: now };
    this.contacts.set(id, contact);
    return contact;
  }
  
  // Dashboard statistics
  async getDashboardStats(): Promise<{
    totalSpots: number;
    availableSpots: number;
    occupiedSpots: number;
    reservedSpots: number;
  }> {
    const allSpots = await this.getAllParkingSpots();
    const availableSpots = await this.getAvailableParkingSpots();
    const occupiedSpots = await this.getOccupiedParkingSpots();
    const reservedSpots = await this.getReservedParkingSpots();
    
    return {
      totalSpots: allSpots.length,
      availableSpots: availableSpots.length,
      occupiedSpots: occupiedSpots.length,
      reservedSpots: reservedSpots.length
    };
  }
}

export const storage = new MemStorage();
