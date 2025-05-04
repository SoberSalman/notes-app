# Notes App Database Schema

## Collections

### Users
Stores user account information.

| Field | Type | Description | Properties |
|-------|------|-------------|------------|
| _id | ObjectId | MongoDB document ID | Auto-generated |
| name | String | User's full name | Optional, Trimmed |
| email | String | User's email address | Required, Unique, Trimmed |
| password | String | Encrypted password | Required, Hashed with bcrypt |
| createdAt | Date | Creation timestamp | Auto-generated |
| updatedAt | Date | Last update timestamp | Auto-generated |

### Notes
Stores user notes with optional file attachments.

| Field | Type | Description | Properties |
|-------|------|-------------|------------|
| _id | ObjectId | MongoDB document ID | Auto-generated |
| title | String | Note title | Required |
| description | String | Note content | Required |
| user | String | Reference to user ID | Required |
| fileUrl | String | Base64 encoded file data | Optional |
| fileType | String | MIME type of file | Optional |
| createdAt | Date | Creation timestamp | Auto-generated |
| updatedAt | Date | Last update timestamp | Auto-generated |

### Sessions
Managed by connect-mongo, stores user sessions.

| Field | Type | Description | Properties |
|-------|------|-------------|------------|
| _id | ObjectId | MongoDB document ID | Auto-generated |
| expires | Date | Session expiration date | TTL index |
| session | String | Serialized session data | - |

## Relationships

```
┌─────────┐       ┌─────────┐
│         │       │         │
│  Users  │1     *│  Notes  │
│         ├───────┤         │
│         │       │         │
└─────────┘       └─────────┘
```

- One-to-Many: A user can have multiple notes
- Each note belongs to exactly one user
- Relationship maintained by the 'user' field in the Note schema

## Indexes

- Users collection: `email` (unique)
- Sessions collection: `expires` (TTL)

## Data Flow

1. User registers/logs in → User document created/accessed
2. User creates a note → Note document created with reference to user
3. User uploads a file → File stored as base64 in the note document
4. User views notes → Notes filtered by user ID
5. User views file → File retrieved from note document and served with appropriate MIME type