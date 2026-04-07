import React, { useState, useRef, useEffect } from 'react';
import {
  View, Text, TouchableOpacity, TextInput, StyleSheet,
  Modal, Animated, Dimensions, ActivityIndicator, ScrollView,
} from 'react-native';
import { COLORS, SPACING, RADIUS, FONTS } from '../constants/theme';
import { Ionicons } from '@expo/vector-icons';

const { width: SCREEN_W, height: SCREEN_H } = Dimensions.get('window');

export function Button({ label, onPress, variant = 'primary', size = 'md', disabled = false, loading = false, icon }: any) {
  const styles = buttonStyles;
  const variantStyle = variant === 'primary' ? styles.primary
    : variant === 'outline' ? styles.outline
    : variant === 'ghost' ? styles.ghost
    : styles.danger;
  const sizeStyle = size === 'sm' ? styles.sm : size === 'lg' ? styles.lg : styles.mdSize;
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      style={[styles.base, variantStyle, sizeStyle, (disabled || loading) && styles.disabled]}
      activeOpacity={0.8}
    >
      {loading ? <ActivityIndicator size="small" color={COLORS.textPrimary} /> : (
        <View style={styles.row}>
          {icon && <Ionicons name={icon} size={16} color={COLORS.textPrimary} style={{ marginRight: 6 }} />}
          <Text style={[styles.label, variant === 'outline' && styles.outlineLabel]}>{label}</Text>
        </View>
      )}
    </TouchableOpacity>
  );
}

const buttonStyles = StyleSheet.create({
  base: { borderRadius: RADIUS.md, alignItems: 'center', justifyContent: 'center' },
  row: { flexDirection: 'row', alignItems: 'center' },
  primary: { backgroundColor: COLORS.primary },
  outline: { backgroundColor: 'transparent', borderWidth: 1, borderColor: COLORS.primary },
  ghost: { backgroundColor: 'transparent' },
  danger: { backgroundColor: COLORS.accent },
  sm: { paddingHorizontal: 12, paddingVertical: 7 },
  mdSize: { paddingHorizontal: 20, paddingVertical: 11 },
  lg: { paddingHorizontal: 28, paddingVertical: 14 },
  disabled: { opacity: 0.4 },
  label: { color: COLORS.textPrimary, fontWeight: '600', fontSize: 14 },
  outlineLabel: { color: COLORS.primaryLight },
});

export function Input({ placeholder, value, onChangeText, multiline = false, label, secureTextEntry = false, icon }: any) {
  return (
    <View style={inputStyles.wrapper}>
      {label && <Text style={inputStyles.label}>{label}</Text>}
      <View style={inputStyles.container}>
        {icon && <Ionicons name={icon} size={18} color={COLORS.textTertiary} style={{ marginRight: 8 }} />}
        <TextInput
          style={[inputStyles.input, multiline && inputStyles.multiline]}
          placeholder={placeholder}
          placeholderTextColor={COLORS.textMuted}
          value={value}
          onChangeText={onChangeText}
          multiline={multiline}
          secureTextEntry={secureTextEntry}
          numberOfLines={multiline ? 4 : 1}
        />
      </View>
    </View>
  );
}

const inputStyles = StyleSheet.create({
  wrapper: { marginBottom: SPACING.md },
  label: { color: COLORS.textSecondary, fontSize: 12, fontWeight: '600', marginBottom: 6, textTransform: 'uppercase', letterSpacing: 0.8 },
  container: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.surfaceAlt, borderRadius: RADIUS.md, borderWidth: 1, borderColor: COLORS.border, paddingHorizontal: SPACING.md },
  input: { flex: 1, color: COLORS.textPrimary, fontSize: 15, paddingVertical: 12 },
  multiline: { height: 100, textAlignVertical: 'top' },
});

export function Card({ children, style, onPress }: any) {
  const Wrap: any = onPress ? TouchableOpacity : View;
  return (
    <Wrap onPress={onPress} activeOpacity={0.85} style={[cardStyles.card, style]}>
      {children}
    </Wrap>
  );
}

const cardStyles = StyleSheet.create({
  card: { backgroundColor: COLORS.card, borderRadius: RADIUS.lg, borderWidth: 1, borderColor: COLORS.border, padding: SPACING.md },
});

export function Badge({ label, color = COLORS.primary }: any) {
  return (
    <View style={[badgeStyles.badge, { backgroundColor: color + '25', borderColor: color + '50' }]}>
      <Text style={[badgeStyles.text, { color }]}>{label}</Text>
    </View>
  );
}

const badgeStyles = StyleSheet.create({
  badge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: RADIUS.full, borderWidth: 1 },
  text: { fontSize: 11, fontWeight: '700', letterSpacing: 0.5 },
});

