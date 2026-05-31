import React, {useState} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {AuthLayout} from '../../../components/Layout/AuthLayout';
import {BangSoalTextField} from '../../../components/TextField/BangSoalTextField';
import {SelectSheet} from '../../../components/BottomSheet/SelectSheet';
import {BangSoalButton} from '../../../components/Button/BangSoalButton';
import {colors, fonts, fontWeights} from '../../../theme';
import {PTN_OPTIONS, PtnChoice} from '../data';

export function ProfileOnboardingScreen({onLogout}: {onLogout: () => void}) {
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [school, setSchool] = useState('');
  const [year, setYear] = useState('');
  const [source, setSource] = useState('');
  const [selectedPtn, setSelectedPtn] = useState<Record<PtnChoice, string>>({
    first: '',
    second: '',
    third: '',
  });
  const [selectedProdi, setSelectedProdi] = useState<Record<PtnChoice, string>>({
    first: '',
    second: '',
    third: '',
  });

  const canSubmit =
    name &&
    password &&
    whatsapp &&
    school &&
    year &&
    source &&
    selectedPtn.first &&
    selectedProdi.first &&
    (!selectedPtn.second || selectedProdi.second) &&
    (!selectedPtn.third || selectedProdi.third);

  const selectedPtnData = (choice: PtnChoice) =>
    PTN_OPTIONS.find(item => item.name === selectedPtn[choice]);

  const selectPtn = (choice: PtnChoice, value: string) => {
    setSelectedPtn({...selectedPtn, [choice]: value});
    setSelectedProdi({...selectedProdi, [choice]: ''});
  };

  return (
    <AuthLayout>
      <View style={styles.wrap}>
        <Text style={styles.title}>
          Mulai latihan UTBK dan UM kamu bersama BangSoal!
        </Text>
        <View style={styles.form}>
          <BangSoalTextField
            required
            label="Nama Panggilan"
            hintText="Patricia"
            value={name}
            onChangeText={setName}
          />
          <BangSoalTextField
            required
            label="Password"
            hintText="*****"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
          <BangSoalTextField
            required
            label="Nomor Whatsapp"
            hintText="08119950216"
            value={whatsapp}
            onChangeText={setWhatsapp}
            keyboardType="phone-pad"
          />
          <BangSoalTextField
            required
            label="Asal SMA"
            hintText="SMAN 3 Jakarta"
            value={school}
            onChangeText={setSchool}
          />
          <BangSoalTextField
            required
            label="Tahun Kelulusan"
            hintText="2024"
            value={year}
            onChangeText={setYear}
            keyboardType="number-pad"
          />
          <BangSoalTextField
            required
            label="Tahu BangSoal dari mana?"
            hintText="Teman, media social, etc."
            value={source}
            onChangeText={setSource}
          />
          <SelectSheet
            required
            label="Pilihan PTN Pertama"
            title="Pilih PTN"
            placeholder="Pilih PTN"
            value={selectedPtn.first}
            items={PTN_OPTIONS.map(item => item.name)}
            onSelect={value => selectPtn('first', value)}
          />
          {selectedPtn.first ? (
            <SelectSheet
              required
              label="Pilihan Prodi Pertama"
              title={`Pilih Prodi ${selectedPtn.first}`}
              placeholder="Pilih Prodi"
              value={selectedProdi.first}
              items={selectedPtnData('first')?.prodi ?? []}
              onSelect={value =>
                setSelectedProdi({...selectedProdi, first: value})
              }
            />
          ) : null}
          {selectedPtn.first ? (
            <SelectSheet
              label="Pilihan PTN Kedua"
              title="Pilih PTN"
              placeholder="Pilih PTN"
              value={selectedPtn.second}
              items={PTN_OPTIONS.map(item => item.name)}
              onSelect={value => selectPtn('second', value)}
            />
          ) : null}
          {selectedPtn.second ? (
            <SelectSheet
              label="Pilihan Prodi Kedua"
              title={`Pilih Prodi ${selectedPtn.second}`}
              placeholder="Pilih Prodi"
              value={selectedProdi.second}
              items={selectedPtnData('second')?.prodi ?? []}
              onSelect={value =>
                setSelectedProdi({...selectedProdi, second: value})
              }
            />
          ) : null}
          {selectedPtn.first ? (
            <SelectSheet
              label="Pilihan PTN Ketiga"
              title="Pilih PTN"
              placeholder="Pilih PTN"
              value={selectedPtn.third}
              items={PTN_OPTIONS.map(item => item.name)}
              onSelect={value => selectPtn('third', value)}
            />
          ) : null}
          {selectedPtn.third ? (
            <SelectSheet
              label="Pilihan Prodi Ketiga"
              title={`Pilih Prodi ${selectedPtn.third}`}
              placeholder="Pilih Prodi"
              value={selectedProdi.third}
              items={selectedPtnData('third')?.prodi ?? []}
              onSelect={value =>
                setSelectedProdi({...selectedProdi, third: value})
              }
            />
          ) : null}
          <BangSoalButton
            label="Lanjut"
            variant="grayLight"
            disabled={!canSubmit}
            trailing="→"
          />
          <BangSoalButton
            label="Logout"
            variant="grayLight"
            onPress={onLogout}
          />
        </View>
      </View>
    </AuthLayout>
  );
}

const styles = StyleSheet.create({
  wrap: {
    paddingTop: 50,
  },
  title: {
    color: colors.white,
    fontFamily: fonts.quicksand,
    fontSize: 38,
    fontWeight: fontWeights.bold,
    lineHeight: 47.5,
  },
  form: {
    gap: 16,
    marginTop: 70,
  },
});
