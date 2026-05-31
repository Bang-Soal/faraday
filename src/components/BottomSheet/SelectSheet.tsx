import React, {useMemo, useState} from 'react';
import {
  ImageBackground,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import {colors, fonts, fontWeights} from '../../theme';

const bottomSheetBackground = require('../../assets/images/bottom-sheet-bg.png');

export function SelectSheet({
  label,
  required,
  value,
  placeholder,
  title,
  items,
  onSelect,
}: {
  label: string;
  required?: boolean;
  value: string;
  placeholder: string;
  title: string;
  items: string[];
  onSelect: (value: string) => void;
}) {
  const [visible, setVisible] = useState(false);
  const [query, setQuery] = useState('');
  const filteredItems = useMemo(
    () =>
      items.filter(item => item.toLowerCase().includes(query.toLowerCase())),
    [items, query],
  );

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
        onRequestClose={() => setVisible(false)}>
        <Pressable style={styles.backdrop} onPress={() => setVisible(false)}>
          <Pressable style={styles.sheet}>
            <ImageBackground
              source={bottomSheetBackground}
              resizeMode="stretch"
              style={styles.sheetBackground}>
              <Text style={styles.sheetTitle}>{title}</Text>
              <View style={styles.searchShell}>
                <TextInput
                  value={query}
                  onChangeText={setQuery}
                  placeholder="Cari PTN..."
                  placeholderTextColor={colors.slate[500]}
                  style={styles.searchInput}
                />
              </View>
              <ScrollView style={styles.list}>
                {filteredItems.map(item => (
                  <Pressable
                    key={item}
                    style={styles.item}
                    onPress={() => {
                      onSelect(item);
                      setQuery('');
                      setVisible(false);
                    }}>
                    <Text style={styles.itemText}>{item}</Text>
                  </Pressable>
                ))}
              </ScrollView>
            </ImageBackground>
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
}

function FieldLabel({
  label,
  required,
}: {
  label: string;
  required?: boolean;
}) {
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
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    height: '50%',
    overflow: 'hidden',
  },
  sheetBackground: {
    flex: 1,
    paddingBottom: 24,
    paddingHorizontal: 16,
    paddingTop: 24,
  },
  sheetTitle: {
    color: colors.black,
    fontFamily: fonts.quicksand,
    fontSize: 16,
    fontWeight: fontWeights.bold,
    lineHeight: 19,
    textAlign: 'center',
  },
  searchShell: {
    backgroundColor: '#E5E7EB',
    borderRadius: 8,
    marginTop: 16,
  },
  searchInput: {
    color: '#111827',
    fontFamily: fonts.quicksand,
    fontSize: 14,
    fontWeight: fontWeights.semiBold,
    minHeight: 46,
    paddingHorizontal: 12,
  },
  list: {
    marginTop: 12,
  },
  item: {
    borderBottomColor: 'rgba(0, 0, 0, 0.1)',
    borderBottomWidth: StyleSheet.hairlineWidth,
    paddingHorizontal: 8,
    paddingVertical: 14,
  },
  itemText: {
    color: colors.black,
    fontFamily: fonts.quicksand,
    fontSize: 14,
    fontWeight: fontWeights.semiBold,
    lineHeight: 17,
  },
});