export function Avatar({ name, size = 40, color = COLORS.primary }: any) {
  const initials = name?.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase() || '??';
  return (
    <View style={[avatarStyles.avatar, { width: size, height: size, borderRadius: size / 2, backgroundColor: color + '30', borderColor: color + '60', borderWidth: 1.5 }]}>
      <Text style={[avatarStyles.text, { fontSize: size * 0.35, color }]}>{initials}</Text>
    </View>
  );
}

const avatarStyles = StyleSheet.create({
  avatar: { alignItems: 'center', justifyContent: 'center' },
  text: { fontWeight: '700' },
});

export function PlaylistCover({ color = COLORS.primary, size = 56 }: any) {
  return (
    <View style={[coverStyles.cover, { width: size, height: size, borderRadius: size * 0.2, backgroundColor: color + '20', borderColor: color + '40', borderWidth: 1 }]}>
      <Ionicons name="musical-notes" size={size * 0.4} color={color} />
    </View>
  );
}

const coverStyles = StyleSheet.create({
  cover: { alignItems: 'center', justifyContent: 'center' },
});

export function Divider({ style }: any) {
  return <View style={[{ height: 1, backgroundColor: COLORS.border, marginVertical: SPACING.md }, style]} />;
}

export function SectionHeader({ title, action, onAction }: any) {
  return (
    <View style={shStyles.row}>
      <Text style={shStyles.title}>{title}</Text>
      {action && <TouchableOpacity onPress={onAction}><Text style={shStyles.action}>{action}</Text></TouchableOpacity>}
    </View>
  );
}

const shStyles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: SPACING.md },
  title: { color: COLORS.textPrimary, fontWeight: '700', fontSize: 17 },
  action: { color: COLORS.primary, fontSize: 13, fontWeight: '600' },
});

export function useToast() {
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);
  const opacity = useRef(new Animated.Value(0)).current;

  const show = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    setToast({ message, type });
    Animated.sequence([
      Animated.timing(opacity, { toValue: 1, duration: 250, useNativeDriver: true }),
      Animated.delay(2000),
      Animated.timing(opacity, { toValue: 0, duration: 300, useNativeDriver: true }),
    ]).start(() => setToast(null));
  };

  const ToastComponent = toast ? (
    <Animated.View style={[toastStyles.toast, { opacity }, toast.type === 'error' && toastStyles.error, toast.type === 'info' && toastStyles.info]}>
      <Ionicons name={toast.type === 'success' ? 'checkmark-circle' : toast.type === 'error' ? 'alert-circle' : 'information-circle'} size={18} color={COLORS.textPrimary} />
      <Text style={toastStyles.text}>{toast.message}</Text>
    </Animated.View>
  ) : null;

  return { show, ToastComponent };
}

const toastStyles = StyleSheet.create({
  toast: { position: 'absolute', bottom: 100, alignSelf: 'center', flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.success, paddingHorizontal: 16, paddingVertical: 10, borderRadius: RADIUS.full, gap: 8, zIndex: 9999, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 10 },
  error: { backgroundColor: COLORS.error },
  info: { backgroundColor: COLORS.primary },
  text: { color: COLORS.textPrimary, fontWeight: '600', fontSize: 13 },
});

export function EditModal({ visible, title, fields, onSave, onClose, loading = false }: any) {
  const [values, setValues] = useState<Record<string, string>>({});
  useEffect(() => {
    if (visible && fields) {
      const init: Record<string, string> = {};
      fields.forEach((f: any) => { init[f.key] = f.value || ''; });
      setValues(init);
    }
  }, [visible, fields]);

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={modalStyles.backdrop}>
        <View style={modalStyles.sheet}>
          <View style={modalStyles.header}>
            <Text style={modalStyles.title}>{title}</Text>
            <TouchableOpacity onPress={onClose}><Ionicons name="close" size={22} color={COLORS.textSecondary} /></TouchableOpacity>
          </View>
          <ScrollView>
            {fields?.map((f: any) => (
              <Input
                key={f.key}
                label={f.label}
                value={values[f.key] || ''}
                onChangeText={(v: string) => setValues(prev => ({ ...prev, [f.key]: v }))}
                multiline={f.multiline}
                placeholder={f.placeholder}
              />
            ))}
          </ScrollView>
          <View style={modalStyles.actions}>
            <Button label="Cancel" variant="outline" onPress={onClose} />
            <Button label="Save Changes" onPress={() => onSave(values)} loading={loading} />
          </View>
        </View>
      </View>
    </Modal>
  );
}

const modalStyles = StyleSheet.create({
  backdrop: { flex: 1, backgroundColor: COLORS.modalBg, justifyContent: 'flex-end' },
  sheet: { backgroundColor: COLORS.surface, borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: SPACING.lg, maxHeight: SCREEN_H * 0.8, borderTopWidth: 1, borderColor: COLORS.border },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: SPACING.lg },
  title: { color: COLORS.textPrimary, fontSize: 18, fontWeight: '700' },
  actions: { flexDirection: 'row', gap: SPACING.sm, marginTop: SPACING.md },
});

