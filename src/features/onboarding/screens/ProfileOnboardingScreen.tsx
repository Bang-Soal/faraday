import React, {useState} from 'react';
import {Pressable, StyleSheet, Text, View} from 'react-native';
import {useMutation, useQuery} from '@tanstack/react-query';
import {AuthLayout} from '../../../components/Layout/AuthLayout';
import {BangSoalTextField} from '../../../components/TextField/BangSoalTextField';
import {SelectSheet} from '../../../components/BottomSheet/SelectSheet';
import {BangSoalButton} from '../../../components/Button/BangSoalButton';
import {colors, fonts, fontWeights} from '../../../theme';
import {PtnChoice} from '../data';
import {
  getPtnList,
  submitOnboarding,
  OnboardingPayload,
} from '../api/onboardingApi';
import {useAuthStore} from '../../../app/store/authStore';
import {ApiError} from '../../../lib/api/client';
import {toIndonesianPhone} from '../../../utils/phone';

export function ProfileOnboardingScreen() {
  const user = useAuthStore(state => state.user);
  const setUser = useAuthStore(state => state.setUser);
  const clear = useAuthStore(state => state.clear);

  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [school, setSchool] = useState('');
  const [year, setYear] = useState('');
  const [source, setSource] = useState('');
  const [serverError, setServerError] = useState<string | undefined>();
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

  const ptnQuery = useQuery({queryKey: ['ptn'], queryFn: getPtnList});
  const ptnList = ptnQuery.data ?? [];

  const submitMutation = useMutation({
    mutationFn: (payload: OnboardingPayload) => submitOnboarding(payload),
    // Merge the returned user (now has onboard_date) → AppNavigator routes home.
    onSuccess: updated => setUser({...user, ...updated}),
    onError: err =>
      setServerError(
        err instanceof ApiError ? err.message : 'Gagal menyimpan. Coba lagi.',
      ),
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
    ptnList.find(item => item.name === selectedPtn[choice]);

  const selectPtn = (choice: PtnChoice, value: string) => {
    setSelectedPtn({...selectedPtn, [choice]: value});
    setSelectedProdi({...selectedProdi, [choice]: ''});
  };

  const submit = () => {
    if (!canSubmit) {
      return;
    }
    setServerError(undefined);
    const payload: OnboardingPayload = {
      full_name: name,
      password,
      phone_number: toIndonesianPhone(whatsapp),
      highschool: school,
      highschool_year: year,
      source,
      email: user?.email ?? '',
      choosen_university_one: selectedPtn.first,
      choosen_major_one: selectedProdi.first,
      ...(selectedPtn.second
        ? {
            choosen_university_two: selectedPtn.second,
            choosen_major_two: selectedProdi.second,
          }
        : {}),
      ...(selectedPtn.third
        ? {
            choosen_university_three: selectedPtn.third,
            choosen_major_three: selectedProdi.third,
          }
        : {}),
    };
    submitMutation.mutate(payload);
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
            searchPlaceholder="Cari PTN..."
            value={selectedPtn.first}
            items={ptnList.map(item => item.name)}
            onSelect={value => selectPtn('first', value)}
          />
          {selectedPtn.first ? (
            <SelectSheet
              required
              label="Pilihan Prodi Pertama"
              title={`Pilih Prodi ${selectedPtn.first}`}
              placeholder="Pilih Prodi"
              searchPlaceholder="Cari Prodi..."
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
              searchPlaceholder="Cari PTN..."
              value={selectedPtn.second}
              items={ptnList.map(item => item.name)}
              onSelect={value => selectPtn('second', value)}
            />
          ) : null}
          {selectedPtn.second ? (
            <SelectSheet
              label="Pilihan Prodi Kedua"
              title={`Pilih Prodi ${selectedPtn.second}`}
              placeholder="Pilih Prodi"
              searchPlaceholder="Cari Prodi..."
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
              searchPlaceholder="Cari PTN..."
              value={selectedPtn.third}
              items={ptnList.map(item => item.name)}
              onSelect={value => selectPtn('third', value)}
            />
          ) : null}
          {selectedPtn.third ? (
            <SelectSheet
              label="Pilihan Prodi Ketiga"
              title={`Pilih Prodi ${selectedPtn.third}`}
              placeholder="Pilih Prodi"
              searchPlaceholder="Cari Prodi..."
              value={selectedProdi.third}
              items={selectedPtnData('third')?.prodi ?? []}
              onSelect={value =>
                setSelectedProdi({...selectedProdi, third: value})
              }
            />
          ) : null}
          <BangSoalButton
            label={submitMutation.isPending ? 'Menyimpan...' : 'Lanjut'}
            variant="grayLight"
            disabled={!canSubmit || submitMutation.isPending}
            trailing="→"
            onPress={submit}
          />
          {serverError ? (
            <Text style={styles.serverError}>{serverError}</Text>
          ) : null}
          <Pressable onPress={() => clear()} style={styles.exitWrap}>
            <Text style={styles.exitText}>Bukan kamu? Keluar</Text>
          </Pressable>
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
  serverError: {
    color: colors.white,
    fontFamily: fonts.quicksand,
    fontSize: 13,
    fontWeight: fontWeights.semiBold,
    textAlign: 'center',
  },
  exitWrap: {
    alignItems: 'center',
    paddingTop: 4,
  },
  exitText: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontFamily: fonts.quicksand,
    fontSize: 13,
    fontWeight: fontWeights.semiBold,
    textDecorationLine: 'underline',
  },
});
