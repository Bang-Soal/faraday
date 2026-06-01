import {useMemo, useState} from 'react';
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import {Check, Search, X} from 'lucide-react-native';
import {colors, fonts, fontWeights} from '../../theme';

export function SelectSheet({
  label,
  required,
  value,
  placeholder,
  title,
  items,
  onSelect,
  searchPlaceholder = 'Cari...',
}: {
  label: string;
  required?: boolean;
  value: string;
  placeholder: string;
  title: string;
  items: string[];
  onSelect: (value: string) => void;
  searchPlaceholder?: string;
}) {
  const [visible, setVisible] = useState(false);
  const [query, setQuery] = useState('');
  const filteredItems = useMemo(
    () =>
      items.filter(item => item.toLowerCase().includes(query.toLowerCase())),
    [items, query],
  );

  const close = () => {
    setQuery('');
    setVisible(false);
  };

  return (
    <View>
      <FieldLabel label={label} required={required} />
      <Pressable style={styles.trigger} onPress={() => setVisible(true)}>
        <Text style={[styles.value, !value && styles.placeholder]}>
          {value || placeholder}
        </Text>
        <Text style={styles.chevron}>⌄</Text>
      </Pressable>

      <Modal
        animationType="slide"
        transparent
        visible={visible}
        onRequestClose={close}>
        <Pressable style={styles.backdrop} onPress={close}>
          <Pressable style={styles.sheet}>
            <View style={styles.header}>
              <Text style={styles.sheetTitle}>{title}</Text>
              <Pressable
                accessibilityRole="button"
                hitSlop={8}
                onPress={close}
                style={styles.closeButton}>
                <X size={20} color={colors.gray[900]} />
              </Pressable>
            </View>

            <View style={styles.searchShell}>
              <Search size={18} color={colors.slate[400]} />
              <TextInput
                value={query}
                onChangeText={setQuery}
                placeholder={searchPlaceholder}
                placeholderTextColor={colors.slate[400]}
                style={styles.searchInput}
              />
            </View>

            <ScrollView
              style={styles.list}
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}>
              {filteredItems.map(item => {
                const selected = item === value;
                return (
                  <Pressable
                    key={item}
                    style={[styles.item, selected && styles.itemSelected]}
                    onPress={() => {
                      onSelect(item);
                      close();
                    }}>
                    <Text
                      style={[
                        styles.itemText,
                        selected && styles.itemTextSelected,
                      ]}>
                      {item}
                    </Text>
                    {selected ? (
                      <Check size={18} color={colors.primary[600]} />
                    ) : null}
                  </Pressable>
                );
              })}
            </ScrollView>
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
}

function FieldLabel({label, required}: {label: string; required?: boolean}) {
  return (
    <View style={styles.labelRow}>
      <Text style={styles.label}>{label}</Text>
      {required ? <Text style={styles.requiredMark}> *</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  labelRow: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  label: {
    color: colors.white,
    fontFamily: fonts.quicksand,
    fontSize: 16,
    fontWeight: fontWeights.bold,
    lineHeight: 19,
  },
  requiredMark: {
    color: colors.danger,
    fontFamily: fonts.quicksand,
    fontSize: 16,
    fontWeight: fontWeights.bold,
    lineHeight: 19,
  },
  trigger: {
    alignItems: 'center',
    backgroundColor: 'rgba(6, 78, 59, 0.3)',
    borderRadius: 12,
    flexDirection: 'row',
    height: 46,
    justifyContent: 'space-between',
    paddingLeft: 16,
    paddingRight: 8,
  },
  value: {
    color: colors.white,
    flex: 1,
    fontFamily: fonts.quicksand,
    fontSize: 14,
    fontWeight: fontWeights.semiBold,
    lineHeight: 17,
  },
  placeholder: {
    color: 'rgba(255, 255, 255, 0.47)',
  },
  chevron: {
    color: colors.white,
    fontFamily: fonts.quicksand,
    fontSize: 22,
    fontWeight: fontWeights.bold,
    lineHeight: 22,
  },
  backdrop: {
    backgroundColor: 'rgba(0, 0, 0, 0.35)',
    flex: 1,
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: colors.white,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    height: '85%',
    paddingBottom: 16,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  header: {
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 28,
  },
  sheetTitle: {
    color: colors.gray[900],
    fontFamily: fonts.quicksand,
    fontSize: 16,
    fontWeight: fontWeights.bold,
    lineHeight: 20,
    textAlign: 'center',
  },
  closeButton: {
    position: 'absolute',
    right: 0,
    top: 0,
  },
  searchShell: {
    alignItems: 'center',
    backgroundColor: colors.gray[100],
    borderRadius: 9999,
    flexDirection: 'row',
    gap: 8,
    marginTop: 20,
    paddingHorizontal: 16,
  },
  searchInput: {
    color: colors.gray[900],
    flex: 1,
    fontFamily: fonts.quicksand,
    fontSize: 14,
    fontWeight: fontWeights.semiBold,
    minHeight: 46,
    padding: 0,
  },
  list: {
    marginTop: 8,
  },
  item: {
    alignItems: 'center',
    borderBottomColor: colors.gray[100],
    borderBottomWidth: StyleSheet.hairlineWidth,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingVertical: 16,
  },
  itemSelected: {
    backgroundColor: colors.primary[100],
    borderBottomColor: 'transparent',
    borderRadius: 12,
  },
  itemText: {
    color: colors.gray[900],
    fontFamily: fonts.quicksand,
    fontSize: 15,
    fontWeight: fontWeights.semiBold,
    lineHeight: 19,
  },
  itemTextSelected: {
    color: colors.primary[700],
    fontWeight: fontWeights.bold,
  },
});
