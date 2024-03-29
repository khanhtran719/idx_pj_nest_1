import { MEDIA_TYPE_ENUM } from '@/constants';

export function getType(mine: string): MEDIA_TYPE_ENUM {
  if (mine.includes('image')) {
    return MEDIA_TYPE_ENUM.IMAGE;
  } else if (mine.includes('video')) {
    return MEDIA_TYPE_ENUM.VIDEO;
  } else {
    return MEDIA_TYPE_ENUM.OTHER;
  }
}