export function SubscriptionModal({ visible, onClose }: any) {
  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={subStyles.backdrop}>
        <View style={subStyles.sheet}>
          <View style={subStyles.glowTop} />
          <TouchableOpacity onPress={onClose} style={subStyles.closeBtn}>
            <Ionicons name="close" size={22} color={COLORS.textSecondary} />
          </TouchableOpacity>
          <View style={subStyles.crown}>
            <Text style={{ fontSize: 40 }}>👑</Text>
          </View>
          <Text style={subStyles.heading}>Unlock Thematic Pro</Text>
          <Text style={subStyles.subheading}>Get unlimited access to all songs, playlists, and premium features</Text>

          <View style={subStyles.features}>
            {['Unlimited song downloads', 'Exclusive Pro playlists', 'Priority support', 'No watermarks', 'Commercial license'].map(f => (
              <View key={f} style={subStyles.featureRow}>
                <Ionicons name="checkmark-circle" size={18} color={COLORS.neon} />
                <Text style={subStyles.featureText}>{f}</Text>
              </View>
            ))}
          </View>

          <View style={subStyles.pricing}>
            <TouchableOpacity style={subStyles.planCard} activeOpacity={0.9}>
              <View style={subStyles.recommended}><Text style={subStyles.recommendedText}>BEST VALUE</Text></View>
              <Text style={subStyles.planName}>Annual</Text>
              <Text style={subStyles.planPrice}>$59.99<Text style={subStyles.perPeriod}>/year</Text></Text>
              <Text style={subStyles.planSave}>Save 50%</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[subStyles.planCard, subStyles.planCardAlt]} activeOpacity={0.9}>
              <Text style={subStyles.planName}>Monthly</Text>
              <Text style={subStyles.planPrice}>$9.99<Text style={subStyles.perPeriod}>/mo</Text></Text>
            </TouchableOpacity>
          </View>

          <Button label="Start Free Trial" size="lg" onPress={onClose} />
          <Text style={subStyles.disclaimer}>7-day free trial. Cancel anytime.</Text>
        </View>
      </View>
    </Modal>
  );
}

const subStyles = StyleSheet.create({
  backdrop: { flex: 1, backgroundColor: COLORS.modalBg, justifyContent: 'flex-end' },
  sheet: { backgroundColor: COLORS.surface, borderTopLeftRadius: 28, borderTopRightRadius: 28, padding: SPACING.lg, paddingBottom: 40, borderTopWidth: 1, borderColor: COLORS.border, overflow: 'hidden' },
  glowTop: { position: 'absolute', top: -60, left: 0, right: 0, height: 120, backgroundColor: COLORS.primaryGlow, borderRadius: 60 },
  closeBtn: { alignSelf: 'flex-end' },
  crown: { alignItems: 'center', marginVertical: SPACING.md },
  heading: { color: COLORS.textPrimary, fontSize: 24, fontWeight: '800', textAlign: 'center', marginBottom: 8 },
  subheading: { color: COLORS.textSecondary, fontSize: 14, textAlign: 'center', marginBottom: SPACING.lg, lineHeight: 20 },
  features: { marginBottom: SPACING.lg },
  featureRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 10 },
  featureText: { color: COLORS.textPrimary, fontSize: 14 },
  pricing: { flexDirection: 'row', gap: SPACING.sm, marginBottom: SPACING.lg },
  planCard: { flex: 1, backgroundColor: COLORS.primaryGlow, borderRadius: RADIUS.md, padding: SPACING.md, alignItems: 'center', borderWidth: 2, borderColor: COLORS.primary },
  planCardAlt: { backgroundColor: COLORS.surfaceAlt, borderColor: COLORS.border },
  recommended: { backgroundColor: COLORS.primary, borderRadius: RADIUS.sm, paddingHorizontal: 8, paddingVertical: 2, marginBottom: 8 },
  recommendedText: { color: '#fff', fontSize: 10, fontWeight: '800', letterSpacing: 1 },
  planName: { color: COLORS.textSecondary, fontSize: 12, fontWeight: '600', marginBottom: 4 },
  planPrice: { color: COLORS.textPrimary, fontSize: 22, fontWeight: '800' },
  perPeriod: { fontSize: 13, fontWeight: '400', color: COLORS.textSecondary },
  planSave: { color: COLORS.neon, fontSize: 12, fontWeight: '700', marginTop: 2 },
  disclaimer: { color: COLORS.textMuted, fontSize: 12, textAlign: 'center', marginTop: 12 },
});
