import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
    KeyboardAvoidingView,
    Modal,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

interface DraftModalProps {
  visible: boolean;
  onClose: () => void;
  draft: {
    emailId: string;
    draft: string;
    suggestedActions: string[];
  };
  onSend: (emailId: string, content: string) => Promise<void>;
  onEdit: (emailId: string, content: string) => Promise<void>;
}

export default function DraftModal({
  visible,
  onClose,
  draft,
  onSend,
  onEdit,
}: DraftModalProps) {
  const [editedDraft, setEditedDraft] = useState(draft.draft);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    try {
      setLoading(true);
      await onSend(draft.emailId, editedDraft);
      onClose();
    } catch (error) {
      console.error('Error sending email:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = async () => {
    try {
      setLoading(true);
      await onEdit(draft.emailId, editedDraft);
      setIsEditing(false);
    } catch (error) {
      console.error('Error editing draft:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.modalContainer}
      >
        <View style={styles.modalContent}>
          <View style={styles.header}>
            <Text style={styles.title}>Email Draft</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Ionicons name="close" size={24} color="#666" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.content}>
            <TextInput
              style={styles.draftInput}
              multiline
              value={editedDraft}
              onChangeText={setEditedDraft}
              editable={isEditing}
            />

            {!isEditing && (
              <View style={styles.suggestedActions}>
                <Text style={styles.suggestedTitle}>Suggested Actions:</Text>
                {draft.suggestedActions.map((action, index) => (
                  <TouchableOpacity
                    key={index}
                    style={styles.actionButton}
                    onPress={() => {
                      setEditedDraft(prev => `${prev}\n\n${action}`);
                    }}
                  >
                    <Text style={styles.actionText}>{action}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </ScrollView>

          <View style={styles.footer}>
            {isEditing ? (
              <>
                <TouchableOpacity
                  style={[styles.button, styles.cancelButton]}
                  onPress={() => {
                    setEditedDraft(draft.draft);
                    setIsEditing(false);
                  }}
                  disabled={loading}
                >
                  <Text style={styles.buttonText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.button, styles.saveButton]}
                  onPress={handleEdit}
                  disabled={loading}
                >
                  <Text style={styles.buttonText}>Save</Text>
                </TouchableOpacity>
              </>
            ) : (
              <>
                <TouchableOpacity
                  style={[styles.button, styles.editButton]}
                  onPress={() => setIsEditing(true)}
                  disabled={loading}
                >
                  <Text style={styles.buttonText}>Edit</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.button, styles.sendButton]}
                  onPress={handleSend}
                  disabled={loading}
                >
                  <Text style={styles.buttonText}>Send</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    height: '80%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  closeButton: {
    padding: 5,
  },
  content: {
    flex: 1,
    padding: 15,
  },
  draftInput: {
    minHeight: 150,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
    textAlignVertical: 'top',
  },
  suggestedActions: {
    marginTop: 20,
  },
  suggestedTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 10,
  },
  actionButton: {
    backgroundColor: '#f0f0f0',
    padding: 10,
    borderRadius: 8,
    marginBottom: 8,
  },
  actionText: {
    color: '#007AFF',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 15,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  button: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    marginHorizontal: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
  },
  editButton: {
    backgroundColor: '#666',
  },
  sendButton: {
    backgroundColor: '#007AFF',
  },
  cancelButton: {
    backgroundColor: '#666',
  },
  saveButton: {
    backgroundColor: '#34C759',
  },
}); 