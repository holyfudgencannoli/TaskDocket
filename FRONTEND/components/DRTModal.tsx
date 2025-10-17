import React, { useState, useEffect } from "react";
import { Modal, View, Text, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import CrossPlatformDateTimePicker from "./CrossPlatformDateTimePicker";


interface Task {
  id: number;
  name: string;
  due_datetime: string;
  priority: string;
}



type TaskModalProps = {
  visible: boolean;
  task?: Task | null;
  onClose: () => void;
  onSave: (task: Task, newDueDate: string) => void; // send original task + new due date
};

export const DRTModal: React.FC<TaskModalProps> = ({ visible, task, onClose, onSave }) => {
  const [newDueDate, setNewDueDate] = useState(new Date());

  if (!task) return null;

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <Text style={styles.title}>Set Next Due Date for:</Text>
          <Text style={styles.subtitle}>"{task.name}"</Text>

          {/* <TouchableOpacity onPress={() => setShowDatePicker(true)}>
            <Text style={styles.dateLabel}>
              {newDueDate
                ? new Date(newDueDate).toLocaleString()
                : task.due_datetime
                ? new Date(task.due_datetime).toLocaleString()
                : "Set Due Date"}
            </Text>
          </TouchableOpacity> */}
            <CrossPlatformDateTimePicker
                datetime={newDueDate}
                onChangeDate={setNewDueDate}
            />
          {/* {showDatePicker && (
            <DateTimePicker
              value={newDueDate ? new Date(newDueDate) : new Date(task.due_datetime || new Date())}
              mode="datetime"
              onChange={(_, date) => {
                if (date) setNewDueDate(date.toISOString());
                setTimeout(() => {
                    setShowDatePicker(false);
                }, 5000);
              }}
            />
          )} */}

          <View style={styles.buttonRow}>
            <TouchableOpacity onPress={onClose} style={[styles.button, styles.cancel]}>
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => {
                if (newDueDate) onSave(task, newDueDate);
                onClose();
              }}
              style={[styles.button, styles.save]}
            >
              <Text style={styles.buttonText}>Mark Complete</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};


const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
  },
  modal: {
    width: "90%",
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 20,
    fontWeight: "400",
    marginBottom: 12,
    textAlign: 'center'
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
  },
  dateLabel: {
    padding: 10,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    marginBottom: 10,
    color: "#555",
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 10,
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  cancel: {
    backgroundColor: "#aaa",
    marginRight: 10,
  },
  save: {
    backgroundColor: "#007bff",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "600",
  },
});
