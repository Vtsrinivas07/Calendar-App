import React from 'react';
import { Paper, Typography, IconButton, Box, Chip } from '@mui/material';
import { Delete as DeleteIcon, Edit as EditIcon } from '@mui/icons-material';
import { format } from 'date-fns';

const EventItem = ({ event, onEdit, onDelete, view }) => {
  const handleDelete = (e) => {
    e.stopPropagation(); // Prevent event bubbling
    onDelete(event.id);
  };

  const handleEdit = (e) => {
    e.stopPropagation(); // Prevent event bubbling
    onEdit(event);
  };

  const getEventStyle = () => {
    const baseStyle = {
      p: 1,
      mb: 0.5,
      backgroundColor: event.color || '#757575',
      color: '#fff',
      cursor: 'pointer',
      '&:hover': {
        opacity: 0.9,
      },
    };

    if (view === 'day') {
      return {
        ...baseStyle,
        position: 'absolute',
        left: 0,
        right: 0,
        margin: '0 4px',
      };
    }

    return baseStyle;
  };

  return (
    <Paper
      elevation={1}
      sx={getEventStyle()}
      onClick={handleEdit}
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <Box sx={{ flex: 1 }}>
          <Typography variant="subtitle2" noWrap>
            {event.title}
          </Typography>
          {view !== 'month' && (
            <Typography variant="caption" display="block">
              {format(new Date(event.date), 'h:mm a')}
            </Typography>
          )}
          {event.category && (
            <Chip
              label={event.category}
              size="small"
              sx={{
                mt: 0.5,
                backgroundColor: 'rgba(255, 255, 255, 0.2)',
                color: '#fff',
                '& .MuiChip-label': {
                  px: 1,
                },
              }}
            />
          )}
        </Box>
        <Box sx={{ display: 'flex', gap: 0.5 }}>
          <IconButton
            size="small"
            onClick={handleEdit}
            sx={{ color: '#fff', p: 0.5 }}
          >
            <EditIcon fontSize="small" />
          </IconButton>
          <IconButton
            size="small"
            onClick={handleDelete}
            sx={{ color: '#fff', p: 0.5 }}
          >
            <DeleteIcon fontSize="small" />
          </IconButton>
        </Box>
      </Box>
    </Paper>
  );
};

export default EventItem; 