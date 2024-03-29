export enum CONVERSATION_TYPE_ENUM {
  PRIVATE = 'private',
  GROUP = 'group',
  CHANNEL = 'channel',
  SYSTEM = 'system',
  // BROADCAST = 4,
  // SECRET = 5,
  // CUSTOM = 6,
}

export const CONVERSATION_TYPES = Object.values(CONVERSATION_TYPE_ENUM);

export enum CONVERSATION_ROLE_ENUM {
  OWNER = 'owner',
  ADMIN = 'admin',
  MEMBER = 'member',
  GUEST = 'guest',
  // BLOCKED = 4,
  // MUTED = 5,
  // RESTRICTED = 6,
  // SILENT = 7,
}

export const CONVERSATION_ROLES = Object.values(CONVERSATION_ROLE_ENUM);
