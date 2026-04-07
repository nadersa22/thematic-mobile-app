import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, RADIUS } from '../constants/theme';
import { useNavigation, useRoute } from '@react-navigation/native';

export function NotFoundScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const query = route.params?.query;

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.iconWrap}>
          <Ionicons name="alert-circle" size={64} color={COLORS.primary} />
        </View>
        <Text style={styles.code}>404</Text>
        <Text style={styles.title}>Page Not Found</Text>
        {query ? (
          <Text style={styles.subtitle}>Search results for "{query}" aren't available yet.</Text>
        ) : (
          <Text style={styles.subtitle}>This page doesn't exist or hasn't been built yet.</Text>
        )}
<TouchableOpacity
  style={styles.btn}
  onPress={() => navigation.navigate('Main', { screen: 'Home' })}>
          <Ionicons name="home" size={18} color="#fff" />
          <Text style={styles.btnText}>Go Home</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Text style={styles.backBtnText}>← Go Back</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background, alignItems: 'center', justifyContent: 'center' },
  content: { alignItems: 'center', padding: SPACING.xl },
  iconWrap: { width: 100, height: 100, borderRadius: 50, backgroundColor: COLORS.primaryGlow, alignItems: 'center', justifyContent: 'center', marginBottom: SPACING.lg },
  code: { color: COLORS.primary, fontSize: 72, fontWeight: '900', lineHeight: 80 },
  title: { color: COLORS.textPrimary, fontSize: 22, fontWeight: '700', marginBottom: SPACING.sm },
  subtitle: { color: COLORS.textSecondary, fontSize: 15, textAlign: 'center', lineHeight: 22, marginBottom: SPACING.xl },
  btn: { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: COLORS.primary, paddingHorizontal: 28, paddingVertical: 14, borderRadius: RADIUS.md, marginBottom: SPACING.sm },
  btnText: { color: '#fff', fontWeight: '700', fontSize: 16 },
  backBtn: { paddingVertical: 10 },
  backBtnText: { color: COLORS.textSecondary, fontSize: 15 },
});
