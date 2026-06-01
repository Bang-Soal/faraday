import {Image} from 'react-native';

// Same S3 bucket dijkstra serves subject glyphs from. The `/dashboard` (Latihan
// Soal) endpoint already returns a full `icon` URL per subject; the tryout
// subject-analytics endpoint does not, so we resolve those by name below.
const BUCKET = 'https://bangsoal.s3.ap-southeast-1.amazonaws.com/static';

// Only three distinct glyphs exist; several subtests share one.
const ICON_FILE_BY_SUBJECT: Record<string, string> = {
  'Kemampuan Penalaran Umum': 'brain.png',
  'Penalaran Umum': 'brain.png',
  'Pengetahuan dan Pemahaman Umum': 'brain.png',
  'Pengetahuan Kuantitatif': 'pk.png',
  'Penalaran Matematika': 'pk.png',
  'Kemampuan Memahami Bacaan dan Menulis': 'pbm.png',
  'Pemahaman Bacaan dan Menulis': 'pbm.png',
  'Literasi dalam Bahasa Indonesia': 'pbm.png',
  'Bahasa Indonesia': 'pbm.png',
  'Literasi dalam Bahasa Inggris': 'pbm.png',
  'Bahasa Inggris': 'pbm.png',
};

/** Resolve a subject icon URL by name (same bucket as the web app). */
export function subjectIconUrl(name: string): string | undefined {
  const file = ICON_FILE_BY_SUBJECT[name];
  return file ? `${BUCKET}/${file}` : undefined;
}

/** Renders a remote subject icon; renders nothing when no URL is available. */
export function SubjectIcon({uri, size = 28}: {uri?: string; size?: number}) {
  if (!uri) {
    return null;
  }
  return (
    <Image
      source={{uri}}
      style={{width: size, height: size}}
      resizeMode="contain"
    />
  );
}
