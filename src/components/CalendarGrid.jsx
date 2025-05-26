import React from 'react';
import { Box, Typography } from '@mui/material';
import { format, isSameDay, isToday } from 'date-fns';
import { useDrop } from 'react-dnd';
import EventItem from './EventItem';

const HOURS = Array.from({ length: 24 }, (_, i) => i);

const DayCell = ({ day, isOutsideMonth, events, holidays, onAddEvent, onEditEvent, onDeleteEvent, onEventDrop, view }) => {
  const [{ isOver }, drop] = useDrop(() => ({
    accept: 'EVENT',
    drop: (item) => {
      if (onEventDrop) onEventDrop(item.id, day);
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  }));

  // Find holidays for this day
  const dayHolidays = Array.isArray(holidays)
    ? holidays.filter(h => h.date && isSameDay(new Date(h.date), day))
    : [];

  return (
    <Box
      ref={drop}
      onClick={(e) => { if (e.target === e.currentTarget) onAddEvent(day); }}
      sx={{
        minHeight: '120px',
        padding: '8px',
        border: '1px solid #e0e0e0',
        backgroundColor: isOver ? '#f5f5f5' : 'white',
        opacity: isOutsideMonth ? 0.5 : 1,
        position: 'relative',
        '&:hover': {
          backgroundColor: '#f5f5f5',
        },
      }}
    >
      <Typography
        variant="body2"
        sx={{
          fontWeight: isToday(day) ? 'bold' : 'normal',
          color: isToday(day) ? 'primary.main' : 'text.primary',
          marginBottom: '8px',
        }}
      >
        {format(day, 'd')}
      </Typography>
      {/* Render holidays at the top */}
      {dayHolidays.map(holiday => (
        <Box key={holiday.localName || holiday.name} sx={{ mb: 0.5, background: '#fffbe6', borderRadius: 1, px: 1, py: 0.5, border: '1px solid #ffe082' }}>
          <Typography variant="caption" sx={{ color: '#b26a00', fontWeight: 600 }}>
            {holiday.localName || holiday.name}
          </Typography>
        </Box>
      ))}
      {/* Render events below holidays */}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
        {events.map((event) => (
          <EventItem
            key={event.id}
            event={event}
            onEdit={onEditEvent}
            onDelete={onDeleteEvent}
            view={view}
          />
        ))}
      </Box>
    </Box>
  );
};

const CalendarGrid = ({ days, events, currentDate, onAddEvent, onEditEvent, onDeleteEvent, view, categories, holidays, onEventDrop }) => {
  const getEventsForDay = (day) => {
    const dayDate = day instanceof Date ? day : (day.date || day);
    return events.filter(event => isSameDay(new Date(event.date), dayDate));
  };

  // Week view: single row of 7 days
  if (view === 'week') {
  return (
      <Box
                  sx={{
          display: 'grid',
          gridTemplateColumns: 'repeat(7, 1fr)',
          gap: '1px',
          backgroundColor: '#e0e0e0',
          border: '1px solid #e0e0e0',
        }}
      >
        {days.map((day, index) => (
          <React.Fragment key={index}>
            <DayCell
              day={typeof day === 'object' && 'date' in day ? day.date : day}
              isOutsideMonth={typeof day === 'object' && 'isOutsideMonth' in day ? day.isOutsideMonth : false}
              events={getEventsForDay(typeof day === 'object' && 'date' in day ? day.date : day)}
              holidays={holidays}
              onAddEvent={onAddEvent}
              onEditEvent={onEditEvent}
              onDeleteEvent={onDeleteEvent}
              onEventDrop={onEventDrop}
              view={view}
            />
          </React.Fragment>
        ))}
      </Box>
    );
  }

  // Day view: single column with time slots
  if (view === 'day') {
    const day = days[0];
    const dayEvents = getEventsForDay(day);
                        return (
      <Box sx={{ display: 'flex', flexDirection: 'column', border: '1px solid #e0e0e0', backgroundColor: '#fff' }}>
        {HOURS.map(hour => (
          <Box
            key={hour}
            sx={{
              minHeight: 48,
              borderBottom: '1px solid #e0e0e0',
              display: 'flex',
              alignItems: 'flex-start',
              position: 'relative',
              px: 2,
              py: 1,
            }}
            onClick={(e) => { if (e.target === e.currentTarget) onAddEvent(new Date(new Date(day).setHours(hour, 0, 0, 0))); }}
          >
            <Typography variant="caption" sx={{ width: 40, color: 'text.secondary', mr: 2 }}>
              {hour}:00
                            </Typography>
            <Box sx={{ flex: 1, position: 'relative' }}>
              {dayEvents
                .filter(event => new Date(event.date).getHours() === hour)
                .map(event => (
                                    <EventItem
                    key={event.id}
                                      event={event}
                                      onEdit={onEditEvent}
                                      onDelete={onDeleteEvent}
                                      view={view}
                                    />
                            ))}
                          </Box>
                                </Box>
                              ))}
                            </Box>
    );
  }

  // Default: month view
                            return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: 'repeat(7, 1fr)',
        gap: '1px',
        backgroundColor: '#e0e0e0',
        border: '1px solid #e0e0e0',
      }}
    >
      {days.map((day, index) => (
        <React.Fragment key={index}>
          <DayCell
            day={typeof day === 'object' && 'date' in day ? day.date : day}
            isOutsideMonth={typeof day === 'object' && 'isOutsideMonth' in day ? day.isOutsideMonth : false}
            events={getEventsForDay(typeof day === 'object' && 'date' in day ? day.date : day)}
            holidays={holidays}
            onAddEvent={onAddEvent}
            onEditEvent={onEditEvent}
            onDeleteEvent={onDeleteEvent}
            onEventDrop={onEventDrop}
                                      view={view}
                                    />
        </React.Fragment>
      ))}
      </Box>
  );
};

export default CalendarGrid; 