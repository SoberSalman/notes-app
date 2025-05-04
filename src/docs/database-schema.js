/**
 * DATABASE SCHEMA DOCUMENTATION
 * =============================
 * 
 * This file documents the MongoDB schemas used in the Notes App.
 * It's for documentation purposes only and is not used in the application.
 */

/**
 * User Schema
 * ===========
 * Collection name: users
 * 
 * {
 *   _id: ObjectId,            // Automatically generated MongoDB ID
 *   name: String,             // User's full name (optional, trimmed)
 *   email: String,            // User's email address (required, unique, trimmed)
 *   password: String,         // Encrypted password using bcrypt (required)
 *   createdAt: Date,          // Automatically added by timestamps
 *   updatedAt: Date           // Automatically added by timestamps
 * }
 * 
 * Methods:
 * - encryptPassword(password): Encrypts a password using bcrypt
 * - matchPassword(password): Compares a password with the stored hash
 */

/**
 * Note Schema
 * ===========
 * Collection name: notes
 * 
 * {
 *   _id: ObjectId,            // Automatically generated MongoDB ID
 *   title: String,            // Note title (required)
 *   description: String,      // Note content/description (required)
 *   user: String,             // Reference to user ID who owns this note (required)
 *   fileUrl: String,          // Base64 encoded file data (optional)
 *   fileType: String,         // MIME type of the attached file (optional)
 *   createdAt: Date,          // Automatically added by timestamps
 *   updatedAt: Date           // Automatically added by timestamps
 * }
 */

/**
 * Session Schema (Created by connect-mongo)
 * =========================================
 * Collection name: sessions
 * 
 * {
 *   _id: ObjectId,            // Automatically generated MongoDB ID
 *   expires: Date,            // Session expiration date
 *   session: String           // Serialized session data
 * }
 */

/**
 * Database Relationships
 * ======================
 * 
 * 1. One-to-Many: User to Notes
 *    - A user can have multiple notes
 *    - Each note belongs to exactly one user
 *    - Relationship maintained by the 'user' field in the Note schema
 * 
 * 2. No direct relationships between other collections
 */

/**
 * Indexes
 * =======
 * 
 * Users collection:
 * - email: unique index
 * 
 * Sessions collection:
 * - expires: TTL index (automatically removes expired sessions)
 */

/**
 * Example Documents
 * ================
 * 
 * User document example:
 * {
 *   _id: ObjectId("60d5ec9af682fbd12a0f4d8b"),
 *   name: "John Doe",
 *   email: "john@example.com",
 *   password: "$2a$10$XyZ123...", // Hashed password
 *   createdAt: ISODate("2023-01-15T08:30:00Z"),
 *   updatedAt: ISODate("2023-01-15T08:30:00Z")
 * }
 * 
 * Note document example:
 * {
 *   _id: ObjectId("60d5ec9af682fbd12a0f4d8c"),
 *   title: "Meeting Notes",
 *   description: "Discussion about new project requirements",
 *   user: "60d5ec9af682fbd12a0f4d8b",
 *   fileUrl: "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEA...", // Base64 encoded file
 *   fileType: "image/jpeg",
 *   createdAt: ISODate("2023-01-15T10:30:00Z"),
 *   updatedAt: ISODate("2023-01-15T10:30:00Z")
 * }
 */