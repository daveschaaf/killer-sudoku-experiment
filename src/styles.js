export const colors = {
  background: "#f9f7f4",
  card: "#ffffff",
  primary: "#4f86c6",
  primaryDark: "#3a6fa8",
  text: "#1a1a1a",
  textSecondary: "#555555",
  border: "#d1d5db",
  disabled: "#c5c5c5",
  success: "#2563eb",
};

export const btn = {
  primary: {
    padding: "11px 32px",
    fontSize: 16,
    fontWeight: 600,
    backgroundColor: colors.primary,
    color: "#fff",
    border: "none",
    borderRadius: 8,
    cursor: "pointer",
  },
  disabled: {
    padding: "11px 32px",
    fontSize: 16,
    fontWeight: 600,
    backgroundColor: colors.disabled,
    color: "#fff",
    border: "none",
    borderRadius: 8,
    cursor: "not-allowed",
  },
};

export const input = {
  padding: "9px 12px",
  fontSize: 15,
  border: `1px solid ${colors.border}`,
  borderRadius: 8,
  width: "100%",
  boxSizing: "border-box",
  backgroundColor: "#fff",
  color: "#1a1a1a",
};

export const label = {
  display: "block",
  fontWeight: 600,
  marginBottom: 8,
  color: "#1a1a1a",
};

export const fieldGroup = {
  marginBottom: 24,
};
