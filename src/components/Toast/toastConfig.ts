import {
  AlertTriangle,
  CheckCircle2,
  Info,
  XCircle,
} from 'lucide-react-native';
import {colors} from '../../theme';

export type ToastVariant = 'success' | 'info' | 'warning' | 'error';

type ToastStyle = {
  Icon: typeof XCircle;
  color: string;
  background: string;
};

// Mirrors curie's BangSoalSnackbarVariants: a light tinted card with a colored
// icon + text per variant (curie uses a left→white gradient; we approximate with
// the variant's lightest tint, which reads the same on the green auth background).
export const TOAST_VARIANTS: Record<ToastVariant, ToastStyle> = {
  success: {Icon: CheckCircle2, color: colors.primary[600], background: colors.primary[50]},
  info: {Icon: Info, color: colors.slate[700], background: colors.slate[100]},
  warning: {Icon: AlertTriangle, color: '#B45309', background: colors.yellow[50]},
  error: {Icon: XCircle, color: colors.rose[600], background: colors.rose[50]},
};
