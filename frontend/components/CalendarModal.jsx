import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const MONTH_NAMES = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
];

const WEEKDAYS = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

export default function CalendarModal({ visible, onClose, onSelectDate }) {
    const today = new Date();
    const [currentDate, setCurrentDate] = useState(today);

    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    const handlePrevMonth = () => {
        setCurrentDate(new Date(year, month - 1, 1));
    };

    const handleNextMonth = () => {
        setCurrentDate(new Date(year, month + 1, 1));
    };

    // Helper to generate calendar day matrix
    const generateDays = () => {
        const firstDayOfMonth = new Date(year, month, 1);
        let startDayIndex = firstDayOfMonth.getDay();
        // Adjust index so Mon=0, Tue=1 ... Sun=6
        startDayIndex = startDayIndex === 0 ? 6 : startDayIndex - 1;

        const lastDateOfPrevMonth = new Date(year, month, 0).getDate();
        const lastDateOfCurrentMonth = new Date(year, month + 1, 0).getDate();

        const dayList = [];

        // Previous month filler days
        for (let i = startDayIndex - 1; i >= 0; i--) {
            const d = lastDateOfPrevMonth - i;
            dayList.push({
                day: d,
                isCurrentMonth: false,
                dateStr: formatDateString(year, month - 1, d)
            });
        }

        // Current month days
        for (let i = 1; i <= lastDateOfCurrentMonth; i++) {
            dayList.push({
                day: i,
                isCurrentMonth: true,
                dateStr: formatDateString(year, month, i)
            });
        }

        // Next month filler days to complete grid (multiples of 7 up to 42)
        const totalCells = 42;
        const currentLength = dayList.length;
        for (let i = 1; i <= totalCells - currentLength; i++) {
            dayList.push({
                day: i,
                isCurrentMonth: false,
                dateStr: formatDateString(year, month + 1, i)
            });
        }

        return dayList;
    };

    const formatDateString = (y, m, d) => {
        // Handle year wrap
        let newYear = y;
        let newMonth = m;
        if (m < 0) {
            newYear -= 1;
            newMonth = 11;
        } else if (m > 11) {
            newYear += 1;
            newMonth = 0;
        }

        const mm = String(newMonth + 1).padStart(2, '0');
        const dd = String(d).padStart(2, '0');
        return `${newYear}-${mm}-${dd}`;
    };

    const handleDayPress = (dateStr) => {
        onSelectDate(dateStr);
        onClose();
    };

    const calendarGrid = generateDays();

    // Group days into rows of 7
    const rows = [];
    for (let i = 0; i < calendarGrid.length; i += 7) {
        rows.push(calendarGrid.slice(i, i + 7));
    }

    return (
        <Modal
            transparent
            visible={visible}
            animationType="fade"
            onRequestClose={onClose}
        >
            <TouchableOpacity
                activeOpacity={1}
                style={styles.modalOverlay}
                onPress={onClose}
            >
                <View
                    style={styles.calendarCard}
                    onStartShouldSetResponder={() => true} // prevents card clicks closing modal
                >
                    {/* Header */}
                    <View style={styles.header}>
                        <TouchableOpacity style={styles.navButton} onPress={handlePrevMonth}>
                            <Ionicons name="chevron-back" size={20} color="#172033" />
                        </TouchableOpacity>
                        <Text style={styles.headerTitle}>
                            {MONTH_NAMES[month]} {year}
                        </Text>
                        <TouchableOpacity style={styles.navButton} onPress={handleNextMonth}>
                            <Ionicons name="chevron-forward" size={20} color="#172033" />
                        </TouchableOpacity>
                    </View>

                    {/* Weekday Names */}
                    <View style={styles.weekdaysRow}>
                        {WEEKDAYS.map((day, idx) => (
                            <Text key={idx} style={styles.weekdayText}>{day}</Text>
                        ))}
                    </View>

                    {/* Days Grid */}
                    <View style={styles.gridContainer}>
                        {rows.map((row, rIdx) => (
                            <View key={rIdx} style={styles.gridRow}>
                                {row.map((cell, cIdx) => (
                                    <TouchableOpacity
                                        key={cIdx}
                                        style={[
                                            styles.dayCell,
                                            !cell.isCurrentMonth && styles.inactiveDayCell
                                        ]}
                                        onPress={() => handleDayPress(cell.dateStr)}
                                    >
                                        <Text
                                            style={[
                                                styles.dayText,
                                                !cell.isCurrentMonth && styles.inactiveDayText
                                            ]}
                                        >
                                            {cell.day}
                                        </Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        ))}
                    </View>

                    {/* Footer Close Button */}
                    <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                        <Text style={styles.closeButtonText}>CANCEL</Text>
                    </TouchableOpacity>
                </View>
            </TouchableOpacity>
        </Modal>
    );
}

const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(23, 32, 51, 0.4)', // dark overlay with slate hue
        justifyContent: 'center',
        alignItems: 'center',
        padding: 24,
    },
    calendarCard: {
        width: '100%',
        maxWidth: 340,
        backgroundColor: '#FFFFFF',
        borderRadius: 24,
        padding: 20,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.1,
        shadowRadius: 20,
        elevation: 10,
    },
    header: {
        flexDirection: 'row',
        width: '100%',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    navButton: {
        padding: 8,
        borderRadius: 12,
        backgroundColor: '#F8FAFC',
        borderWidth: 1,
        borderColor: '#E2E8F0',
    },
    headerTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#172033',
    },
    weekdaysRow: {
        flexDirection: 'row',
        width: '100%',
        justifyContent: 'space-between',
        marginBottom: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#E2E8F0',
        paddingBottom: 8,
    },
    weekdayText: {
        width: 38,
        textAlign: 'center',
        fontSize: 13,
        fontWeight: '700',
        color: '#64748B',
    },
    gridContainer: {
        width: '100%',
    },
    gridRow: {
        flexDirection: 'row',
        width: '100%',
        justifyContent: 'space-between',
        marginVertical: 4,
    },
    dayCell: {
        width: 38,
        height: 38,
        borderRadius: 19,
        justifyContent: 'center',
        alignItems: 'center',
    },
    inactiveDayCell: {
        opacity: 0.35,
    },
    dayText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#172033',
    },
    inactiveDayText: {
        color: '#64748B',
    },
    closeButton: {
        marginTop: 20,
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 14,
        backgroundColor: '#F8FAFC',
        borderWidth: 1,
        borderColor: '#E2E8F0',
        width: '100%',
        alignItems: 'center',
    },
    closeButtonText: {
        color: '#64748B',
        fontSize: 14,
        fontWeight: 'bold',
        letterSpacing: 0.5,
    },
});
